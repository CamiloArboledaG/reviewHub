'use client';

import { Item, Category, ItemsResponse } from '@/lib/definitions';
import { Search, Loader2, Plus } from 'lucide-react';
import ItemCard from './ItemCard';
import { categorySuggestButtonColors } from '@/lib/styles';
import { CustomInput } from '@/components/ui/custom-input';

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
    return (
        <div className="space-y-4 animate-fade-in" key="step2">
            {/* Buscador de items */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                    Buscar {category.name.toLowerCase()}
                </label>
                <CustomInput
                    type="text"
                    variant="md"
                    value={searchQuery}
                    onChange={(e) => onSearchChange((e.target as HTMLInputElement).value)}
                    placeholder={`Buscar ${category.name.toLowerCase()}...`}
                    leftIcon={<Search className="h-5 w-5" />}
                    focusRing="focus:ring-2 focus:ring-purple-500"
                />

                {/* Lista de resultados */}
                <div className="max-h-[400px] overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
                    {isLoadingItems && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                            <span className="ml-2 text-gray-600">Buscando...</span>
                        </div>
                    )}

                    {!isLoadingItems && itemsData?.items.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
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

                    {/* Botón para sugerir item */}
                    {!isLoadingItems && (() => {
                        const colors = categorySuggestButtonColors[category.slug];
                        return (
                            <button
                                onClick={onSuggestItem}
                                className={`w-full mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg ${colors.border} ${colors.bg} transition-all duration-200 cursor-pointer group`}
                            >
                                <div className="flex items-center justify-center gap-3 text-gray-600">
                                    <div className={`w-10 h-10 rounded-full ${colors.iconBg} flex items-center justify-center ${colors.iconBgHover} transition-colors`}>
                                        <Plus className={`h-5 w-5 ${colors.text}`} />
                                    </div>
                                    <div className="text-left">
                                        <p className={`font-medium ${colors.textHover}`}>¿No encuentras tu {category.name.toLowerCase().slice(0, -1)}?</p>
                                        <p className={`text-sm ${colors.subtext} ${colors.subtextHover}`}>Añade un nuevo {category.name.toLowerCase().slice(0, -1)} a la base de datos</p>
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
