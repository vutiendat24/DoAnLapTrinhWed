import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '/placeholder.svg' },
  isOnline: {type:Boolean, default:false}
});
const User = mongoose.model('User', UserSchema);

export default User;
