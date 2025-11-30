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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating && content.trim().length > 0 && content.trim().length <= maxChars) {
            onSubmit({ rating, content: content.trim() });
        }
    };

    const isValid = rating > 0 && content.trim().length > 0 && content.trim().length <= maxChars;

    return (
        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in" key="step4">
            {/* Card del item con diseño mejorado */}
            <div className={`${colors.cardBg} ${colors.cardBorder} border-2 ${theme.radius.lg} p-5`}>
                <div className="flex items-start gap-4 mb-5">
                    {/* Imagen del item o ícono */}
                    {item.imageUrl && !imageError ? (
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 relative">
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
                        <div className={`${colors.iconBg} ${colors.iconColor} w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                            {imageError ? (
                                <HelpCircle className="w-10 h-10" />
                            ) : (
                                <CategoryIcon className="w-10 h-10" />
                            )}
                        </div>
                    )}

                    {/* Info del item */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2">
                            <span className={`inline-block px-3 py-1 ${colors.badge} ${colors.badgeText} text-xs font-medium rounded-full`}>
                                {category.name}
                            </span>
                            {item.status === 'pending' && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                    Pendiente de aprobación
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div className="mb-5">
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                        ¿Qué te pareció? <span className="text-red-500">*</span>
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

                {/* Contenido de la reseña */}
                <div>
                    <label htmlFor="content" className="block text-sm font-bold text-gray-900 mb-2">
                        Cuéntanos más <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <CustomInput
                            id="content"
                            asTextarea
                            variant="md"
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
                        <div className={`absolute bottom-3 right-3 text-sm ${
                            content.length > maxChars ? 'text-red-500' : 'text-gray-400'
                        }`}>
                            {content.length}/{maxChars}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Máximo {maxChars} caracteres
                    </p>
                </div>
            </div>

            {/* Botón de publicar con gradiente */}
            <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`w-full ${theme.button.lg} ${colors.buttonGradient} ${colors.buttonHoverGradient} text-white ${theme.radius.lg} font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${theme.shadow.md} hover:shadow-lg flex items-center justify-center gap-2`}
            >
                {isSubmitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Publicando...</span>
                    </>
                ) : (
                    <>
                        <Check className="w-5 h-5" />
                        <span>Publicar reseña</span>
                    </>
                )}
            </button>
        </form>
    );
};

export default ReviewFormStep;
