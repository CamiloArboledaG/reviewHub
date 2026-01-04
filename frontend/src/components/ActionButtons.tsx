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
}: ActionButtonsProps) => {
  const rc = theme.components.reviewCard;

  return (
    <div className={rc.actions.container}>
      <div className={rc.actions.leftGroup}>
        <Button
          variant="ghost"
          size="sm"
          className={`${rc.actions.button.base} ${rc.actions.button.like} group`}
          onClick={onLike}
          disabled={disabled || likePending}
        >
          <Heart
            className={`${rc.actions.button.icon} transition-all duration-200 ease-in-out ${
              isLiked
                ? 'fill-red-500 text-red-500 scale-110'
                : 'fill-none group-hover:scale-125 group-hover:text-red-400 group-active:scale-95'
            }`}
          />
          {likes > 0 && (
            <span className={theme.typographyPresets.cardMeta}>{likes}</span>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`${rc.actions.button.base} ${rc.actions.button.comment}`}
          onClick={onComment}
          disabled={disabled}
        >
          <MessageCircle className={rc.actions.button.icon} />
          {commentText ? (
            <span className={theme.typographyPresets.cardMeta}>{commentText}</span>
          ) : (
            comments !== undefined && comments > 0 && (
              <span className={theme.typographyPresets.cardMeta}>{comments}</span>
            )
          )}
        </Button>
      </div>

      {showShare && (
        <Button
          variant="ghost"
          size="sm"
          className={`${rc.actions.button.base} ${rc.actions.button.share}`}
          onClick={onShare}
          disabled={disabled}
        >
          <Share2 className={rc.actions.button.icon} />
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
