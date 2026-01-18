import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  rating: {
    value: {
        type: Number,
        required: true,
        min: 0.5,
        max: 5,
    },
    max: {
        type: Number,
        required: true,
        default: 5,
    }
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  likesCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  baseScore: {
    type: Number,
    default: 0,
    index: true,
  },
  lastScoreUpdate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

reviewSchema.index({ baseScore: -1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review; 