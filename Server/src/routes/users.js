
import express from 'express';


import neo4jDriver from '../config/neo4j.js';
import User from '../models/User.js';


const router = express.Router();


router.get('/friends/:userId', async (req, res) => {
  const { userId } = req.params;
  const session = neo4jDriver.session();

  try {
    // Query Neo4j để lấy danh sách friendId
    const result = await session.run(
      'MATCH (u:User {id: $userId})-[:FRIEND]->(f:User) RETURN f.id AS friendId',
      { userId }
    );

    const friendIds = result.records.map(record => record.get('friendId'));

    // Lấy chi tiết user từ MongoDB
    const friends = await User.find({ _id: { $in: friendIds } });
    const normalizedFriends = friends.map(friend => ({
      id: friend._id,
      username: friend.username,
      email: friend.email,
      avatar: friend.avatar,
      isOnline: friend.isOnline
    }));
    res.json(normalizedFriends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await session.close();
  }
});

import { register, login } from '../controllers/authController.js';

router.post("/register", register);
router.post("/login", login);



export default router;