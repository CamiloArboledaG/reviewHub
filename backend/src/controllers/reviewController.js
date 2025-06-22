import mongoose from 'mongoose';
const Review = mongoose.model('Review');

export const getReviews = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const reviewsPromise = Review.find()
      .populate({
        path: 'user',
        select: 'name username avatarUrl'
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
      .lean(); // Use lean for faster queries

    const countPromise = Review.countDocuments();

    const [reviews, totalReviews] = await Promise.all([reviewsPromise, countPromise]);

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