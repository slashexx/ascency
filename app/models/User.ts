import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema); 