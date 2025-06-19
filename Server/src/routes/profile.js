 
import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/postModel.js';
import driver from '../config/neo4j.js';

const router = express.Router();




  router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const session = driver.session();
  const { presentUserId } = req.query; 
  try {
    // Lấy thông tin từ MongoDB
    const mongoUser = await User.findById(userId).select('-password'); // không trả password
    const postsCount = await Post.countDocuments({ author: userId });
    if (!mongoUser) {
      return res.status(404).json({ message: 'User not found in MongoDB' });
    }

    // Lấy số lượng bạn bè từ Neo4j
    const neo4jQuery = `
      MATCH (u:User {id: $userId})-[:FRIEND]-(friend:User)
      RETURN count(DISTINCT friend) AS friendsCount
    `;
    const result = await session.run(neo4jQuery, { userId });
    const checkFriend = await session.run(
      `
      MATCH (u1:User {id: $presentUserId})-[:FRIEND]-(u2:User {id: $userId})
      RETURN count(u2) AS isFriend
      `,
      { presentUserId, userId }
    );

    const isFriend = checkFriend.records[0].get('isFriend').toInt() > 0;
    
    const friendsCount = result.records[0].get('friendsCount').toInt();

    const userData = {
      _id: mongoUser._id,
      username: mongoUser.username,
      email: mongoUser.email,
      avatar: mongoUser.avatar,
      isOnline: true, // Tạm gán true, có thể lấy online từ socket sau
      isFriend,
      profile: {
        fullName: mongoUser.username,
        bio: mongoUser.profile.bio || null,
        friendsCount,
        postsCount: postsCount, 
        coverPhoto: mongoUser.profile.coverPhoto || mongoUser.profile.avatar
      }
    };

    res.status(200).json(userData);

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await session.close();
  }
});

export default router;
