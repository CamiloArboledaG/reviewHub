import { Category, LoginCredentials, RegisterCredentials, User, ItemsResponse, Avatar } from './definitions';
import { ReviewsPage } from './definitions';

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Error al obtener las categorías');
  }
  return res.json();
};

export const fetchAvatars = async (category?: string): Promise<Avatar[]> => {
  const url = category
    ? `${process.env.NEXT_PUBLIC_API_URL}/avatars?category=${category}`
    : `${process.env.NEXT_PUBLIC_API_URL}/avatars`;

  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Error al obtener avatares');
  }
  return res.json();
};

export const fetchDefaultAvatars = async (): Promise<Avatar[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/avatars/defaults`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Error al obtener avatares predeterminados');
  }
  return res.json();
};

export const fetchReviews = async ({ pageParam = 1, categories }: { pageParam?: number, categories?: string[] | null }): Promise<ReviewsPage> => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/reviews?page=${pageParam}&limit=5`;
  if (categories && categories.length > 0) {
    categories.forEach(category => {
      url += `&category=${category}`;
    });
  }
  const res = await fetch(url, { credentials: 'include' });
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
    credentials: 'include',
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
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al registrar el usuario');
  }

  return res.json();
};

export const getProfile = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch profile');
  }

  return res.json();
};

export const logoutUser = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Error al cerrar sesión');
  }

  return res.json();
};

export const followUser = async (userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/follow`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al seguir al usuario');
  }

  return res.json();
};

export const unfollowUser = async (userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/unfollow`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al dejar de seguir al usuario');
  }

  return res.json();
};

export type FollowingResponse = { following: User[] };

export const getFollowing = async (): Promise<FollowingResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/following`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Error al obtener los usuarios que sigues');
  }

  return res.json();
};

export const searchItems = async ({
  categoryId,
  search = '',
  page = 1,
  limit = 10
}: {
  categoryId: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ItemsResponse> => {
  const params = new URLSearchParams({
    category: categoryId,
    search,
    page: page.toString(),
    limit: limit.toString(),
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items?${params}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Error al buscar items');
  }

  return res.json();
};

export const suggestItem = async ({
  title,
  description,
  categoryId,
}: {
  title: string;
  description: string;
  categoryId: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/suggest`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
      category: categoryId,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al sugerir item');
  }

  return res.json();
};