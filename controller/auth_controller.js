const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Format user object for response
const format = (user, token) => {
  const { _id, first_name, last_name, email, image } = user;

  return {
    id: _id, // Use _id from MongoDB
    first_name,
    last_name,
    email,
    image,
    token,
  };
};

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    user: {
      _id: user._id,
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
    const {
      first_name,
      last_name,
      email,
      password,
      is_host = false,
      is_admin = false,
    } = req.body;

    // Check if the user already exists
    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Create new user instance
    user = new UserModel({
      first_name,
      last_name,
      email,
      password,
      image: null,
      is_host,
      is_admin,
    });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Send response with user data and token
    res.status(201).json({
      message: 'User registered successfully',
      data: format(user, ''),
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

    // Compare provided password with stored hashed password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
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
