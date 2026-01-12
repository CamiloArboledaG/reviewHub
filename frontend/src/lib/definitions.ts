export type Category = {
  _id: string;
  name: string;
  slug: 'game' | 'movie' | 'series' | 'book';
};

export type Avatar = {
  _id: string;
  name: string;
  imageUrl: string;
  category: 'human' | 'animal' | 'fantasy' | 'abstract' | 'custom';
  isDefault: boolean;
};

export type User = {
  _id: string;
  name:string;
  username: string;
  avatar?: Avatar;
}

export type Item = {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: Category;
  status?: 'active' | 'pending';
  suggestedBy?: string;
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
  comments: number;
  isFollowing?: boolean;
  isLiked?: boolean;
};

export type ReviewsPage = {
  reviews: Review[];
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  hasNextPage: boolean;
};

export type InfiniteReviewsData = {
  pages: ReviewsPage[];
  pageParams: number[];
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
  avatar?: string; // ID del avatar seleccionado
};

export type ItemsResponse = {
  items: Item[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
};

export type Comment = {
  _id: string;
  user: User;
  review: string;
  content: string;
  parentComment: string | null;
  likes: number;
  repliesCount: number;
  replies: Comment[];
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CommentsPage = {
  comments: Comment[];
  currentPage: number;
  totalPages: number;
  totalComments: number;
  hasNextPage: boolean;
};

export type InfiniteCommentsData = {
  pages: CommentsPage[];
  pageParams: number[];
}; 