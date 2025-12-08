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
    const si = theme.components.newReview.suggestItem;

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
        <form onSubmit={handleSubmit} className={si.container} key="step3">
            <div className={si.warningBox}>
                <p className={si.warningText}>
                    <strong>Nota:</strong> Tu sugerencia será revisada por un administrador antes de ser publicada.
                    La imagen será agregada durante el proceso de aprobación.
                </p>
            </div>

            <div>
                <label htmlFor="title" className={si.label}>
                    Título <span className={si.required}>*</span>
                </label>
                <CustomInput
                    id="title"
                    type="text"
                    variant="sm"
                    value={title}
                    onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                    placeholder={`Nombre del ${category.name.toLowerCase().slice(0, -1)}`}
                    focusRing={colors.inputFocusRing}
                    focusBorder={colors.inputFocusBorder}
                    disabled={mutation.isPending}
                />
            </div>

            <div>
                <label htmlFor="description" className={si.label}>
                    Descripción <span className={si.required}>*</span>
                </label>
                <CustomInput
                    id="description"
                    asTextarea
                    variant="sm"
                    value={description}
                    onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
                    placeholder={`Describe el ${category.name.toLowerCase().slice(0, -1)}`}
                    rows={4}
                    focusRing={colors.inputFocusRing}
                    focusBorder={colors.inputFocusBorder}
                    disabled={mutation.isPending}
                />
            </div>

            <button
                type="submit"
                className={`${si.submitButton.base} ${theme.componentSpacing.button.lg} ${colors.buttonGradient} ${colors.buttonHoverGradient} text-white ${theme.borders.radius.lg} ${theme.shadows.scale.md} hover:shadow-lg`}
                disabled={mutation.isPending}
            >
                {mutation.isPending ? (
                    <>
                        <Loader2 className={si.submitButton.icon} />
                        <span>Enviando...</span>
                    </>
                ) : (
                    <>
                        <Plus className={si.submitButton.icon} />
                        <span>Sugerir {category.name.toLowerCase().slice(0, -1)}</span>
                    </>
                )}
            </button>
        </form>
    );
};

export default SuggestItemStep;
