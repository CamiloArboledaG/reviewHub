'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InfiniteCommentsData } from '@/lib/definitions';
import { createComment } from '@/lib/queries';
import { Button } from './ui/button';
import { CustomInput } from './ui/custom-input';
import { useToast } from '@/context/ToastContext';
import { theme } from '@/lib/theme';
import { getCategoryColors } from '@/lib/theme';

type CommentFormProps = {
  reviewId: string;
};

const CommentForm = ({ reviewId }: CommentFormProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [content, setContent] = useState('');

  const colors = getCategoryColors('game');

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
        rows={2}
        placeholder="Escribe tu comentario..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        focusRing={colors.inputFocusRing}
        focusBorder={colors.inputFocusBorder}
        disabled={createMutation.isPending}
      />

      <div className="flex items-center justify-between mt-3">
        <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
          {remainingChars} caracteres restantes
        </span>

        <Button
          type="submit"
          disabled={createMutation.isPending || !content.trim() || isOverLimit}
          className={theme.components.button.primary}
        >
          {createMutation.isPending ? 'Publicando...' : 'Comentar'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
