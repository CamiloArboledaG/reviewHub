'use client';

import { useState } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import Modal from './Modal';
import { fetchCategories } from '@/lib/queries';
import { Category } from '@/lib/definitions';
import { useQuery } from '@tanstack/react-query';
import { categoryIcons, categoryGradients, categoryHoverGradients, categoryIconColors, categoryDescriptions, categoryBorderGlow } from '@/lib/styles';

const NewReview = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const openModal = () => {
        setIsModalOpen(true);
        setCurrentStep(1);
        setSelectedCategory(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentStep(1);
        setSelectedCategory(null);
    };

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        setCurrentStep(2);
    };

    const handleBackToStep1 = () => {
        setCurrentStep(1);
        setSelectedCategory(null);
    };

    
  const { data: categories, isLoading, isError } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 0,
    initialData: [],
  });

    const getModalTitle = () => {
        if (currentStep === 1) {
            return "Selecciona una categoría";
        }
        return `Categoría: ${selectedCategory?.name}`;
    };

    const getModalDescription = () => {
        if (currentStep === 1) {
            return "Elige el tipo de contenido que deseas explorar";
        }
        return "Completa los detalles de tu review";
    };

    const modalClassName = selectedCategory && currentStep === 2
        ? `border-2 ${categoryBorderGlow[selectedCategory.slug]} transition-all duration-300`
        : '';

    return (
        <>
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
            >
                {currentStep === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                    onClick={() => handleCategorySelect(category)}
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
                    <div className="space-y-4">
                        <button
                            onClick={handleBackToStep1}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 group"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                            <span className="text-sm font-medium">Cambiar categoría</span>
                        </button>

                        {/* Aquí irá el formulario del paso 2 */}
                        <div className="text-center py-8">
                            <p className="text-gray-500">Formulario del paso 2 (próximamente)</p>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    )
}

export default NewReview;
