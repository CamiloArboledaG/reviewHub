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

export const getReviews = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  let categorySlugs = req.query.category;

  try {
    let query = {};

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
          // Si ninguno de los slugs de categoría existe, no devolver ninguna reseña
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

    const reviewsPromise = Review.find(query)
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
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const countPromise = Review.countDocuments(query);

    let [reviews, totalReviews] = await Promise.all([reviewsPromise, countPromise]);

    if (req.user) {
        const currentUser = await User.findById(req.user._id).select('following').lean();
        const followingSet = currentUser ? new Set(currentUser.following.map(id => id.toString())) : new Set();
        
        reviews = reviews.map(review => ({
            ...review,
            isFollowing: followingSet.has(review.user._id.toString()),
        }));
    } else {
        reviews = reviews.map(review => ({
            ...review,
            isFollowing: false,
        }));
    }

    const totalPages = Math.ceil(totalReviews / limit);
    const hasNextPage = page < totalPages;

    res.json({
      reviews,
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
