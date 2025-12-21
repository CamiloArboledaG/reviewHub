'use client';

import { Heart, MessageCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, InfiniteCommentsData } from '@/lib/definitions';
import { deleteComment } from '@/lib/queries';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatTimeAgo } from '@/lib/utils';
import { theme } from '@/lib/theme';

type CommentCardProps = {
  comment: Comment;
  reviewAuthorId: string;
};

const CommentCard = ({ comment, reviewAuthorId }: CommentCardProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const [avatarError, setAvatarError] = useState(false);

  const isAuthor = currentUser?._id === comment.user._id;
  const isReviewAuthor = comment.user._id === reviewAuthorId;

  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(comment._id),
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
            comments: page.comments.filter((c) => c._id !== comment._id),
            totalComments: page.totalComments - 1,
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
      showToast(err.message || 'Error al eliminar el comentario', 'error');
    },
    onSuccess: () => {
      showToast('Comentario eliminado exitosamente', 'success');
    },
  });

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-800">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            {comment.user.avatar?.imageUrl && !avatarError ? (
              <AvatarImage
                src={comment.user.avatar.imageUrl}
                alt={comment.user.name}
                onError={() => setAvatarError(true)}
              />
            ) : (
              <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                {comment.user.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{comment.user.name}</span>
                <span className="text-muted-foreground text-sm">@{comment.user.username}</span>
                {isReviewAuthor && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-0.5">
                    Autor
                  </Badge>
                )}
                <span className="text-muted-foreground text-sm">·</span>
                <span className="text-muted-foreground text-sm">{formatTimeAgo(comment.createdAt)}</span>
              </div>

              {isAuthor && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar comentario'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p className="mt-2 text-sm text-foreground whitespace-pre-wrap break-words">
              {comment.content}
            </p>

            <div className="flex items-center gap-4 mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 h-8 px-2"
                disabled
              >
                <Heart className="h-4 w-4" />
                <span className={theme.typographyPresets.cardMeta}>{comment.likes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950 h-8 px-2"
                disabled
              >
                <MessageCircle className="h-4 w-4" />
                <span className={theme.typographyPresets.cardMeta}>Responder</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
