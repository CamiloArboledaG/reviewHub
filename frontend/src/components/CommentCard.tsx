'use client';

import { ChevronDown, MoreHorizontal, Trash2 } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, InfiniteCommentsData, Review, RepliesPage } from '@/lib/definitions';
import { deleteComment, likeComment, unlikeComment, createReply, fetchReplies } from '@/lib/queries';
import { Button } from './ui/button';
import { CustomInput } from './ui/custom-input';
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
import CommentReply from './CommentReply';
import ActionButtons from './ActionButtons';

type CommentCardProps = {
  comment: Comment;
  reviewAuthorId: string;
};

const CommentCard = ({ comment, reviewAuthorId }: CommentCardProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const [avatarError, setAvatarError] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isReplyExpanded, setIsReplyExpanded] = useState(false);
  const [loadedReplies, setLoadedReplies] = useState<Comment[]>([]);
  const [repliesPage, setRepliesPage] = useState(1);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const replySectionRef = useRef<HTMLDivElement>(null);

  const isAuthor = currentUser?._id === comment.user._id;
  const isReviewAuthor = comment.user._id === reviewAuthorId;

  const allReplies = [...comment.replies, ...loadedReplies];
  const remainingRepliesCount = comment.repliesCount - allReplies.length;

  const likeMutation = useMutation({
    mutationFn: () => likeComment(comment._id),
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
            comments: page.comments.map((c) =>
              c._id === comment._id ? { ...c, isLiked: true, likes: c.likes + 1 } : c
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
      showToast(err.message || 'Error al dar me gusta', 'error');
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeComment(comment._id),
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
            comments: page.comments.map((c) =>
              c._id === comment._id ? { ...c, isLiked: false, likes: c.likes - 1 } : c
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
      showToast(err.message || 'Error al quitar me gusta', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(comment._id),
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
            comments: page.comments.filter((c) => c._id !== comment._id),
            totalComments: page.totalComments - 1,
          })),
        };
      });

      queryClient.setQueryData<Review>(['review', comment.review], (old) => {
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
      showToast(err.message || 'Error al eliminar el comentario', 'error');
    },
    onSuccess: () => {
      showToast('Comentario eliminado exitosamente', 'success');
    },
  });

  const replyMutation = useMutation({
    mutationFn: (content: string) => createReply({ reviewId: comment.review, content, parentCommentId: comment._id }),
    onSuccess: (newReply) => {
      setReplyContent('');
      setIsReplyExpanded(false);

      setLoadedReplies(prev => [...prev, newReply]);

      queryClient.setQueriesData<InfiniteCommentsData>({
        predicate: (query) => query.queryKey[0] === 'comments'
      }, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            comments: page.comments.map((c) =>
              c._id === comment._id
                ? { ...c, repliesCount: c.repliesCount + 1 }
                : c
            ),
          })),
        };
      });

      queryClient.setQueryData<Review>(['review', comment.review], (old) => {
        if (!old) return old;
        return { ...old, comments: old.comments + 1 };
      });

      showToast('Respuesta publicada exitosamente', 'success');
    },
    onError: (err) => {
      showToast(err.message || 'Error al publicar la respuesta', 'error');
    },
  });

  const handleLike = () => {
    if (comment.isLiked === true) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      deleteMutation.mutate();
    }
  };

  const handleReply = () => {
    setIsReplyExpanded(true);
    setTimeout(() => {
      replySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      replyInputRef.current?.focus();
    }, 100);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      showToast('La respuesta no puede estar vacía', 'error');
      return;
    }

    if (replyContent.length > 500) {
      showToast('La respuesta no puede exceder 500 caracteres', 'error');
      return;
    }

    replyMutation.mutate(replyContent);
  };

  const handleLoadMoreReplies = async () => {
    if (isLoadingReplies) return;

    setIsLoadingReplies(true);
    try {
      const data: RepliesPage = await fetchReplies({
        commentId: comment._id,
        pageParam: repliesPage,
        limit: 10,
      });

      const existingIds = new Set(allReplies.map(r => r._id));
      const uniqueNewReplies = data.replies.filter(r => !existingIds.has(r._id));

      setLoadedReplies(prev => [...prev, ...uniqueNewReplies]);
      setRepliesPage(prev => prev + 1);
    } catch {
      showToast('Error al cargar más respuestas', 'error');
    } finally {
      setIsLoadingReplies(false);
    }
  };

  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-800">
      <CardContent className="p-0">
        <div className="p-4">
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
            <div className="flex items-center justify-between gap-2 mb-1">
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

            <div className='pt-4'>
            <ActionButtons
              likes={comment.likes}
              isLiked={comment.isLiked}
              onLike={handleLike}
              comments={comment.repliesCount}
              onComment={handleReply}
              likePending={likeMutation.isPending || unlikeMutation.isPending}
              compact
              size="sm"
              likeButtonClassName="px-0"
              commentButtonClassName="px-2"
            />
            </div>
            </div>
          </div>
        </div>

        {(allReplies.length > 0 || isReplyExpanded) && (
          <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
            {allReplies.map((reply) => (
              <CommentReply key={reply._id} reply={reply} parentCommentId={comment._id} />
            ))}

            {remainingRepliesCount > 0 && (
              <div className="py-2 px-4 pl-14">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadMoreReplies}
                  disabled={isLoadingReplies}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-950/50 p-0 h-auto font-medium"
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  {isLoadingReplies
                    ? 'Cargando...'
                    : `Ver ${remainingRepliesCount} ${remainingRepliesCount === 1 ? 'respuesta' : 'respuestas'} más`
                  }
                </Button>
              </div>
            )}

            <div ref={replySectionRef} className="py-3 px-4 pl-14">
              {isReplyExpanded ? (
                <form onSubmit={handleSubmitReply} className="space-y-3">
                  <CustomInput
                    ref={replyInputRef}
                    asTextarea
                    variant="sm"
                    rows={3}
                    placeholder="Escribe tu respuesta..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    focusRing="focus:ring-2 focus:ring-purple-500/20"
                    focusBorder="focus:border-purple-500"
                    disabled={replyMutation.isPending}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${replyContent.length > 500 ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {500 - replyContent.length} caracteres restantes
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsReplyExpanded(false);
                          setReplyContent('');
                        }}
                        disabled={replyMutation.isPending}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={replyMutation.isPending || !replyContent.trim() || replyContent.length > 500}
                      >
                        {replyMutation.isPending ? 'Respondiendo...' : 'Responder'}
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div
                  onClick={() => {
                    setIsReplyExpanded(true);
                    setTimeout(() => replyInputRef.current?.focus(), 50);
                  }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {currentUser?.avatar?.imageUrl ? (
                      <AvatarImage src={currentUser.avatar.imageUrl} alt={currentUser.name} />
                    ) : (
                      <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs">
                        {currentUser?.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 py-2 px-3 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-muted-foreground group-hover:border-purple-400 dark:group-hover:border-purple-500 transition-colors">
                    Escribe una respuesta...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentCard;
