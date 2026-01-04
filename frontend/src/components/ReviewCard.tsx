'use client';

import { MoreHorizontal, User } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Category, InfiniteReviewsData, Review } from '@/lib/definitions';
import { fetchCategories, followUser, unfollowUser, likeReview, unlikeReview } from '@/lib/queries';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { categoryIcons } from '@/lib/styles';
import StarRating from './StarRating';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/lib/theme';
import { getCategoryBadgeClasses } from '@/lib/theme/index';
import ActionButtons from './ActionButtons';

type ReviewCardProps = {
  review: {
    _id: string;
    user: {
        _id: string;
      name: string;
      handle: string;
      avatar?: {
        imageUrl: string;
        name: string;
      };
    };
    postTime: string;
    category: {
      slug: 'game' | 'movie' | 'series' | 'book';
    };
    item: {
      title: string;
      imageUrl: string;
    };
    rating: {
      value: number;
      max: number;
    };
    content: string;
    likes: number;
    comments: number;
    isFollowing?: boolean;
    isLiked?: boolean;
  };
};

const ReviewCard = ({ review }: ReviewCardProps) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { user: currentUser } = useAuth();
    const router = useRouter();
    const [avatarError, setAvatarError] = useState(false);
    const [itemImageError, setItemImageError] = useState(false);

    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
      });

  const { user, postTime, category, item, rating, content, likes, comments, isFollowing, isLiked } = review;
  const currentCategory = categories?.find(c => c.slug === category.slug);
  const isOwnReview = currentUser?._id === user._id;

  const followMutation = useMutation({
    mutationFn: () => followUser(user._id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        predicate: (query) =>
          query.queryKey[0] === 'reviews' || query.queryKey[0] === 'following-reviews' || query.queryKey[0] === 'review'
      });

      const previousData = queryClient.getQueriesData({
        predicate: (query) =>
          query.queryKey[0] === 'reviews' || query.queryKey[0] === 'following-reviews' || query.queryKey[0] === 'review'
      });

      queryClient.setQueriesData<InfiniteReviewsData>({
        predicate: (query) =>
          query.queryKey[0] === 'reviews' || query.queryKey[0] === 'following-reviews'
      }, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            reviews: page.reviews.map((r) =>
              r.user._id === user._id ? { ...r, isFollowing: true } : r
            ),
          })),
        };
      });

      queryClient.setQueryData<Review>(['review', review._id], (old) => {
        if (!old) return old;
        return { ...old, isFollowing: true };
      });

      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      showToast(err.message || 'Error al seguir al usuario', 'error');
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(user._id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        predicate: (query) =>
          query.queryKey[0] === 'reviews' || query.queryKey[0] === 'following-reviews' || query.queryKey[0] === 'review'
      });

      const previousData = queryClient.getQueriesData({
        predicate: (query) =>
          query.queryKey[0] === 'reviews' || query.queryKey[0] === 'following-reviews' || query.queryKey[0] === 'review'
      });

      queryClient.setQueriesData<InfiniteReviewsData>({
        predicate: (query) =>
          query.queryKey[0] === 'reviews' || query.queryKey[0] === 'following-reviews'
      }, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            reviews: page.reviews.map((r) =>
              r.user._id === user._id ? { ...r, isFollowing: false } : r
            ),
          })),
        };
      });

      queryClient.setQueryData<Review>(['review', review._id], (old) => {
        if (!old) return old;
        return { ...old, isFollowing: false };
      });

      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      showToast(err.message || 'Error al dejar de seguir al usuario', 'error');
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => likeReview(review._id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        predicate: (query) =>
          query.queryKey[0] === 'reviews' || query.queryKey[0] === 'following-reviews' || query.queryKey[0] === 'review'
      });

      const previousData = queryClient.getQueriesData({
        predicate: (query) =>
          query.queryKey[0] === 'reviews' || query.queryKey[0] === 'following-reviews' || query.queryKey[0] === 'review'
      });

      queryClient.setQueriesData<InfiniteReviewsData>({
        predicate: (query) =>
          query.queryKey[0] === 'reviews' || query.queryKey[0] === 'following-reviews'
      }, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            reviews: page.reviews.map((r) =>
              r._id === review._id ? { ...r, isLiked: true, likes: r.likes + 1 } : r
            ),
          })),
        };
      });

      queryClient.setQueryData<Review>(['review', review._id], (old) => {
        if (!old) return old;
        return { ...old, isLiked: true, likes: old.likes + 1 };
      });

      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      showToast(err.message || 'Error al dar me gusta', 'error');
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeReview(review._id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        predicate: (query) =>
          query.queryKey[0] === 'reviews' || query.queryKey[0] === 'following-reviews' || query.queryKey[0] === 'review'
      });

      const previousData = queryClient.getQueriesData({
        predicate: (query) =>
          query.queryKey[0] === 'reviews' || query.queryKey[0] === 'following-reviews' || query.queryKey[0] === 'review'
      });

      queryClient.setQueriesData<InfiniteReviewsData>({
        predicate: (query) =>
          query.queryKey[0] === 'reviews' || query.queryKey[0] === 'following-reviews'
      }, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            reviews: page.reviews.map((r) =>
              r._id === review._id ? { ...r, isLiked: false, likes: r.likes - 1 } : r
            ),
          })),
        };
      });

      queryClient.setQueryData<Review>(['review', review._id], (old) => {
        if (!old) return old;
        return { ...old, isLiked: false, likes: old.likes - 1 };
      });

      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      showToast(err.message || 'Error al quitar me gusta', 'error');
    },
  });

  const handleFollow = () => {
    followMutation.mutate();
  };

  const handleUnfollow = () => {
    unfollowMutation.mutate();
  };

  const handleLike = () => {
    console.log('handleLike called - isLiked:', isLiked, 'review._id:', review._id);
    if (isLiked === true) {
      console.log('Calling unlikeMutation');
      unlikeMutation.mutate();
    } else {
      console.log('Calling likeMutation');
      likeMutation.mutate();
    }
  };

  const rc = theme.components.reviewCard;

  return (
    <Card className={`${rc.container.overflow} ${rc.container.border} ${rc.container.background} ${rc.container.shadow} ${rc.container.transition} ${rc.container.base}`}>
      <CardContent className="p-0">
        {/* Header */}
        <div className={rc.header.container}>
          <div className={rc.header.userSection}>
            <Avatar className={`${rc.avatar.size} ${rc.avatar.ring}`}>
              {user.avatar?.imageUrl && !avatarError ? (
                <AvatarImage
                  src={user.avatar.imageUrl}
                  alt={user.name}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <AvatarFallback className={`${rc.avatar.fallback.background} ${rc.avatar.fallback.text}`}>
                  {user.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className={rc.userInfo.container}>
              <div className={rc.userInfo.nameRow}>
                <span className={rc.userInfo.name}>{user.name}</span>
                <span className={rc.userInfo.handle}>@{user.handle}</span>
                <span className={rc.userInfo.separator}>·</span>
                <span className={rc.userInfo.timestamp}>{postTime}</span>
              </div>
              {currentCategory ? (
                <Badge className={`${rc.badge.container} ${getCategoryBadgeClasses(currentCategory.slug)}`}>
                  {React.createElement(categoryIcons[currentCategory.slug], { className: rc.badge.icon })}
                  {currentCategory.name}
                </Badge>
              ) : (
                <div className={rc.badge.skeleton} />
              )}
            </div>
          </div>
          <div className={rc.header.actionsSection}>
            {!isOwnReview && (
              <>
                {isFollowing ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className={rc.followButton.base}
                    onClick={handleUnfollow}
                    disabled={unfollowMutation.isPending}
                  >
                    {unfollowMutation.isPending ? 'Dejando...' : 'Siguiendo'}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className={rc.followButton.base}
                    onClick={handleFollow}
                    disabled={followMutation.isPending}
                  >
                    {followMutation.isPending ? 'Siguiendo...' : 'Seguir'}
                  </Button>
                )}
              </>
            )}
            <Button variant="ghost" size="icon" className={rc.moreButton.base}>
              <MoreHorizontal className={rc.moreButton.icon} />
            </Button>
          </div>
        </div>

        {/* Item Content */}
        <div className={rc.content.container}>
          <div className={rc.content.box}>
            {/* Item Cover */}
            <div className={rc.cover.container}>
              <div className={rc.cover.image}>
                {item.imageUrl && !itemImageError ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={() => setItemImageError(true)}
                  />
                ) : (
                  <div className={rc.cover.placeholder}>
                    <User className={rc.cover.placeholderIcon} />
                  </div>
                )}
              </div>
            </div>

            {/* Item Info & Review */}
            <div className={rc.itemInfo.container}>
              <div>
                <h3 className={rc.itemInfo.title}>
                  {item.title}
                </h3>
              </div>
              <div className={rc.itemInfo.ratingContainer}>
                <StarRating
                  rating={rating.value}
                  maxRating={rating.max}
                  size="sm"
                  interactive={false}
                  showValue={true}
                />
              </div>
              <p className={rc.itemInfo.reviewText}>
                {content}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <ActionButtons
          likes={likes}
          isLiked={isLiked}
          onLike={handleLike}
          comments={comments}
          onComment={() => router.push(`/review/${review._id}`)}
          showShare
          likePending={likeMutation.isPending || unlikeMutation.isPending}
        />
      </CardContent>
    </Card>
  );
};

export default ReviewCard; 
