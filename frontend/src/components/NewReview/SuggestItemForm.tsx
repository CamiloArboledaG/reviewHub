'use client';

import { useState } from 'react';
import { Category, Item } from '@/lib/definitions';
import { useMutation } from '@tanstack/react-query';
import { suggestItem } from '@/lib/queries';
import { Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface SuggestItemFormProps {
    category: Category;
    onClose: () => void;
    onSuccess: (item: Item) => void;
}

const SuggestItemForm: React.FC<SuggestItemFormProps> = ({ category, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { showToast } = useToast();

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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
            image: image || undefined,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex justify-center items-center" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-lg m-6 w-full max-w-[500px] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-200/50">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Sugerir {category.name.toLowerCase().slice(0, -1)}</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Tu sugerencia será revisada antes de ser publicada
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer ml-4 flex-shrink-0"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Título */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Título *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={`Nombre del ${category.name.toLowerCase().slice(0, -1)}`}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            disabled={mutation.isPending}
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción *
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={`Describe el ${category.name.toLowerCase().slice(0, -1)}`}
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                            disabled={mutation.isPending}
                        />
                    </div>

                    {/* Imagen (opcional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Imagen (opcional)
                        </label>
                        <div className="flex items-start gap-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview(null);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1">
                                <label
                                    htmlFor="image-upload"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors"
                                >
                                    <Upload size={18} />
                                    <span>{imagePreview ? 'Cambiar imagen' : 'Subir imagen'}</span>
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={mutation.isPending}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Si no subes una imagen, se usará una por defecto
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={mutation.isPending}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                'Sugerir'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuggestItemForm;
