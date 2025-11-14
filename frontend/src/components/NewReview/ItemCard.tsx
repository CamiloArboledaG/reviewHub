'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Item, Category } from '@/lib/definitions';
import { categoryBorderGlow } from '@/lib/styles';
import { HelpCircle } from 'lucide-react';

interface ItemCardProps {
    item: Item;
    isSelected: boolean;
    category: Category;
    onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, isSelected, category, onClick }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                    ? `${categoryBorderGlow[category.slug]} bg-gray-50`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
        >
            {/* Contenedor de imagen con placeholder */}
            <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center relative">
                {item.imageUrl && !imageError ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                        onError={() => setImageError(true)}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
                    />
                ) : (
                    <HelpCircle className="h-8 w-8 text-gray-400" />
                )}
            </div>

            {/* Información del item */}
            <div className="flex-1 text-left min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                    {item.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                </p>
            </div>
        </button>
    );
};

export default ItemCard;
