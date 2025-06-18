import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.get('/messages/:userId1/:userId2', async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId1, recipientId: userId2 },
        { senderId: userId2, recipientId: userId1 }
      ]
    }).sort({ timestamp: 1 }); // Sắp xếp theo thời gian tăng dần

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

router.post('/messages', upload.single('image'), async (req, res) => {
  const { senderId, recipientId, messageType, message } = req.body;
  let imageUrl = "";

  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const newMessage = new Message({
      senderId,
      recipientId,
      message: message || "",
      imageUrl,
      messageType,
    });

    await newMessage.save();
    const senderInfo = await User.findById(senderId).select('username avatar');
    // Emit socket event tại đây nếu cần:
      req.app.get('io').to(recipientId).emit('private_message', {
        senderId,
        senderInfo, 
        message: newMessage.message,
        messageType: newMessage.messageType,
        timestamp: newMessage.timestamp,
      });
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

export default router;
