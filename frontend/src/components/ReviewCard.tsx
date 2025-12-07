'use client';

import { Heart, MessageCircle, MoreHorizontal, Share2, User } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category, InfiniteReviewsData } from '@/lib/definitions';
import { fetchCategories, followUser, unfollowUser } from '@/lib/queries';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { categoryIcons, categoryBadgeColors } from '@/lib/styles';
import StarRating from './StarRating';
import { useToast } from '@/context/ToastContext';

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
  };
};

const ReviewCard = ({ review }: ReviewCardProps) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const [avatarError, setAvatarError] = useState(false);
    const [itemImageError, setItemImageError] = useState(false);

    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
      });

  const { user, postTime, category, item, rating, content, likes, comments, isFollowing } = review;
  const currentCategory = categories?.find(c => c.slug === category.slug);

  const followMutation = useMutation({
    mutationFn: () => followUser(user._id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['reviews'] });

      const previousData = queryClient.getQueriesData({ queryKey: ['reviews'] });

      queryClient.setQueriesData<InfiniteReviewsData>({ queryKey: ['reviews'] }, (old) => {
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
      await queryClient.cancelQueries({ queryKey: ['reviews'] });

      const previousData = queryClient.getQueriesData({ queryKey: ['reviews'] });

      queryClient.setQueriesData<InfiniteReviewsData>({ queryKey: ['reviews'] }, (old) => {
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

  const handleFollow = () => {
    followMutation.mutate();
  };

  const handleUnfollow = () => {
    unfollowMutation.mutate();
  };

  return (
    <Card className="overflow-hidden border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-2xl">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 ring-2 ring-border">
              {user.avatar?.imageUrl && !avatarError ? (
                <AvatarImage
                  src={user.avatar.imageUrl}
                  alt={user.name}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {user.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{user.name}</span>
                <span className="text-muted-foreground text-sm">@{user.handle}</span>
                <span className="text-muted-foreground/60 text-sm">·</span>
                <span className="text-muted-foreground/60 text-sm">{postTime}</span>
              </div>
              {currentCategory ? (
                <Badge className={`w-fit mt-1 gap-1.5 text-xs font-normal px-2 py-0.5 border ${categoryBadgeColors[currentCategory.slug]}`}>
                  {React.createElement(categoryIcons[currentCategory.slug], { className: 'h-3 w-3' })}
                  {currentCategory.name}
                </Badge>
              ) : (
                <div className="h-5 w-24 bg-muted rounded-full animate-pulse mt-1" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isFollowing ? (
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full h-8 px-4 text-xs font-medium"
                onClick={handleUnfollow}
                disabled={unfollowMutation.isPending}
              >
                {unfollowMutation.isPending ? 'Dejando...' : 'Siguiendo'}
              </Button>
            ) : (
              <Button
                size="sm"
                className="rounded-full h-8 px-4 text-xs font-medium"
                onClick={handleFollow}
                disabled={followMutation.isPending}
              >
                {followMutation.isPending ? 'Siguiendo...' : 'Seguir'}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Item Content */}
        <div className="px-4 pb-4">
          <div className="flex gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
            {/* Item Cover */}
            <div className="flex-shrink-0">
              <div className="relative w-20 h-28 rounded-lg overflow-hidden shadow-lg ring-1 ring-black/5">
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
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Item Info & Review */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div>
                <h3 className="font-semibold text-foreground text-base leading-tight line-clamp-1">
                  {item.title}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <StarRating
                  rating={rating.value}
                  maxRating={rating.max}
                  size="sm"
                  interactive={false}
                  showValue={true}
                />
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed line-clamp-2">
                {content}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-full h-9 px-3"
            >
              <Heart className="h-[18px] w-[18px]" />
              <span className="text-sm font-medium">{likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-9 px-3"
            >
              <MessageCircle className="h-[18px] w-[18px]" />
              <span className="text-sm font-medium">{comments}</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-9 px-3"
          >
            <Share2 className="h-[18px] w-[18px]" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard; 
