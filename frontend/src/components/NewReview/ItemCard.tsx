'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Item, Category } from '@/lib/definitions';
import { categoryBorderGlow } from '@/lib/styles';
import { HelpCircle } from 'lucide-react';
import { theme } from '@/lib/theme';

interface ItemCardProps {
    item: Item;
    isSelected: boolean;
    category: Category;
    onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, isSelected, category, onClick }) => {
    const [imageError, setImageError] = useState(false);
    const ic = theme.components.newReview.itemCard;

    return (
        <button
            onClick={onClick}
            className={`${ic.base} ${isSelected ? `${categoryBorderGlow[category.slug]} ${ic.selected}` : ic.unselected}`}
        >
            <div className={ic.imageContainer}>
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
                    <HelpCircle className={ic.imagePlaceholder} />
                )}
            </div>

            <div className={ic.content}>
                <div className={ic.titleRow}>
                    <h4 className={ic.title}>
                        {item.title}
                    </h4>
                    {item.status === 'pending' && (
                        <span className={ic.pendingBadge}>
                            Pendiente
                        </span>
                    )}
                </div>
                <p className={ic.description}>
                    {item.description}
                </p>
            </div>
        </button>
    );
};

export default ItemCard;
