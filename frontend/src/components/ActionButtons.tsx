'use client';

import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { theme } from '@/lib/theme';

type ActionButtonsProps = {
  likes: number;
  isLiked?: boolean;
  onLike?: () => void;
  comments?: number;
  commentText?: string;
  onComment?: () => void;
  onShare?: () => void;
  showShare?: boolean;
  disabled?: boolean;
  likePending?: boolean;
  compact?: boolean;
  size?: 'sm' | 'md';
  likeButtonClassName?: string;
  commentButtonClassName?: string;
};

const ActionButtons = ({
  likes,
  isLiked = false,
  onLike,
  comments,
  commentText,
  onComment,
  onShare,
  showShare = false,
  disabled = false,
  likePending = false,
  compact = false,
  size = 'md',
  likeButtonClassName = '',
  commentButtonClassName = '',
}: ActionButtonsProps) => {
  const rc = theme.components.reviewCard;

  const hasLikeCount = likes > 0;
  const hasCommentCount = comments !== undefined && comments > 0;
  const hasCommentText = !!commentText;

  const buttonSize = size === 'sm' ? 'h-7' : 'h-8';
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={compact ? 'flex items-center gap-1 px-0 py-0' : rc.actions.container}>
      <div className={rc.actions.leftGroup}>
        <Button
          variant="ghost"
          size="sm"
          className={`${rc.actions.button.base} ${rc.actions.button.like} group ${buttonSize} ${
            hasLikeCount ? 'gap-1.5' : 'gap-0 px-2'
          } ${likeButtonClassName}`}
          onClick={onLike}
          disabled={disabled || likePending}
        >
          <Heart
            className={`${iconSize} transition-all duration-200 ease-in-out ${
              isLiked
                ? 'fill-red-500 text-red-500 scale-110'
                : 'fill-none group-hover:scale-125 group-hover:text-red-400 group-active:scale-95'
            }`}
          />
          {hasLikeCount && (
            <span className={textSize}>{likes}</span>
          )}
        </Button>

        {(onComment || (comments !== undefined && comments > 0) || commentText) && (
          <Button
            variant="ghost"
            size="sm"
            className={`${rc.actions.button.base} ${rc.actions.button.comment} ${buttonSize} ${
              hasCommentText || hasCommentCount ? 'gap-1.5' : 'gap-0 px-2'
            } ${commentButtonClassName}`}
            onClick={onComment}
            disabled={disabled}
          >
            <MessageCircle className={iconSize} />
            {commentText ? (
              <span className={textSize}>{commentText}</span>
            ) : (
              hasCommentCount && (
                <span className={textSize}>{comments}</span>
              )
            )}
          </Button>
        )}
      </div>

      {showShare && (
        <Button
          variant="ghost"
          size="sm"
          className={`${rc.actions.button.base} ${rc.actions.button.share} ${buttonSize}`}
          onClick={onShare}
          disabled={disabled}
        >
          <Share2 className={iconSize} />
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
