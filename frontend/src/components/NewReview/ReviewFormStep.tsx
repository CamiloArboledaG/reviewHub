'use client';

import { useState } from 'react';
import { Item, Category } from '@/lib/definitions';
import { Check, HelpCircle } from 'lucide-react';
import { categoryReviewFormColors, categoryIcons } from '@/lib/styles';
import { theme } from '@/lib/theme';
import StarRating from '../StarRating';
import Image from 'next/image';
import { CustomInput } from '@/components/ui/custom-input';

interface ReviewFormStepProps {
    category: Category;
    item: Item;
    onSubmit: (data: { rating: number; content: string }) => void;
    isSubmitting: boolean;
}

const ReviewFormStep: React.FC<ReviewFormStepProps> = ({ category, item, onSubmit, isSubmitting }) => {
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [imageError, setImageError] = useState(false);

    const maxChars = 250;
    const colors = categoryReviewFormColors[category.slug];
    const CategoryIcon = categoryIcons[category.slug];
    const rf = theme.components.newReview.reviewForm;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating && content.trim().length > 0 && content.trim().length <= maxChars) {
            onSubmit({ rating, content: content.trim() });
        }
    };

    const isValid = rating > 0 && content.trim().length > 0 && content.trim().length <= maxChars;

    return (
        <form onSubmit={handleSubmit} className={rf.container} key="step4">
            <div className={`${rf.itemCard.container} ${colors.cardBg} ${colors.cardBorder} ${theme.borders.radius.lg}`}>
                <div className="flex items-start gap-4 mb-5">
                    {item.imageUrl && !imageError ? (
                        <div className={rf.itemCard.imageContainer}>
                            <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                sizes="80px"
                                className="object-cover"
                                onError={() => setImageError(true)}
                            />
                        </div>
                    ) : (
                        <div className={`${rf.itemCard.iconContainer} ${colors.iconBg} ${colors.iconColor}`}>
                            {imageError ? (
                                <HelpCircle className={rf.itemCard.icon} />
                            ) : (
                                <CategoryIcon className={rf.itemCard.icon} />
                            )}
                        </div>
                    )}

                    <div className={rf.itemCard.content}>
                        <h3 className={rf.itemCard.title}>{item.title}</h3>
                        <p className={rf.itemCard.description}>{item.description}</p>
                        <div className={rf.itemCard.badgeContainer}>
                            <span className={`${rf.itemCard.badge} ${colors.badge} ${colors.badgeText}`}>
                                {category.name}
                            </span>
                            {item.status === 'pending' && (
                                <span className={rf.itemCard.pendingBadge}>
                                    Pendiente de aprobación
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className={rf.ratingSection.container}>
                    <label className={rf.ratingSection.label}>
                        ¿Qué te pareció? <span className={rf.ratingSection.required}>*</span>
                    </label>
                    <StarRating
                        rating={rating}
                        maxRating={5}
                        size="lg"
                        interactive={true}
                        onChange={setRating}
                        showValue={true}
                    />
                </div>

                <div>
                    <label htmlFor="content" className={rf.contentSection.label}>
                        Cuéntanos más <span className={rf.ratingSection.required}>*</span>
                    </label>
                    <div className={rf.contentSection.textareaWrapper}>
                        <CustomInput
                            id="content"
                            asTextarea
                            variant="sm"
                            value={content}
                            onChange={(e) => setContent((e.target as HTMLTextAreaElement).value)}
                            placeholder="Comparte tu opinión honesta. ¿Qué te gustó? ¿Qué mejorarías?"
                            rows={5}
                            maxLength={maxChars}
                            focusRing={colors.inputFocusRing}
                            focusBorder={colors.inputFocusBorder}
                            className="text-gray-700 placeholder:text-gray-400"
                            disabled={isSubmitting}
                        />
                        <div className={`${rf.contentSection.charCounter} ${
                            content.length > maxChars ? rf.contentSection.charCounterError : rf.contentSection.charCounterNormal
                        }`}>
                            {content.length}/{maxChars}
                        </div>
                    </div>
                    <p className={rf.contentSection.hint}>
                        Máximo {maxChars} caracteres
                    </p>
                </div>
            </div>

            <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`${rf.submitButton.base} ${theme.componentSpacing.button.lg} ${colors.buttonGradient} ${colors.buttonHoverGradient} text-white ${theme.borders.radius.lg} ${theme.shadows.scale.md} hover:shadow-lg`}
            >
                {isSubmitting ? (
                    <>
                        <div className={rf.submitButton.spinner} />
                        <span>Publicando...</span>
                    </>
                ) : (
                    <>
                        <Check className={rf.submitButton.icon} />
                        <span>Publicar reseña</span>
                    </>
                )}
            </button>
        </form>
    );
};

export default ReviewFormStep;
