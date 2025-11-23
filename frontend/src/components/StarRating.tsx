'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    interactive?: boolean;
    onChange?: (rating: number) => void;
    showValue?: boolean;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
};

const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-3xl',
};

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    size = 'md',
    interactive = false,
    onChange,
    showValue = false,
}) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleStarClick = (starIndex: number, event: React.MouseEvent<HTMLButtonElement>) => {
        if (!interactive || !onChange) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const starWidth = rect.width;
        const clickPercentage = clickX / starWidth;

        // Determinar si es media estrella o estrella completa
        const value = clickPercentage < 0.5 ? starIndex - 0.5 : starIndex;
        onChange(value);
    };

    const renderStar = (index: number) => {
        const displayRating = interactive ? (hoverRating || rating) : rating;
        const isFull = index <= Math.floor(displayRating);
        const isHalf = index === Math.ceil(displayRating) && displayRating % 1 !== 0;

        const starContent = isHalf ? (
            <div className="relative">
                <Star className={`${sizeClasses[size]} text-gray-300 fill-current`} />
                <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                    <Star className={`${sizeClasses[size]} text-yellow-400 fill-current`} />
                </div>
            </div>
        ) : (
            <Star
                className={`${sizeClasses[size]} transition-colors ${
                    isFull ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'
                }`}
            />
        );

        if (interactive) {
            return (
                <button
                    key={index}
                    type="button"
                    onClick={(e) => handleStarClick(index, e)}
                    onMouseEnter={() => setHoverRating(index)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 cursor-pointer"
                >
                    {starContent}
                </button>
            );
        }

        return <div key={index}>{starContent}</div>;
    };

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: maxRating }, (_, i) => renderStar(i + 1))}
            {showValue && rating > 0 && (
                <span className={`font-bold text-gray-900 ml-2 ${textSizeClasses[size]}`}>
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;
