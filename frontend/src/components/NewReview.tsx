'use client';

import { useReducer, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Modal from './Modal';
import CategorySelection from './NewReview/CategorySelection';
import ItemSearch from './NewReview/ItemSearch';
import SuggestItemStep from './NewReview/SuggestItemStep';
import ReviewFormStep from './NewReview/ReviewFormStep';
import { fetchCategories, searchItems, createReview } from '@/lib/queries';
import { Category, Item } from '@/lib/definitions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryIcons, categoryIconColors, categoryBorderGlow } from '@/lib/styles';
import { useToast } from '@/context/ToastContext';

type State = {
    isModalOpen: boolean;
    currentStep: number;
    selectedCategory: Category | null;
    selectedItem: Item | null;
    searchQuery: string;
    debouncedSearch: string;
    colorExpandKey: number;
};

type Action =
    | { type: 'OPEN_MODAL' }
    | { type: 'CLOSE_MODAL' }
    | { type: 'SET_STEP'; payload: number }
    | { type: 'SELECT_CATEGORY'; payload: Category }
    | { type: 'SELECT_ITEM'; payload: Item }
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'SET_DEBOUNCED_SEARCH'; payload: string }
    | { type: 'INCREMENT_COLOR_KEY' }
    | { type: 'BACK_TO_STEP_1' }
    | { type: 'BACK_TO_STEP_2' }
    | { type: 'GO_TO_SUGGEST_ITEM' }
    | { type: 'SUGGEST_SUCCESS'; payload: Item };

const initialState: State = {
    isModalOpen: false,
    currentStep: 1,
    selectedCategory: null,
    selectedItem: null,
    searchQuery: '',
    debouncedSearch: '',
    colorExpandKey: 0,
};

function newReviewReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'OPEN_MODAL':
            return { ...initialState, isModalOpen: true };
        case 'CLOSE_MODAL':
            return initialState;
        case 'SET_STEP':
            return { ...state, currentStep: action.payload };
        case 'SELECT_CATEGORY':
            if (!action.payload) return state;
            return {
                ...state,
                selectedCategory: action.payload,
                currentStep: 2,
                colorExpandKey: state.colorExpandKey + 1
            };
        case 'SELECT_ITEM':
            if (!action.payload || !state.selectedCategory) return state;
            return { ...state, selectedItem: action.payload, currentStep: 4 };
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        case 'SET_DEBOUNCED_SEARCH':
            return { ...state, debouncedSearch: action.payload };
        case 'INCREMENT_COLOR_KEY':
            return { ...state, colorExpandKey: state.colorExpandKey + 1 };
        case 'BACK_TO_STEP_1':
            return {
                ...state,
                currentStep: 1,
                selectedCategory: null,
                selectedItem: null,
                searchQuery: '',
                debouncedSearch: ''
            };
        case 'BACK_TO_STEP_2':
            if (!state.selectedCategory) return state;
            return { ...state, currentStep: 2, selectedItem: null };
        case 'GO_TO_SUGGEST_ITEM':
            if (!state.selectedCategory) return state;
            return { ...state, currentStep: 3 };
        case 'SUGGEST_SUCCESS':
            if (!action.payload || !state.selectedCategory) return state;
            return { ...state, selectedItem: action.payload, currentStep: 4 };
        default:
            return state;
    }
}

