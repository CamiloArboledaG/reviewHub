'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InfiniteCommentsData, Review } from '@/lib/definitions';
import { createComment } from '@/lib/queries';
import { Button } from './ui/button';
import { CustomInput } from './ui/custom-input';
import { useToast } from '@/context/ToastContext';

type CommentFormProps = {
  reviewId: string;
};

const CommentForm = ({ reviewId }: CommentFormProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const createMutation = useMutation({
    mutationFn: (commentContent: string) => createComment({ reviewId, content: commentContent }),
    onSuccess: (newComment) => {
      setContent('');

      queryClient.setQueriesData<InfiniteCommentsData>({
        predicate: (query) => query.queryKey[0] === 'comments' && query.queryKey[1] === reviewId
      }, (old) => {
        if (!old) return old;

        const firstPage = old.pages[0];
        if (!firstPage) return old;

        return {
          ...old,
          pages: [
            {
              ...firstPage,
              comments: [newComment, ...firstPage.comments],
              totalComments: firstPage.totalComments + 1,
            },
            ...old.pages.slice(1),
          ],
        };
      });

      queryClient.setQueryData<Review>(['review', reviewId], (old) => {
        if (!old) return old;
        return { ...old, comments: old.comments + 1 };
      });

      showToast('Comentario publicado exitosamente', 'success');
    },
    onError: (err) => {
      showToast(err.message || 'Error al publicar el comentario', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      showToast('El comentario no puede estar vacío', 'error');
      return;
    }

    if (content.length > 500) {
      showToast('El comentario no puede exceder 500 caracteres', 'error');
      return;
    }

    createMutation.mutate(content);
  };

  const remainingChars = 500 - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <form onSubmit={handleSubmit}>
      <CustomInput
        asTextarea
        variant="md"
        rows={isFocused ? 5 : 2}
        placeholder="Escribe tu comentario..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        focusRing="focus:ring-2 focus:ring-purple-500/20"
        focusBorder="focus:border-purple-500"
        disabled={createMutation.isPending}
        className="min-h-[60px] max-h-[200px] overflow-y-auto resize-none transition-all duration-300 ease-in-out"
      />

      <div className="flex items-center justify-between mt-3">
        <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
          {remainingChars} caracteres restantes
        </span>

        <Button
          type="submit"
          disabled={createMutation.isPending || !content.trim() || isOverLimit}
        >
          {createMutation.isPending ? 'Publicando...' : 'Comentar'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
