import mongoose from 'mongoose';
const Review = mongoose.model('Review');
const Category = mongoose.model('Category');
const Item = mongoose.model('Item');
const User = mongoose.model('User');


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
