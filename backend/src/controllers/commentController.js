import mongoose from 'mongoose';
import {
  calculateCommentBaseScore,
  calculateCommentFinalScore,
} from '../utils/scoreCalculator.js';

const Comment = mongoose.model('Comment');
const Review = mongoose.model('Review');
const User = mongoose.model('User');

const REPLIES_PREVIEW_LIMIT = 2;

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

    const baseQuery = { review: reviewId, parentComment: null };

    const totalComments = await Comment.countDocuments(baseQuery);

    let sortOption = {};
    if (sort === 'top') {
      sortOption = { baseScore: -1, createdAt: -1 };
    } else if (sort === 'recent') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    let comments = await Comment.find(baseQuery)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'user',
        select: 'name username _id',
        populate: { path: 'avatar', select: 'imageUrl name' }
      })
      .lean();

    const currentUserId = req.user?._id?.toString();

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const repliesPreview = await Comment.find({ parentComment: comment._id })
          .sort({ createdAt: 1 })
          .limit(REPLIES_PREVIEW_LIMIT)
          .populate({
            path: 'user',
            select: 'name username _id',
            populate: { path: 'avatar', select: 'imageUrl name' }
          })
          .lean();

        const totalReplies = comment.repliesCount ?? comment.replies?.length ?? 0;
        const hasMoreReplies = totalReplies > REPLIES_PREVIEW_LIMIT;

        return {
          ...comment,
          isLiked: currentUserId ? comment.likes.some(likeId => likeId.toString() === currentUserId) : false,
          likes: comment.likesCount ?? comment.likes.length,
          repliesCount: totalReplies,
          hasMoreReplies,
          replies: repliesPreview.map(reply => ({
            ...reply,
            isLiked: currentUserId ? reply.likes.some(likeId => likeId.toString() === currentUserId) : false,
            likes: reply.likesCount ?? reply.likes.length,
          })),
        };
      })
    );

    const totalPages = Math.ceil(totalComments / limit);
    const hasNextPage = page < totalPages;

    res.json({
      comments: commentsWithReplies.map(({ baseScore, ...comment }) => ({
        ...comment,
        replies: comment.replies.map(({ baseScore: _, ...reply }) => reply),
      })),
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

export const getCommentReplies = async (req, res) => {
  const { commentId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    const totalReplies = await Comment.countDocuments({ parentComment: commentId });

    const replies = await Comment.find({ parentComment: commentId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'user',
        select: 'name username _id',
        populate: { path: 'avatar', select: 'imageUrl name' }
      })
      .lean();

    const currentUserId = req.user?._id?.toString();

    const formattedReplies = replies.map(reply => ({
      ...reply,
      isLiked: currentUserId ? reply.likes.some(likeId => likeId.toString() === currentUserId) : false,
      likes: reply.likesCount ?? reply.likes.length,
    }));

    const totalPages = Math.ceil(totalReplies / limit);
    const hasNextPage = page < totalPages;

    res.json({
      replies: formattedReplies.map(({ baseScore, ...reply }) => reply),
      currentPage: page,
      totalPages,
      totalReplies,
      hasNextPage,
    });
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ message: 'Error al obtener respuestas', error: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content, parentCommentId } = req.body;

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

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Comentario padre no encontrado' });
      }

      if (parentComment.parentComment) {
        return res.status(400).json({ message: 'No puedes responder a una respuesta. Solo se permite un nivel de anidación.' });
      }
    }

    const commentData = {
      user: req.user._id,
      review: reviewId,
      content: content.trim(),
      parentComment: parentCommentId || null,
      likesCount: 0,
      repliesCount: 0,
    };

    const reviewAuthorId = parentCommentId ? null : review.user.toString();
    commentData.baseScore = calculateCommentBaseScore({ ...commentData, createdAt: new Date() }, reviewAuthorId);

    const comment = await Comment.create(commentData);

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      parentComment.replies.push(comment._id);
      parentComment.repliesCount = parentComment.replies.length;
      parentComment.baseScore = calculateCommentBaseScore(parentComment, review.user.toString());
      await parentComment.save();
    } else {
      review.comments.push(comment._id);
      review.commentsCount = review.comments.length;
      await review.save();
    }

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
      review.commentsCount = review.comments.length;
      await review.save();
    }

    if (comment.parentComment) {
      const parentComment = await Comment.findById(comment.parentComment);
      if (parentComment) {
        parentComment.replies = parentComment.replies.filter(replyId => replyId.toString() !== id);
        parentComment.repliesCount = parentComment.replies.length;
        parentComment.baseScore = calculateCommentBaseScore(parentComment, review?.user?.toString());
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

    const review = await Review.findById(comment.review).select('user');
    const reviewAuthorId = review?.user?.toString();

    comment.likes.push(userId);
    comment.likesCount = comment.likes.length;
    comment.baseScore = calculateCommentBaseScore(comment, reviewAuthorId);
    await comment.save();

    res.json({ message: 'Me gusta agregado exitosamente', likesCount: comment.likesCount });
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

    const review = await Review.findById(comment.review).select('user');
    const reviewAuthorId = review?.user?.toString();

    comment.likes = comment.likes.filter(likeId => likeId.toString() !== userId.toString());
    comment.likesCount = comment.likes.length;
    comment.baseScore = calculateCommentBaseScore(comment, reviewAuthorId);
    await comment.save();

    res.json({ message: 'Me gusta eliminado exitosamente', likesCount: comment.likesCount });
  } catch (error) {
    console.error('Error unliking comment:', error);
    res.status(500).json({ message: 'Error al quitar me gusta', error: error.message });
  }
};
