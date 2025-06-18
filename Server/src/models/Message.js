import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  recipientId: { type: String, required: true },
  message: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  messageType: { type: String, enum: ['text', 'image'], required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});
const Message = mongoose.model('Message', messageSchema);

export default Message;
