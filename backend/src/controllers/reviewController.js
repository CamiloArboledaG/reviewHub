import mongoose from 'mongoose';
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

    const review = await Review.create({
      user: req.user._id,
      item: itemId,
      rating: {
        value: rating,
        max: 5
      },
      content: content.trim()
    });

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

const calculateReviewScore = (review, followingSet = new Set()) => {
  const now = new Date();
  const reviewDate = new Date(review.createdAt);
  const hoursSincePost = (now - reviewDate) / (1000 * 60 * 60);

  const recencyScore = Math.exp(-hoursSincePost / 72);

  const engagementScore = (review.likes.length * 2) + (review.comments.length * 3);

  const ratingValue = review.rating?.value || 0;
  let ratingInterest = 1;
  if (ratingValue >= 4.5 || ratingValue <= 2) {
    ratingInterest = 1.5;
  } else if (ratingValue >= 4 || ratingValue <= 2.5) {
    ratingInterest = 1.2;
  }

  const followingBoost = followingSet.has(review.user._id?.toString()) ? 1.3 : 1;

  const score = (recencyScore * 10) + (engagementScore * 0.5) + ratingInterest;
  return score * followingBoost;
};

export const getReviews = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  let categorySlugs = req.query.category;
  const followingOnly = req.query.followingOnly === 'true';

  try {
    let query = {};

    if (followingOnly && req.user) {
      const currentUser = await User.findById(req.user._id).select('following').lean();
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

    let reviews = await Review.find(query)
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

    const followingSet = req.user
      ? new Set((await User.findById(req.user._id).select('following').lean())?.following.map(id => id.toString()) || [])
      : new Set();

    const currentUserId = req.user?._id?.toString();

    reviews = reviews.map(review => ({
      ...review,
      isFollowing: followingSet.has(review.user._id.toString()),
      isLiked: currentUserId ? review.likes.some(likeId => likeId.toString() === currentUserId) : false,
      likes: review.likes.length,
      score: calculateReviewScore(review, followingSet)
    }));

    reviews.sort((a, b) => b.score - a.score);

    const totalReviews = reviews.length;
    const paginatedReviews = reviews.slice(skip, skip + limit);

    const totalPages = Math.ceil(totalReviews / limit);
    const hasNextPage = page < totalPages;

    res.json({
      reviews: paginatedReviews.map(({ score, ...review }) => review),
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
    await review.save();

    res.json({ message: 'Me gusta agregado exitosamente', likesCount: review.likes.length });
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
    await review.save();

    res.json({ message: 'Me gusta eliminado exitosamente', likesCount: review.likes.length });
  } catch (error) {
    console.error('Error unliking review:', error);
    res.status(500).json({ message: 'Error al quitar me gusta', error: error.message });
  }
};
