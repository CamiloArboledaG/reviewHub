'use client';

import { useState } from 'react';
import { Category, Item } from '@/lib/definitions';
import { useMutation } from '@tanstack/react-query';
import { suggestItem } from '@/lib/queries';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { categoryReviewFormColors } from '@/lib/styles';
import { theme } from '@/lib/theme';
import { CustomInput } from '@/components/ui/custom-input';

interface SuggestItemStepProps {
    category: Category;
    onSuccess: (item: Item) => void;
}

const SuggestItemStep: React.FC<SuggestItemStepProps> = ({ category, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const { showToast } = useToast();
    const colors = categoryReviewFormColors[category.slug];

    const mutation = useMutation({
        mutationFn: suggestItem,
        onSuccess: (data) => {
            showToast('Item sugerido exitosamente. Será revisado por un administrador.', 'success');
            onSuccess(data);
        },
        onError: (error: Error) => {
            showToast(error.message || 'Error al sugerir item', 'error');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            showToast('Por favor completa todos los campos', 'error');
            return;
        }

        mutation.mutate({
            title: title.trim(),
            description: description.trim(),
            categoryId: category._id,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in" key="step3">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                    <strong>Nota:</strong> Tu sugerencia será revisada por un administrador antes de ser publicada.
                    La imagen será agregada durante el proceso de aprobación.
                </p>
            </div>

            {/* Título */}
            <div>
                <label htmlFor="title" className="block text-sm font-bold text-gray-900 mb-2">
                    Título <span className="text-red-500">*</span>
                </label>
                <CustomInput
                    id="title"
                    type="text"
                    variant="md"
                    value={title}
                    onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                    placeholder={`Nombre del ${category.name.toLowerCase().slice(0, -1)}`}
                    focusRing={colors.inputFocusRing}
                    focusBorder={colors.inputFocusBorder}
                    disabled={mutation.isPending}
                />
            </div>

            {/* Descripción */}
            <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-2">
                    Descripción <span className="text-red-500">*</span>
                </label>
                <CustomInput
                    id="description"
                    asTextarea
                    variant="md"
                    value={description}
                    onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
                    placeholder={`Describe el ${category.name.toLowerCase().slice(0, -1)}`}
                    rows={4}
                    focusRing={colors.inputFocusRing}
                    focusBorder={colors.inputFocusBorder}
                    disabled={mutation.isPending}
                />
            </div>

            {/* Botón de envío */}
            <button
                type="submit"
                className={`w-full ${theme.componentSpacing.button.lg} ${colors.buttonGradient} ${colors.buttonHoverGradient} text-white ${theme.borders.radius.lg} font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${theme.shadows.scale.md} hover:shadow-lg flex items-center justify-center gap-2`}
                disabled={mutation.isPending}
            >
                {mutation.isPending ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Enviando...</span>
                    </>
                ) : (
                    <>
                        <Plus className="w-5 h-5" />
                        <span>Sugerir {category.name.toLowerCase().slice(0, -1)}</span>
                    </>
                )}
            </button>
        </form>
    );
};

export default SuggestItemStep;
