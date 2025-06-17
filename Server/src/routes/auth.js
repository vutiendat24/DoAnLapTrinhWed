 
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

const { successResponse, errorResponse } = require('../utils/responseUtil');
const ErrorCode = require('../utils/errorCodes');



// Register
router.post('/register', async (req, res) => {
  const { username, email, password, avatar} = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        statusCode: 4001,
        message: 'Email already exists',
        data: []
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, avatar });
    await newUser.save();

    res.json({
      statusCode: 1000,
      message: 'Success',
      data: [{
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar
      }]
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 5000,
      message: 'Server error: ' + err.message,
      data: []
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
   try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        statusCode: 4002,
        message: 'User not found',
        data: []
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        statusCode: 4003,
        message: 'Invalid credentials',
        data: []
      });
    }

    res.json({
      statusCode: 1000,
      message: 'Success',
      data: [{
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }]
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 5000,
      message: 'Server error: ' + err.message,
      data: []
    });
  }
});

module.exports = router;
