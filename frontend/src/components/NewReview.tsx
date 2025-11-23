'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Modal from './Modal';
import CategorySelection from './NewReview/CategorySelection';
import ItemSearch from './NewReview/ItemSearch';
import SuggestItemStep from './NewReview/SuggestItemStep';
import ReviewFormStep from './NewReview/ReviewFormStep';
import { fetchCategories, searchItems } from '@/lib/queries';
import { Category, Item } from '@/lib/definitions';
import { useQuery } from '@tanstack/react-query';
import { categoryIcons, categoryIconColors, categoryBorderGlow } from '@/lib/styles';

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

    const handleBackToStep2 = () => {
        setCurrentStep(2);
        setSelectedItem(null);
    };

    const handleItemSelect = (item: Item) => {
        setSelectedItem(item);
        // Ir directamente al step 4 (formulario de review)
        setTimeout(() => {
            setCurrentStep(4);
        }, 100);
    };

    const handleSuggestItem = () => {
        setCurrentStep(3);
    };

    const handleSuggestSuccess = (item: Item) => {
        setSelectedItem(item);
        // Ir al step 4 después de sugerir exitosamente
        setCurrentStep(4);
    };

    const handleReviewSubmit = (data: { rating: number; content: string }) => {
        console.log('Review data:', {
            category: selectedCategory,
            item: selectedItem,
            ...data,
        });
        // TODO: Implementar la lógica para crear la review
        closeModal();
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
        switch (currentStep) {
            case 1:
                return "Crear nueva reseña";
            case 2:
                return selectedCategory?.name || "";
            case 3:
                return `Sugerir ${selectedCategory?.name.toLowerCase().slice(0, -1)}`;
            case 4:
                return "Escribe tu reseña";
            default:
                return "";
        }
    };

    const getModalDescription = () => {
        switch (currentStep) {
            case 1:
                return "¿Qué tipo de contenido quieres reseñar?";
            case 2:
                return `Busca el ${selectedCategory?.name.toLowerCase().slice(0, -1)} que quieres reseñar`;
            case 3:
                return "Ayúdanos a expandir nuestra base de datos";
            case 4:
                return "Comparte tu opinión con la comunidad";
            default:
                return "";
        }
    };

    const modalClassName = selectedCategory && (currentStep === 2 || currentStep === 3 || currentStep === 4)
        ? `border-2 ${categoryBorderGlow[selectedCategory.slug]} animate-border-glow`
        : '';

    const getTitleIcon = () => {
        if ((currentStep === 2 || currentStep === 3 || currentStep === 4) && selectedCategory) {
            const Icon = categoryIcons[selectedCategory.slug];
            const iconColor = categoryIconColors[selectedCategory.slug] || 'text-gray-600';
            return <Icon className={`h-7 w-7 ${iconColor}`} />;
        }
        return undefined;
    };

    const getBackHandler = () => {
        switch (currentStep) {
            case 2:
                return handleBackToStep1;
            case 3:
            case 4:
                return handleBackToStep2;
            default:
                return undefined;
        }
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
                showBackButton={currentStep > 1}
                onBack={getBackHandler()}
            >
                <div className="relative">
                    {currentStep === 1 && (
                        <CategorySelection
                            categories={categories}
                            isLoading={isLoading}
                            isError={isError}
                            onSelect={handleCategorySelect}
                        />
                    )}

                    {currentStep === 2 && selectedCategory && (
                        <ItemSearch
                            category={selectedCategory}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            itemsData={itemsData}
                            isLoadingItems={isLoadingItems}
                            debouncedSearch={debouncedSearch}
                            selectedItem={selectedItem}
                            onItemSelect={handleItemSelect}
                            onSuggestItem={handleSuggestItem}
                        />
                    )}

                    {currentStep === 3 && selectedCategory && (
                        <SuggestItemStep
                            category={selectedCategory}
                            onSuccess={handleSuggestSuccess}
                        />
                    )}

                    {currentStep === 4 && selectedCategory && selectedItem && (
                        <ReviewFormStep
                            category={selectedCategory}
                            item={selectedItem}
                            onSubmit={handleReviewSubmit}
                            isSubmitting={false}
                        />
                    )}
                </div>
            </Modal>
        </>
    );
};

export default NewReview;
