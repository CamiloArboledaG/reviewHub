'use client';

import { use } from 'react';
import ReviewCard from '@/components/ReviewCard';
import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';
import { useQuery } from '@tanstack/react-query';
import { fetchReviewById } from '@/lib/queries';
import { formatTimeAgo } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const ReviewDetailSkeleton = () => (
  <div className="bg-card rounded-lg shadow-sm border border-border p-6 w-full max-w-2xl">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-10 w-[100px] rounded-full" />
    </div>
    <div className="mt-4 flex gap-6">
      <Skeleton className="w-32 h-40 rounded-md flex-shrink-0" />
      <div className="flex flex-col flex-grow space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  </div>
);

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: review, status, error } = useQuery({
    queryKey: ['review', id],
    queryFn: () => fetchReviewById(id),
    staleTime: 0,
    refetchOnMount: true,
  });

  if (status === 'pending') {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center gap-8">
          <ReviewDetailSkeleton />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Error: {error.message}</p>
            <Link href="/home">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const reviewForCard = {
    _id: review._id,
    user: {
      _id: review.user._id,
      name: review.user.name,
      handle: review.user.username,
      avatar: review.user.avatar,
    },
    postTime: formatTimeAgo(review.createdAt),
    category: {
      slug: review.item.category.slug,
    },
    item: {
      title: review.item.title,
      imageUrl: review.item.imageUrl || '',
    },
    rating: review.rating,
    content: review.content,
    likes: review.likes,
    comments: review.comments,
    isFollowing: review.isFollowing,
    isLiked: review.isLiked,
  };

  return (
    <>
      <div className="p-8 pb-32">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <Link href="/home">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>

          <ReviewCard review={reviewForCard} />

          <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <h2 className="text-xl font-bold mb-4">Comentarios</h2>
          </div>

          <CommentList reviewId={id} reviewAuthorId={review.user._id} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200 dark:border-gray-800 shadow-lg z-10">
        <div className="max-w-2xl mx-auto p-4">
          <CommentForm reviewId={id} />
        </div>
      </div>
    </>
  );
}
