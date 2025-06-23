import { Category, LoginCredentials, RegisterCredentials } from './definitions';
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

export const loginUser = async (credentials: LoginCredentials) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al iniciar sesión');
  }

  return res.json();
};

export const registerUser = async (credentials: RegisterCredentials) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al registrar el usuario');
  }

  return res.json();
}; 