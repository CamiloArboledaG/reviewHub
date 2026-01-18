export const calculateReviewBaseScore = (review) => {
  const now = new Date();
  const reviewDate = new Date(review.createdAt);
  const hoursSincePost = (now - reviewDate) / (1000 * 60 * 60);
  const daysSincePost = hoursSincePost / 24;

  const recencyScore = Math.exp(-hoursSincePost / 24);

  const agePenalty = daysSincePost > 7 ? Math.exp(-(daysSincePost - 7) / 14) : 1;

  const likesCount = review.likesCount ?? review.likes?.length ?? 0;
  const commentsCount = review.commentsCount ?? review.comments?.length ?? 0;
  const engagementScore = Math.log1p(likesCount + commentsCount * 2);

  const ratingValue = review.rating?.value ?? 3;
  const ratingInterest = 1 + Math.abs(ratingValue - 3) * 0.15;

  const baseScore = (recencyScore * 10 + engagementScore * 3) * ratingInterest * agePenalty;

  return Math.round(baseScore * 1000) / 1000;
};

export const calculateReviewFinalScore = (review, context = {}) => {
  const { followingSet = new Set(), likedByUser = false } = context;

  if (likedByUser) {
    return -1000;
  }

  const baseScore = review.baseScore ?? calculateReviewBaseScore(review);

  const isFollowing = followingSet.has(review.user?._id?.toString() || review.user?.toString());
  const followingBoost = isFollowing ? 1.5 : 1;

  return baseScore * followingBoost;
};

export const calculateCommentBaseScore = (comment, reviewAuthorId = null) => {
  const now = new Date();
  const commentDate = new Date(comment.createdAt);
  const hoursSincePost = (now - commentDate) / (1000 * 60 * 60);

  const recencyScore = Math.exp(-hoursSincePost / 48);

  const likesCount = comment.likesCount ?? comment.likes?.length ?? 0;
  const repliesCount = comment.repliesCount ?? comment.replies?.length ?? 0;
  const engagementScore = Math.log1p(likesCount * 2 + repliesCount * 3);

  const isReviewAuthor = reviewAuthorId &&
    (comment.user?._id?.toString() || comment.user?.toString()) === reviewAuthorId.toString();
  const authorBoost = isReviewAuthor ? 2.0 : 1.0;

  const baseScore = (recencyScore * 5 + engagementScore * 4) * authorBoost;

  return Math.round(baseScore * 1000) / 1000;
};

export const calculateCommentFinalScore = (comment, context = {}) => {
  const { followingSet = new Set() } = context;

  const baseScore = comment.baseScore ?? calculateCommentBaseScore(comment);

  const isFollowing = followingSet.has(comment.user?._id?.toString() || comment.user?.toString());
  const followingBoost = isFollowing ? 1.3 : 1;

  return baseScore * followingBoost;
};

export const updateReviewScore = async (Review, reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) return null;

  review.likesCount = review.likes.length;
  review.commentsCount = review.comments.length;
  review.baseScore = calculateReviewBaseScore(review);
  review.lastScoreUpdate = new Date();

  await review.save();
  return review;
};

export const updateCommentScore = async (Comment, commentId, reviewAuthorId = null) => {
  const comment = await Comment.findById(commentId);
  if (!comment) return null;

  comment.likesCount = comment.likes.length;
  comment.repliesCount = comment.replies.length;
  comment.baseScore = calculateCommentBaseScore(comment, reviewAuthorId);

  await comment.save();
  return comment;
};

export const batchUpdateReviewScores = async (Review) => {
  const reviews = await Review.find({});
  let updated = 0;

  for (const review of reviews) {
    review.likesCount = review.likes.length;
    review.commentsCount = review.comments.length;
    review.baseScore = calculateReviewBaseScore(review);
    review.lastScoreUpdate = new Date();
    await review.save();
    updated++;
  }

  return updated;
};

export const batchUpdateCommentScores = async (Comment, Review) => {
  const comments = await Comment.find({ parentComment: null });
  let updated = 0;

  for (const comment of comments) {
    const review = await Review.findById(comment.review).select('user');
    const reviewAuthorId = review?.user?.toString();

    comment.likesCount = comment.likes.length;
    comment.repliesCount = comment.replies.length;
    comment.baseScore = calculateCommentBaseScore(comment, reviewAuthorId);
    await comment.save();
    updated++;
  }

  const replies = await Comment.find({ parentComment: { $ne: null } });
  for (const reply of replies) {
    reply.likesCount = reply.likes.length;
    reply.repliesCount = 0;
    reply.baseScore = calculateCommentBaseScore(reply);
    await reply.save();
    updated++;
  }

  return updated;
};
