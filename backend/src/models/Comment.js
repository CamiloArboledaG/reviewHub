import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  likesCount: {
    type: Number,
    default: 0,
  },
  repliesCount: {
    type: Number,
    default: 0,
  },
  baseScore: {
    type: Number,
    default: 0,
    index: true,
  },
}, { timestamps: true });

commentSchema.index({ review: 1, parentComment: 1, baseScore: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment; 