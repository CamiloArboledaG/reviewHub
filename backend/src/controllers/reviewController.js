import mongoose from 'mongoose';
import {
  calculateReviewBaseScore,
  calculateReviewFinalScore,
  updateReviewScore
} from '../utils/scoreCalculator.js';

const Review = mongoose.model('Review');
const Category = mongoose.model('Category');
const Item = mongoose.model('Item');
const User = mongoose.model('User');

export const createReview = async (req, res) => {
  try {
    const { itemId, rating, content } = req.body;

    if (!itemId || !rating || !content) {
      return res.status(400).json({
        message: 'Item, calificación y contenido son requeridos'
      });
    }

    if (rating < 0.5 || rating > 5) {
      return res.status(400).json({
        message: 'La calificación debe estar entre 0.5 y 5'
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      item: itemId
    });

    if (existingReview) {
      return res.status(400).json({
        message: 'Ya has creado una reseña para este item'
      });
    }

    const reviewData = {
      user: req.user._id,
      item: itemId,
      rating: {
        value: rating,
        max: 5
      },
      content: content.trim(),
      likesCount: 0,
      commentsCount: 0,
    };

    reviewData.baseScore = calculateReviewBaseScore({ ...reviewData, createdAt: new Date() });

    const review = await Review.create(reviewData);

    const populatedReview = await Review.findById(review._id)
      .populate({
        path: 'user',
        select: 'name username _id',
        populate: { path: 'avatar', select: 'imageUrl name' }
      })
      .populate({
        path: 'item',
        populate: {
          path: 'category',
          select: 'name slug'
        }
      });

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error al crear la reseña', error: error.message });
  }
};

export const getReviews = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  let categorySlugs = req.query.category;
  const followingOnly = req.query.followingOnly === 'true';

  try {
    let query = {};
    let currentUser = null;
    let followingSet = new Set();
    let likedReviewIds = new Set();

    if (req.user) {
      currentUser = await User.findById(req.user._id).select('following').lean();
      followingSet = new Set(currentUser?.following?.map(id => id.toString()) || []);

      const userLikedReviews = await Review.find({ likes: req.user._id }).select('_id').lean();
      likedReviewIds = new Set(userLikedReviews.map(r => r._id.toString()));
    }

    if (followingOnly && req.user) {
      if (!currentUser || currentUser.following.length === 0) {
        return res.json({
          reviews: [],
          currentPage: 1,
          totalPages: 0,
          totalReviews: 0,
          hasNextPage: false,
        });
      }
      query.user = { $in: currentUser.following };
    }

    if (categorySlugs) {
      if (!Array.isArray(categorySlugs)) {
        categorySlugs = [categorySlugs];
      }

      if (categorySlugs.length > 0) {
        const categories = await Category.find({ slug: { $in: categorySlugs } });
        if (categories.length > 0) {
          const categoryIds = categories.map(cat => cat._id);
          const itemsInCategory = await Item.find({ category: { $in: categoryIds } }).select('_id');
          const itemIds = itemsInCategory.map(item => item._id);
          query.item = { $in: itemIds };
        } else {
          return res.json({
            reviews: [],
            currentPage: 1,
            totalPages: 0,
            totalReviews: 0,
            hasNextPage: false,
          });
        }
      }
    }

    if (req.user && likedReviewIds.size > 0) {
      query._id = { $nin: Array.from(likedReviewIds) };
    }

    const fetchLimit = Math.max(limit * 3, 30);

    const totalReviews = await Review.countDocuments(query);

    let reviews = await Review.find(query)
      .sort({ baseScore: -1, createdAt: -1 })
      .skip(Math.max(0, skip - limit))
      .limit(fetchLimit + limit)
      .populate({
        path: 'user',
        select: 'name username _id',
        populate: { path: 'avatar', select: 'imageUrl name' }
      })
      .populate({
        path: 'item',
        populate: {
          path: 'category',
          select: 'name slug'
        }
      })
      .lean();

    const currentUserId = req.user?._id?.toString();

    reviews = reviews.map(review => {
      const finalScore = calculateReviewFinalScore(review, {
        followingSet,
        likedByUser: false,
      });

      return {
        ...review,
        isFollowing: followingSet.has(review.user._id.toString()),
        isLiked: currentUserId ? review.likes.some(likeId => likeId.toString() === currentUserId) : false,
        likes: review.likesCount ?? review.likes.length,
        comments: review.commentsCount ?? review.comments.length,
        finalScore,
      };
    });

    reviews.sort((a, b) => b.finalScore - a.finalScore);

    const adjustedSkip = skip > 0 ? limit : 0;
    const paginatedReviews = reviews.slice(adjustedSkip, adjustedSkip + limit);

    const totalPages = Math.ceil(totalReviews / limit);
    const hasNextPage = page < totalPages;

    res.json({
      reviews: paginatedReviews.map(({ finalScore, baseScore, lastScoreUpdate, ...review }) => review),
      currentPage: page,
      totalPages,
      totalReviews,
      hasNextPage,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

export const likeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    if (review.likes.includes(userId)) {
      return res.status(400).json({ message: 'Ya has dado me gusta a esta reseña' });
    }

    review.likes.push(userId);
    review.likesCount = review.likes.length;
    review.baseScore = calculateReviewBaseScore(review);
    review.lastScoreUpdate = new Date();
    await review.save();

    res.json({ message: 'Me gusta agregado exitosamente', likesCount: review.likesCount });
  } catch (error) {
    console.error('Error liking review:', error);
    res.status(500).json({ message: 'Error al dar me gusta', error: error.message });
  }
};

export const unlikeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    if (!review.likes.includes(userId)) {
      return res.status(400).json({ message: 'No has dado me gusta a esta reseña' });
    }

    review.likes = review.likes.filter(likeId => likeId.toString() !== userId.toString());
    review.likesCount = review.likes.length;
    review.baseScore = calculateReviewBaseScore(review);
    review.lastScoreUpdate = new Date();
    await review.save();

    res.json({ message: 'Me gusta eliminado exitosamente', likesCount: review.likesCount });
  } catch (error) {
    console.error('Error unliking review:', error);
    res.status(500).json({ message: 'Error al quitar me gusta', error: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate({
        path: 'user',
        select: 'name username _id',
        populate: { path: 'avatar', select: 'imageUrl name' }
      })
      .populate({
        path: 'item',
        populate: {
          path: 'category',
          select: 'name slug'
        }
      })
      .lean();

    if (!review) {
      return res.status(404).json({ message: 'Review no encontrado' });
    }

    const currentUserId = req.user?._id?.toString();
    const followingSet = req.user
      ? new Set((await User.findById(req.user._id).select('following').lean())?.following.map(id => id.toString()) || [])
      : new Set();

    const enrichedReview = {
      ...review,
      isFollowing: followingSet.has(review.user._id.toString()),
      isLiked: currentUserId ? review.likes.some(likeId => likeId.toString() === currentUserId) : false,
      likes: review.likes.length,
      comments: review.comments.length,
    };

    res.json(enrichedReview);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Error al obtener el review', error: error.message });
  }
};
