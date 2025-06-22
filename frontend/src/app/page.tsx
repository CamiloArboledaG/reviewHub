'use client';

import ReviewCard from "@/components/ReviewCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatTimeAgo } from "@/lib/utils";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchReviews } from "@/lib/queries";

const ReviewFeedSkeleton = () => (
  <div className="flex flex-col items-center gap-8 w-full">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-card rounded-lg shadow-sm border border-border p-6 w-full max-w-2xl">
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
    ))}
  </div>
);


export default function Home() {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
    initialPageParam: 1,
    staleTime: 0,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') {
    return (
      <div className="p-8">
        <ReviewFeedSkeleton />
      </div>
    )
  }

  if (status === 'error') {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="p-8">
      <div className="flex flex-col items-center gap-8">
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.reviews.map((review) => {
              const reviewForCard = {
                user: {
                  name: review.user.name,
                  handle: review.user.username,
                  avatarUrl: review.user.avatarUrl || '',
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
                comments: review.comments.length,
                isFollowing: false, // Dato de ejemplo
              };
              return <ReviewCard key={review._id} review={reviewForCard} />;
            })}
          </React.Fragment>
        ))}

        <div ref={ref} className="h-10" />

        {isFetchingNextPage && <ReviewFeedSkeleton />}
        
        {!hasNextPage && !isFetching && <p className="text-muted-foreground">No hay más reseñas para mostrar.</p>}
      </div>
    </div>
  );
}
