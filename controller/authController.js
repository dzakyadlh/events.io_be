const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const format = (user, token) => {
  const { first_name, last_name, email } = user;

  return {
    first_name,
    last_name,
    email,
    token,
  };
};

const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };
  return jwt.sign(payload, 'qSvHiBDspNIfd28Y1mJpPMFNT3WoUHxT', {
    expiresIn: '1d',
  });
};

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already registered' });
    }

    user = new UserModel({ first_name, last_name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      data: format(user, token),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email has not been registered' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'User logged in successfully',
      data: format(user, token),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
