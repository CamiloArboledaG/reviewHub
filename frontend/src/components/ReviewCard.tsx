'use client';

import { Heart, MessageCircle, MoreHorizontal, Share2, HelpCircle, User } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '@/lib/definitions';
import { fetchCategories, followUser, unfollowUser } from '@/lib/queries';
import { Button } from './ui/button';
import { categoryIcons, categoryStyles } from '@/lib/styles';
import StarRating from './StarRating';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(user._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const handleFollow = () => {
    followMutation.mutate();
  };

  const handleUnfollow = () => {
    unfollowMutation.mutate();
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 w-full max-w-2xl">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
            {user.avatar?.imageUrl && !avatarError ? (
              <Image
                src={user.avatar.imageUrl}
                alt={user.name}
                fill
                sizes="48px"
                className="object-cover rounded-full"
                onError={() => setAvatarError(true)}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
              />
            ) : (
              <User className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{user.name}</h3>
              <span className="text-muted-foreground text-sm">@{user.handle}</span>
              <span className="text-muted-foreground text-sm">· {postTime}</span>
            </div>
            <div className="mt-1">
            {currentCategory ? (
                <span className={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium ${categoryStyles[currentCategory.slug]}`}>
                {React.createElement(categoryIcons[currentCategory.slug], { className: 'w-3 h-3' })}
                {currentCategory.name}
                </span>
            ) : (
                <div className="h-5 w-24 bg-muted rounded-full animate-pulse" />
            )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            {isFollowing ? (
                 <Button className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-full" onClick={handleUnfollow} disabled={unfollowMutation.isPending}>
                    {unfollowMutation.isPending ? 'Dejando de seguir...' : 'Siguiendo'}
                </Button>
            ) : (
                <Button className="px-4 py-2 text-sm font-semibold text-foreground bg-card border border-border rounded-full hover:bg-accent" onClick={handleFollow} disabled={followMutation.isPending}>
                    {followMutation.isPending ? 'Siguiendo...' : 'Seguir'}
                </Button>
            )}
          
          <Button variant="ghost" className="p-2 rounded-full hover:bg-accent">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
      <div className="mt-4 flex gap-6">
        <div className="w-32 h-40 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden relative">
          {item.imageUrl && !itemImageError ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="128px"
              className="object-cover rounded-md"
              onError={() => setItemImageError(true)}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2U1ZTdlYiIvPjwvc3ZnPg=="
            />
          ) : (
            <HelpCircle className="h-12 w-12 text-gray-400" />
          )}
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-foreground">{item.title}</h2>
          <div className="mt-1">
            <StarRating
              rating={rating.value}
              maxRating={rating.max}
              size="md"
              interactive={false}
              showValue={true}
            />
          </div>
          <p className="mt-2 text-foreground">
            {content}
          </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border flex items-center gap-6 text-muted-foreground">
        <Button variant="ghost-icon" className="gap-2 hover:text-red-500 p-0">
          <Heart className="w-5 h-5" />
          <span>{likes}</span>
        </Button>
        <Button variant="ghost-icon" className="gap-2 hover:text-blue-500 p-0">
          <MessageCircle className="w-5 h-5" />
          <span>{comments}</span>
        </Button>
        <div className="flex-grow"></div>
        <Button variant="ghost-icon" className="hover:text-foreground p-0">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ReviewCard; 
