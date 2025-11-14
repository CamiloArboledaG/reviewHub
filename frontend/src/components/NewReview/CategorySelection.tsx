'use client';

import { Category } from '@/lib/definitions';
import { categoryIcons, categoryGradients, categoryHoverGradients, categoryIconColors, categoryDescriptions } from '@/lib/styles';

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
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in" key="step1">
            {isLoading && <p className="text-gray-600 col-span-2">Cargando categorías...</p>}
            {isError && <p className="text-red-600 col-span-2">Error al cargar las categorías.</p>}
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
                        className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} ${hoverGradient} border border-gray-200/50 p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`shrink-0 rounded-lg bg-white p-3 shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                                <Icon className={`h-6 w-6 ${iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg mb-1 text-gray-900">{category.name}</h3>
                                {description && (
                                    <p className="text-sm text-gray-600">{description}</p>
                                )}
                            </div>
                        </div>
                        {/* Efecto de brillo al hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full" />
                    </button>
                );
            })}
        </div>
    );
};

export default CategorySelection;
