import mongoose from 'mongoose';
const Comment = mongoose.model('Comment');
const Review = mongoose.model('Review');
const User = mongoose.model('User');

const calculateCommentScore = (comment, context) => {
  const now = new Date();
  const commentDate = new Date(comment.createdAt);
  const hoursSincePost = (now - commentDate) / (1000 * 60 * 60);

  const recencyScore = Math.exp(-hoursSincePost / 24);

  const likesScore = comment.likes.length * 2;
  const repliesScore = comment.replies.length * 3;
  const engagementScore = likesScore + repliesScore;

  const isReviewAuthor = comment.user._id.toString() === context.reviewAuthorId;
  const authorBoost = isReviewAuthor ? 2.0 : 1.0;

  const isFollowing = context.followingSet.has(comment.user._id.toString());
  const followingBoost = isFollowing ? 1.3 : 1.0;

  const baseScore = (recencyScore * 5) + (engagementScore * 0.8);
  const finalScore = baseScore * authorBoost * followingBoost;

  return finalScore;
};

export const getReviewComments = async (req, res) => {
  const { reviewId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || 'top';

  try {
    const review = await Review.findById(reviewId).select('user');
    if (!review) {
      return res.status(404).json({ message: 'Review no encontrado' });
    }

    let comments = await Comment.find({
      review: reviewId,
      parentComment: null
    })
      .populate({
        path: 'user',
        select: 'name username _id',
        populate: { path: 'avatar', select: 'imageUrl name' }
      })
      .lean();

    const followingSet = req.user
      ? new Set((await User.findById(req.user._id).select('following').lean())?.following.map(id => id.toString()) || [])
      : new Set();

    const currentUserId = req.user?._id?.toString();

    comments = comments.map(comment => ({
      ...comment,
      isLiked: currentUserId ? comment.likes.some(likeId => likeId.toString() === currentUserId) : false,
      likes: comment.likes.length,
      repliesCount: comment.replies.length,
      score: sort === 'top' ? calculateCommentScore(comment, {
        reviewAuthorId: review.user.toString(),
        followingSet
      }) : 0
    }));

    if (sort === 'top') {
      comments.sort((a, b) => b.score - a.score);
    } else if (sort === 'recent') {
      comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'oldest') {
      comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    const totalComments = comments.length;
    const paginatedComments = comments.slice(skip, skip + limit);

    const totalPages = Math.ceil(totalComments / limit);
    const hasNextPage = page < totalPages;

    res.json({
      comments: paginatedComments.map(({ score, ...comment }) => comment),
      currentPage: page,
      totalPages,
      totalComments,
      hasNextPage,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error al obtener comentarios', error: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'El contenido del comentario es requerido' });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: 'El comentario no puede exceder 500 caracteres' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review no encontrado' });
    }

    const comment = await Comment.create({
      user: req.user._id,
      review: reviewId,
      content: content.trim(),
      parentComment: null,
    });

    review.comments.push(comment._id);
    await review.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate({
        path: 'user',
        select: 'name username _id',
        populate: { path: 'avatar', select: 'imageUrl name' }
      });

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error al crear el comentario', error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
    }

    const review = await Review.findById(comment.review);
    if (review) {
      review.comments = review.comments.filter(commentId => commentId.toString() !== id);
      await review.save();
    }

    if (comment.parentComment) {
      const parentComment = await Comment.findById(comment.parentComment);
      if (parentComment) {
        parentComment.replies = parentComment.replies.filter(replyId => replyId.toString() !== id);
        await parentComment.save();
      }
    }

    await Comment.deleteMany({ parentComment: id });

    await Comment.findByIdAndDelete(id);

    res.json({ message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error al eliminar el comentario', error: error.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (comment.likes.includes(userId)) {
      return res.status(400).json({ message: 'Ya has dado me gusta a este comentario' });
    }

    comment.likes.push(userId);
    await comment.save();

    res.json({ message: 'Me gusta agregado exitosamente', likesCount: comment.likes.length });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ message: 'Error al dar me gusta', error: error.message });
  }
};

export const unlikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (!comment.likes.includes(userId)) {
      return res.status(400).json({ message: 'No has dado me gusta a este comentario' });
    }

    comment.likes = comment.likes.filter(likeId => likeId.toString() !== userId.toString());
    await comment.save();

    res.json({ message: 'Me gusta eliminado exitosamente', likesCount: comment.likes.length });
  } catch (error) {
    console.error('Error unliking comment:', error);
    res.status(500).json({ message: 'Error al quitar me gusta', error: error.message });
  }
};
