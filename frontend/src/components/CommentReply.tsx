'use client';

import { MoreHorizontal, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, InfiniteCommentsData, Review } from '@/lib/definitions';
import { deleteComment, likeComment, unlikeComment } from '@/lib/queries';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatTimeAgo } from '@/lib/utils';
import ActionButtons from './ActionButtons';

type CommentReplyProps = {
  reply: Comment;
  parentCommentId: string;
};

const CommentReply = ({ reply, parentCommentId }: CommentReplyProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const [avatarError, setAvatarError] = useState(false);

  const isAuthor = currentUser?._id === reply.user._id;

  const likeMutation = useMutation({
    mutationFn: () => likeComment(reply._id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        predicate: (query) => query.queryKey[0] === 'comments'
      });

      const previousData = queryClient.getQueriesData({
        predicate: (query) => query.queryKey[0] === 'comments'
      });

      queryClient.setQueriesData<InfiniteCommentsData>({
        predicate: (query) => query.queryKey[0] === 'comments'
      }, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            comments: page.comments.map((c) => {
              if (c._id === parentCommentId) {
                return {
                  ...c,
                  replies: c.replies.map((r) =>
                    r._id === reply._id ? { ...r, isLiked: true, likes: r.likes + 1 } : r
                  ),
                };
              }
              return c;
            }),
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
      showToast(err.message || 'Error al dar me gusta', 'error');
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeComment(reply._id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        predicate: (query) => query.queryKey[0] === 'comments'
      });

      const previousData = queryClient.getQueriesData({
        predicate: (query) => query.queryKey[0] === 'comments'
      });

      queryClient.setQueriesData<InfiniteCommentsData>({
        predicate: (query) => query.queryKey[0] === 'comments'
      }, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            comments: page.comments.map((c) => {
              if (c._id === parentCommentId) {
                return {
                  ...c,
                  replies: c.replies.map((r) =>
                    r._id === reply._id ? { ...r, isLiked: false, likes: r.likes - 1 } : r
                  ),
                };
              }
              return c;
            }),
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
      showToast(err.message || 'Error al quitar me gusta', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(reply._id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        predicate: (query) => query.queryKey[0] === 'comments' || query.queryKey[0] === 'review'
      });

      const previousData = queryClient.getQueriesData({
        predicate: (query) => query.queryKey[0] === 'comments' || query.queryKey[0] === 'review'
      });

      queryClient.setQueriesData<InfiniteCommentsData>({
        predicate: (query) => query.queryKey[0] === 'comments'
      }, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            comments: page.comments.map((c) => {
              if (c._id === parentCommentId) {
                return {
                  ...c,
                  replies: c.replies.filter((r) => r._id !== reply._id),
                  repliesCount: c.repliesCount - 1,
                };
              }
              return c;
            }),
          })),
        };
      });

      queryClient.setQueryData<Review>(['review', reply.review], (old) => {
        if (!old) return old;
        return { ...old, comments: old.comments - 1 };
      });

      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      showToast(err.message || 'Error al eliminar la respuesta', 'error');
    },
    onSuccess: () => {
      showToast('Respuesta eliminada exitosamente', 'success');
    },
  });

  const handleLike = () => {
    if (reply.isLiked === true) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta respuesta?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="py-3 pl-4 pr-4">
        <div className="flex gap-3 pl-10">
          <Avatar className="w-8 h-8 flex-shrink-0">
            {reply.user.avatar?.imageUrl && !avatarError ? (
              <AvatarImage
                src={reply.user.avatar.imageUrl}
                alt={reply.user.name}
                onError={() => setAvatarError(true)}
              />
            ) : (
              <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs">
                {reply.user.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{reply.user.name}</span>
                <span className="text-muted-foreground text-xs">@{reply.user.username}</span>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="text-muted-foreground text-xs">{formatTimeAgo(reply.createdAt)}</span>
              </div>

              {isAuthor && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar respuesta'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="flex items-start justify-between gap-4 mt-1">
              <p className="flex-1 text-sm text-foreground whitespace-pre-wrap break-words">
                {reply.content}
              </p>

              <div className="flex-shrink-0 ">
                <ActionButtons
                  likes={reply.likes}
                  isLiked={reply.isLiked}
                  onLike={handleLike}
                  likePending={likeMutation.isPending || unlikeMutation.isPending}
                  compact
                  size="sm"
                  likeButtonClassName="px-1.5 py-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentReply;
