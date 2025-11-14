'use client';

import { Item, Category, ItemsResponse } from '@/lib/definitions';
import { Search, Loader2, ArrowLeft } from 'lucide-react';
import ItemCard from './ItemCard';

interface ItemSearchProps {
    category: Category;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    itemsData: ItemsResponse | undefined;
    isLoadingItems: boolean;
    debouncedSearch: string;
    selectedItem: Item | null;
    onItemSelect: (item: Item) => void;
    onBack: () => void;
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
    onBack
}) => {
    return (
        <div className="space-y-4 animate-fade-in" key="step2">
            <button
                onClick={onBack}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 cursor-pointer group"
                title="Volver"
            >
                <ArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
            </button>

            {/* Buscador de items */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                    Buscar {category.name.toLowerCase()}
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={`Buscar ${category.name.toLowerCase()}...`}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                </div>

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
                </div>

                {/* Indicador de item seleccionado */}
                {selectedItem && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-800">
                            ✓ Seleccionado: {selectedItem.title}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemSearch;
