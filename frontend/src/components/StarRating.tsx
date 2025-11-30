'use client';

import { Rating } from 'react-simple-star-rating';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    interactive?: boolean;
    onChange?: (rating: number) => void;
    showValue?: boolean;
}

const sizeMap = {
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
};

const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-3xl',
};

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    size = 'md',
    interactive = false,
    onChange,
    showValue = false,
}) => {
    return (
        <div className="flex items-center gap-2">
            <Rating
                initialValue={rating}
                onClick={onChange}
                readonly={!interactive}
                allowFraction
                size={sizeMap[size]}
                fillColor="#FBBF24"
                emptyColor="#D1D5DB"
                transition
                className="flex gap-1"
                SVGstyle={{ display: 'inline-block' }}
            />
            {showValue && rating > 0 && (
                <span className={`font-bold text-gray-900 ml-1 ${textSizeClasses[size]}`}>
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;
