import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from '../utils/responseUtil.js';
import ErrorCode from '../utils/errorCodes.js';
import neo4jDriver from '../config/neo4j.js';
const router = express.Router();

// Register

router.post('/register', async (req, res) => {
  const { username, email, password, avatar } = req.body;
  const session = neo4jDriver.session();

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

    // Tạo user trong MongoDB
    const newUser = new User({ username, email, password: hashedPassword, avatar });
    await newUser.save();

    // Sau khi lưu MongoDB xong, tạo node User trong Neo4j
    await session.run(
      'CREATE (u:User {id: $id, name: $name, email: $email})',
      {
        id: newUser._id.toString(),   // Dùng MongoDB _id làm id trong Neo4j
        name: username,               // Dùng username gán cho name trong Neo4j
        email,
      }
    );
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
    console.error('Error during registration:', err);
    res.status(500).json({
      statusCode: 5000,
      message: 'Server error: ' + err.message,
      data: []
    });
  } finally {
    await session.close();
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
     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      statusCode: 1000,
      message: 'Success',
      data: [{
        token,
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

export default router;
