const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Format user object for response
const format = (user, token) => {
  const { _id, first_name, last_name, email } = user;

  return {
    id: _id, // Use _id from MongoDB
    first_name,
    last_name,
    email,
    token,
  };
};

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    user: {
      id: user._id,
      is_admin: user.is_admin,
    },
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    // Use env variable for secret
    expiresIn: '1d',
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Check if the user already exists
    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Create new user instance
    user = new UserModel({ first_name, last_name, email, password });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Generate token for the new user
    const token = generateToken(user);

    // Send response with user data and token
    res.status(201).json({
      message: 'User registered successfully',
      data: format(user, token),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email has not been registered' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Generate token for the user
    const token = generateToken(user);

    // Send response with user data and token
    res.status(200).json({
      message: 'User logged in successfully',
      data: format(user, token),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
