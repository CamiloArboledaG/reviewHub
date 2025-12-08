'use client';

import { Item, Category, ItemsResponse } from '@/lib/definitions';
import { Search, Loader2, Plus } from 'lucide-react';
import ItemCard from './ItemCard';
import { categorySuggestButtonColors } from '@/lib/styles';
import { CustomInput } from '@/components/ui/custom-input';
import { theme } from '@/lib/theme';

interface ItemSearchProps {
    category: Category;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    itemsData: ItemsResponse | undefined;
    isLoadingItems: boolean;
    debouncedSearch: string;
    selectedItem: Item | null;
    onItemSelect: (item: Item) => void;
    onSuggestItem: () => void;
}

const ItemSearch: React.FC<ItemSearchProps> = ({
    category,
    searchQuery,
    onSearchChange,
    itemsData,
    isLoadingItems,
    debouncedSearch,
    selectedItem,
    onItemSelect,
    onSuggestItem,
}) => {
    const is = theme.components.newReview.itemSearch;

    return (
        <div className={is.container} key="step2">
            <div className="space-y-3">
                <label className={is.label}>
                    Buscar {category.name.toLowerCase()}
                </label>
                <CustomInput
                    type="text"
                    variant="sm"
                    value={searchQuery}
                    onChange={(e) => onSearchChange((e.target as HTMLInputElement).value)}
                    placeholder={`Buscar ${category.name.toLowerCase()}...`}
                    leftIcon={<Search className="h-5 w-5" />}
                    focusRing="focus:ring-2 focus:ring-purple-500"
                />

                <div className={is.resultsContainer}>
                    {isLoadingItems && (
                        <div className={is.loadingContainer}>
                            <Loader2 className={is.loadingIcon} />
                            <span className={is.loadingText}>Buscando...</span>
                        </div>
                    )}

                    {!isLoadingItems && itemsData?.items.length === 0 && (
                        <div className={is.emptyContainer}>
                            <p className={is.emptyText}>
                                {debouncedSearch
                                    ? 'No se encontraron resultados'
                                    : 'Escribe para buscar'}
                            </p>
                        </div>
                    )}

                    {!isLoadingItems && itemsData?.items && itemsData.items.length > 0 && (
                        itemsData.items.map((item) => (
                            <ItemCard
                                key={item._id}
                                item={item}
                                isSelected={selectedItem?._id === item._id}
                                category={category}
                                onClick={() => onItemSelect(item)}
                            />
                        ))
                    )}

                    {!isLoadingItems && (() => {
                        const colors = categorySuggestButtonColors[category.slug];
                        return (
                            <button
                                onClick={onSuggestItem}
                                className={`${is.suggestButton.base} ${colors.border} ${colors.bg}`}
                            >
                                <div className="flex items-center justify-center gap-3 text-gray-600">
                                    <div className={`${is.suggestButton.iconContainer} ${colors.iconBg} ${colors.iconBgHover}`}>
                                        <Plus className={`${is.suggestButton.icon} ${colors.text}`} />
                                    </div>
                                    <div className={is.suggestButton.textWrapper}>
                                        <p className={`${is.suggestButton.title} ${colors.textHover}`}>¿No encuentras tu {category.name.toLowerCase().slice(0, -1)}?</p>
                                        <p className={`${is.suggestButton.subtitle} ${colors.subtext} ${colors.subtextHover}`}>Añade un nuevo {category.name.toLowerCase().slice(0, -1)} a la base de datos</p>
                                    </div>
                                </div>
                            </button>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

export default ItemSearch;
