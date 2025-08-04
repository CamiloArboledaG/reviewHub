export type Category = {
  _id: string;
  name: string;
  slug: 'game' | 'movie' | 'series' | 'book';
};

export type User = {
  _id: string;
  name:string;
  username: string;
  avatarUrl?: string;
}

export type Item = {
  _id: string;
  title: string;
  imageUrl?: string;
  category: Category;
}

export type Review = {
  _id: string;
  content: string;
  createdAt: string;
  user: User;
  item: Item;
  rating: {
    value: number;
    max: number;
  };
  likes: number;
  comments: string[];
};

export type ReviewsPage = {
  reviews: Review[];
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  hasNextPage: boolean;
};

export type LoginCredentials = {
  username?: string;
  password?: string;
  email?: string;
};

export type RegisterCredentials = {
  name: string;
  username: string;
  email: string;
  password?: string;
  avatarUrl?: string;
}; 