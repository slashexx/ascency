import mongoose, { Schema, models } from 'mongoose';

const RoadmapSchema = new Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Roadmap = models.Roadmap || mongoose.model('Roadmap', RoadmapSchema); 