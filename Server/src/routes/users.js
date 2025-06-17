import express from 'express';
import { driver, UserModel } from '../db.js';

const router = express.Router();

router.get('/friends/:userId', async (req, res) => {
  const { userId } = req.params;
  const session = neo4jDriver.session();

  try {
    // Lấy danh sách ID bạn bè từ Neo4j
    const result = await session.run(
      'MATCH (u:User {id: $userId})-[:FRIENDS]->(friend:User) RETURN friend.id AS friendId',
      { userId }
    );

    const friendIds = result.records.map(record => record.get('friendId'));

    // Lấy thông tin chi tiết bạn bè từ MongoDB
    const friends = await User.find({ _id: { $in: friendIds } });

    res.json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).send('Error fetching friends');
  } finally {
    await session.close();
  }
});

export default router;
