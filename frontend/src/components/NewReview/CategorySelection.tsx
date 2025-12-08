'use client';

import { Category } from '@/lib/definitions';
import { categoryIcons, categoryGradients, categoryHoverGradients, categoryIconColors, categoryDescriptions } from '@/lib/styles';
import { theme } from '@/lib/theme';

interface CategorySelectionProps {
    categories: Category[] | undefined;
    isLoading: boolean;
    isError: boolean;
    onSelect: (category: Category, event: React.MouseEvent<HTMLButtonElement>) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({
    categories,
    isLoading,
    isError,
    onSelect
}) => {
    const cs = theme.components.newReview.categorySelection;

    return (
        <div className={cs.container} key="step1">
            {isLoading && <p className="text-gray-600 col-span-2 text-sm">Cargando categorías...</p>}
            {isError && <p className="text-red-600 col-span-2 text-sm">Error al cargar las categorías.</p>}
            {!isLoading && !isError && categories?.map((category) => {
                const Icon = categoryIcons[category.slug];
                const gradient = categoryGradients[category.slug] || '';
                const hoverGradient = categoryHoverGradients[category.slug] || '';
                const iconColor = categoryIconColors[category.slug] || 'text-gray-600';
                const description = categoryDescriptions[category.slug] || '';

                return (
                    <button
                        key={category._id}
                        type="button"
                        onClick={(e) => onSelect(category, e)}
                        className={`${cs.button.base} bg-gradient-to-br ${gradient} ${hoverGradient}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={cs.button.iconContainer}>
                                <Icon className={`${cs.button.icon} ${iconColor}`} />
                            </div>
                            <div className={cs.button.contentWrapper}>
                                <h3 className={cs.button.title}>{category.name}</h3>
                                {description && (
                                    <p className={cs.button.description}>{description}</p>
                                )}
                            </div>
                        </div>
                        <div className={cs.button.glowEffect} />
                    </button>
                );
            })}
        </div>
    );
};

export default CategorySelection;
