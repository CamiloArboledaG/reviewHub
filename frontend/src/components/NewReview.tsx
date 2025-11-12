'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, ArrowLeft, Search, Loader2 } from 'lucide-react';
import Modal from './Modal';
import { fetchCategories, searchItems } from '@/lib/queries';
import { Category, Item } from '@/lib/definitions';
import { useQuery } from '@tanstack/react-query';
import { categoryIcons, categoryGradients, categoryHoverGradients, categoryIconColors, categoryDescriptions, categoryBorderGlow } from '@/lib/styles';

const NewReview = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [colorExpandKey, setColorExpandKey] = useState(0);
    const colorExpandRef = useRef<{ x: number; y: number; color: string } | null>(null);

    // Debounce para el input de búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const openModal = () => {
        setIsModalOpen(true);
        setCurrentStep(1);
        setSelectedCategory(null);
        setSelectedItem(null);
        setSearchQuery('');
        setDebouncedSearch('');
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentStep(1);
        setSelectedCategory(null);
        setSelectedItem(null);
        setSearchQuery('');
        setDebouncedSearch('');
    };

    const handleCategorySelect = (category: Category, event: React.MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Obtener el color base del gradiente según la categoría
        const colorMap: { [key: string]: string } = {
            game: 'rgba(147, 51, 234, 0.3)',
            movie: 'rgba(244, 63, 94, 0.3)',
            series: 'rgba(59, 130, 246, 0.3)',
            book: 'rgba(16, 185, 129, 0.3)',
        };

        colorExpandRef.current = {
            x,
            y,
            color: colorMap[category.slug] || 'rgba(147, 51, 234, 0.3)',
        };

        setColorExpandKey(prev => prev + 1);
        setSelectedCategory(category);

        // Pequeño delay para que la animación se vea antes de cambiar de paso
        setTimeout(() => {
            setCurrentStep(2);
        }, 100);
    };

    const handleBackToStep1 = () => {
        setCurrentStep(1);
        setSelectedCategory(null);
        setSelectedItem(null);
        setSearchQuery('');
        setDebouncedSearch('');
    };

    const handleItemSelect = (item: Item) => {
        setSelectedItem(item);
    };

    // Query para categorías
    const { data: categories, isLoading, isError } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 0,
        initialData: [],
    });

    // Query para buscar items
    const { data: itemsData, isLoading: isLoadingItems } = useQuery({
        queryKey: ['items', selectedCategory?._id, debouncedSearch],
        queryFn: () => searchItems({
            categoryId: selectedCategory!._id,
            search: debouncedSearch,
            limit: 20,
        }),
        enabled: !!selectedCategory && currentStep === 2,
        staleTime: 30000,
    });

    const getModalTitle = () => {
        if (currentStep === 1) {
            return "Crear nueva reseña";
        }
        return `${selectedCategory?.name}`;
    };

    const getModalDescription = () => {
        if (currentStep === 1) {
            return "¿Qué tipo de contenido quieres reseñar?";
        }
        return "Completa los detalles de tu reseña";
    };

    const modalClassName = selectedCategory && currentStep === 2
        ? `border-2 ${categoryBorderGlow[selectedCategory.slug]} animate-border-glow`
        : '';

    const getTitleIcon = () => {
        if (currentStep === 2 && selectedCategory) {
            const Icon = categoryIcons[selectedCategory.slug];
            const iconColor = categoryIconColors[selectedCategory.slug] || 'text-gray-600';
            return <Icon className={`h-7 w-7 ${iconColor}`} />;
        }
        return undefined;
    };

    return (
        <>
            {/* Efecto de expansión de color */}
            {colorExpandKey > 0 && colorExpandRef.current && (
                <div
                    key={colorExpandKey}
                    className="color-expand-overlay"
                    style={{
                        left: `${colorExpandRef.current.x}px`,
                        top: `${colorExpandRef.current.y}px`,
                        width: '100px',
                        height: '100px',
                        marginLeft: '-50px',
                        marginTop: '-50px',
                        backgroundColor: colorExpandRef.current.color,
                    }}
                />
            )}

            <button
                onClick={openModal}
                className="fixed bottom-5 right-5 bg-purple-800 hover:bg-purple-900 text-white p-4 rounded-full shadow-xl shadow-gray-400 z-40 transition-colors duration-300 cursor-pointer"
            >
                <Plus size={24} />
            </button>
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={getModalTitle()}
                description={getModalDescription()}
                className={modalClassName}
                titleIcon={getTitleIcon()}
            >
                <div className="relative">
                    {currentStep === 1 && (
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in"
                            key="step1"
                        >
                            {isLoading && <p className="text-gray-600 col-span-2">Cargando categorías...</p>}
                            {isError && <p className="text-red-600 col-span-2">Error al cargar las categorías.</p>}
                            {!isLoading && !isError && categories?.map((category) =>
                            {
                                const Icon = categoryIcons[category.slug];
                                const gradient = categoryGradients[category.slug] || '';
                                const hoverGradient = categoryHoverGradients[category.slug] || '';
                                const iconColor = categoryIconColors[category.slug] || 'text-gray-600';
                                const description = categoryDescriptions[category.slug] || '';

                                return (
                                    <button
                                        key={category._id}
                                        type="button"
                                        onClick={(e) => handleCategorySelect(category, e)}
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
                                )
                            })}
                        </div>
                    )}

                    {currentStep === 2 && selectedCategory && (
                        <div className="space-y-4 animate-fade-in" key="step2">
                            <button
                                onClick={handleBackToStep1}
                                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 cursor-pointer group"
                                title="Volver"
                            >
                                <ArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
                            </button>

                            {/* Buscador de items */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Buscar {selectedCategory.name.toLowerCase()}
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={`Buscar ${selectedCategory.name.toLowerCase()}...`}
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
                                            <button
                                                key={item._id}
                                                onClick={() => handleItemSelect(item)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                                                    selectedItem?._id === item._id
                                                        ? `${categoryBorderGlow[selectedCategory.slug]} bg-gray-50`
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {item.imageUrl && (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 text-left min-w-0">
                                                    <h4 className="font-semibold text-gray-900 truncate">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </button>
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
                    )}
                </div>
            </Modal>
        </>
    )
}

export default NewReview;
