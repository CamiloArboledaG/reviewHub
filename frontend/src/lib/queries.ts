import { Category } from './definitions';
import { ReviewsPage } from './definitions';

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
  if (!res.ok) {
    throw new Error('Error al obtener las categorías');
  }
  return res.json();
};

export const fetchReviews = async ({ pageParam = 1 }): Promise<ReviewsPage> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?page=${pageParam}&limit=5`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
} 