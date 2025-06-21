import { Category } from './definitions';

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
  if (!res.ok) {
    throw new Error('Error al obtener las categorías');
  }
  return res.json();
}; 