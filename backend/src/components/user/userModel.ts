import mongoose from 'mongoose';

const userSchema: mongoose.Schema = new mongoose.Schema({
  username: { type: String, required: true },
  location: { type: String },
  hashedPassword: { type: String, required: true },
  posts: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  comments: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
});

export default mongoose.model('User', userSchema);
