'use client';

import { Film, Gamepad2, Heart, MessageCircle, MoreHorizontal, Share2, Star, Tv, Book, LucideProps } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@/lib/definitions';
import { fetchCategories } from '@/lib/queries';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Button } from './ui/button';

type ReviewCardProps = {
  review: {
    user: {
      name: string;
      handle: string;
      avatarUrl: string;
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

const categoryIcons: { [key: string]: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> } = {
    game: Gamepad2,
    movie: Film,
    series: Tv,
    book: Book
}

const categoryStyles = {
    game: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    movie: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    series: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    book: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

const ReviewCard = ({ review }: ReviewCardProps) => {
    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
      });

  const { user, postTime, category, item, rating, content, likes, comments, isFollowing } = review;
  const currentCategory = categories?.find(c => c.slug === category.slug);

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating.value);
    const halfStar = rating.value % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" />);
    }

    if (halfStar) {
        stars.push(
            <div key="half" className="relative">
                <Star  className="w-5 h-5 text-gray-300 fill-current" />
                <div className='absolute top-0 left-0 overflow-hidden w-1/2'>
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
            </div>
        )
    }

    const emptyStars = rating.max - Math.ceil(rating.value);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" />);
    }
    
    return stars;
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 w-full max-w-2xl">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-muted rounded-full">
            <Image src={user.avatarUrl ? user.avatarUrl : '/avatares/avatar1.svg'} alt={user.name} width={48} height={48} className="rounded-full" />
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
                 <Button className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-full">
                    Siguiendo
                </Button>
            ) : (
                <Button className="px-4 py-2 text-sm font-semibold text-foreground bg-card border border-border rounded-full hover:bg-accent">
                    Seguir
                </Button>
            )}
          
          <Button variant="ghost" className="p-2 rounded-full hover:bg-accent">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
      <div className="mt-4 flex gap-6">
        <div className="w-32 h-40 bg-muted rounded-md flex-shrink-0">
          {/* <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-md" /> */}
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-foreground">{item.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">{renderStars()}</div>
            <span className="font-bold text-lg text-foreground">{rating.value}/{rating.max}</span>
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