const NewReview = () => {
    const [state, dispatch] = useReducer(newReviewReducer, initialState);
    const colorExpandRef = useRef<{ x: number; y: number; color: string } | null>(null);
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    // Debounce para el input de búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch({ type: 'SET_DEBOUNCED_SEARCH', payload: state.searchQuery });
        }, 500);

        return () => clearTimeout(timer);
    }, [state.searchQuery]);

    const openModal = () => {
        dispatch({ type: 'OPEN_MODAL' });
    };

    const closeModal = () => {
        dispatch({ type: 'CLOSE_MODAL' });
    };

    const handleCategorySelect = (category: Category, event: React.MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

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

        setTimeout(() => {
            dispatch({ type: 'SELECT_CATEGORY', payload: category });
        }, 100);
    };

    const handleBackToStep1 = () => {
        dispatch({ type: 'BACK_TO_STEP_1' });
    };

    const handleBackToStep2 = () => {
        dispatch({ type: 'BACK_TO_STEP_2' });
    };

    const handleItemSelect = (item: Item) => {
        setTimeout(() => {
            dispatch({ type: 'SELECT_ITEM', payload: item });
        }, 100);
    };

    const handleSuggestItem = () => {
        dispatch({ type: 'GO_TO_SUGGEST_ITEM' });
    };

    const handleSuggestSuccess = (item: Item) => {
        dispatch({ type: 'SUGGEST_SUCCESS', payload: item });
    };

    const reviewMutation = useMutation({
        mutationFn: createReview,
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ['reviews'],
                type: 'active'
            });
            showToast('¡Reseña publicada exitosamente!', 'success');
            closeModal();
        },
        onError: (error: Error) => {
            showToast(error.message || 'Error al crear la reseña', 'error');
        },
    });

    const handleReviewSubmit = (data: { rating: number; content: string }) => {
        if (!state.selectedItem) {
            showToast('No se ha seleccionado un item', 'error');
            return;
        }

        reviewMutation.mutate({
            itemId: state.selectedItem._id,
            rating: data.rating,
            content: data.content,
        });
    };

    // Query para categorías
    const { data: categories, isLoading, isError, error: categoriesError } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 0,
        initialData: [],
    });

    // Mostrar error de categorías
    useEffect(() => {
        if (isError && categoriesError) {
            showToast('Error al cargar categorías', 'error');
        }
    }, [isError, categoriesError, showToast]);

    // Query para buscar items
    const { data: itemsData, isLoading: isLoadingItems } = useQuery({
        queryKey: ['items', state.selectedCategory?._id, state.debouncedSearch],
        queryFn: () => searchItems({
            categoryId: state.selectedCategory!._id,
            search: state.debouncedSearch,
            limit: 20,
        }),
        enabled: !!state.selectedCategory && state.currentStep === 2,
        staleTime: 30000,
    });

    const getModalTitle = () => {
        switch (state.currentStep) {
            case 1:
                return "Crear nueva reseña";
            case 2:
                return state.selectedCategory?.name || "";
            case 3:
                return `Sugerir ${state.selectedCategory?.name.toLowerCase().slice(0, -1)}`;
            case 4:
                return "Escribe tu reseña";
            default:
                return "";
        }
    };

    const getModalDescription = () => {
        switch (state.currentStep) {
            case 1:
                return "¿Qué tipo de contenido quieres reseñar?";
            case 2:
                return `Busca el ${state.selectedCategory?.name.toLowerCase().slice(0, -1)} que quieres reseñar`;
            case 3:
                return "Ayúdanos a expandir nuestra base de datos";
            case 4:
                return "Comparte tu opinión con la comunidad";
            default:
                return "";
        }
    };

    const modalClassName = state.selectedCategory && (state.currentStep === 2 || state.currentStep === 3 || state.currentStep === 4)
        ? `border-2 ${categoryBorderGlow[state.selectedCategory.slug]} animate-border-glow`
        : '';

    const getTitleIcon = () => {
        if ((state.currentStep === 2 || state.currentStep === 3 || state.currentStep === 4) && state.selectedCategory) {
            const Icon = categoryIcons[state.selectedCategory.slug];
            const iconColor = categoryIconColors[state.selectedCategory.slug] || 'text-gray-600';
            return <Icon className={`h-7 w-7 ${iconColor}`} />;
        }
        return undefined;
    };

    const getBackHandler = () => {
        switch (state.currentStep) {
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
            {state.colorExpandKey > 0 && colorExpandRef.current && (
                <div
                    key={state.colorExpandKey}
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
                isOpen={state.isModalOpen}
                onClose={closeModal}
                title={getModalTitle()}
                description={getModalDescription()}
                className={modalClassName}
                titleIcon={getTitleIcon()}
                showBackButton={state.currentStep > 1}
                onBack={getBackHandler()}
            >
                <div className="relative">
                    {state.currentStep === 1 && (
                        <CategorySelection
                            categories={categories}
                            isLoading={isLoading}
                            isError={isError}
                            onSelect={handleCategorySelect}
                        />
                    )}

                    {state.currentStep === 2 && state.selectedCategory && (
                        <ItemSearch
                            category={state.selectedCategory}
                            searchQuery={state.searchQuery}
                            onSearchChange={(value) => dispatch({ type: 'SET_SEARCH_QUERY', payload: value })}
                            itemsData={itemsData}
                            isLoadingItems={isLoadingItems}
                            debouncedSearch={state.debouncedSearch}
                            selectedItem={state.selectedItem}
                            onItemSelect={handleItemSelect}
                            onSuggestItem={handleSuggestItem}
                        />
                    )}

                    {state.currentStep === 3 && state.selectedCategory && (
                        <SuggestItemStep
                            category={state.selectedCategory}
                            onSuccess={handleSuggestSuccess}
                        />
                    )}

                    {state.currentStep === 4 && state.selectedCategory && state.selectedItem && (
                        <ReviewFormStep
                            category={state.selectedCategory}
                            item={state.selectedItem}
                            onSubmit={handleReviewSubmit}
                            isSubmitting={reviewMutation.isPending}
                        />
                    )}
                </div>
            </Modal>
        </>
    );
};

export default NewReview;
