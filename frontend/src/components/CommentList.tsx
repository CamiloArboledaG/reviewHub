'use client';

import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { fetchComments } from '@/lib/queries';
import CommentCard from './CommentCard';
import { Skeleton } from './ui/skeleton';

type CommentListProps = {
  reviewId: string;
  reviewAuthorId: string;
  sort?: string;
};

const CommentSkeleton = () => (
  <div className="bg-card rounded-lg shadow-sm border border-border p-4">
    <div className="flex gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  </div>
);

const CommentList = ({ reviewId, reviewAuthorId, sort = 'top' }: CommentListProps) => {
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
    queryKey: ['comments', reviewId, sort],
    queryFn: ({ pageParam = 1 }) => fetchComments({ reviewId, pageParam, sort }),
    initialPageParam: 1,
    staleTime: 0,
    refetchOnMount: true,
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
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  const totalComments = data.pages[0]?.totalComments || 0;

  if (totalComments === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No hay comentarios aún. ¡Sé el primero en comentar!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <h3 className="text-lg font-semibold">
          {totalComments} {totalComments === 1 ? 'comentario' : 'comentarios'}
        </h3>
      </div>

      {data.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.comments.map((comment) => (
            <CommentCard key={comment._id} comment={comment} reviewAuthorId={reviewAuthorId} />
          ))}
        </React.Fragment>
      ))}

      <div ref={ref} className="h-4" />

      {isFetchingNextPage && (
        <div className="flex flex-col gap-4">
          {[...Array(2)].map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      )}

      {!hasNextPage && !isFetching && totalComments > 0 && (
        <p className="text-center text-muted-foreground py-4">
          No hay más comentarios
        </p>
      )}
    </div>
  );
};

export default CommentList;
