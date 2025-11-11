# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ReviewHub is a full-stack social review platform where users can post and share reviews for games, movies, series, and books. The project is split into a Next.js frontend and Express.js backend, with MongoDB as the database.

## Architecture

### Monorepo Structure
- `frontend/` - Next.js 15 app with TypeScript, React 19, Tailwind CSS 4
- `backend/` - Express.js API with Mongoose ODM

### Backend Architecture (`backend/src/`)

**API Structure:**
- `index.js` - Express server entry point with CORS configured for `http://localhost:3000`
- `models/` - Mongoose models (User, Review, Item, Category, Comment)
  - User model has `followers` and `following` arrays for social features
  - Review model references User and Item, with rating, likes, and comments
- `controllers/` - Business logic (authController, reviewController, userController, categoryController)
- `routes/` - Express routes mounted at `/api/*`
  - `/api/auth` - Authentication endpoints
  - `/api/reviews` - Review CRUD operations
  - `/api/users` - User operations including follow/unfollow
  - `/api/categories` - Category listing
- `middleware/authMiddleware.js` - JWT token verification
  - `protect` - Requires authenticated user
  - `loadUser` - Optionally loads user if token exists

**Authentication:**
- JWT tokens stored in HTTP-only cookies
- bcryptjs for password hashing
- User model has pre-save hook for password hashing and `comparePassword` method

### Frontend Architecture (`frontend/src/`)

**App Router Structure:**
- `app/(main)/home/` - Main feed with reviews (public)
- `app/(main)/following/` - Following feed (protected)
- `app/login/` and `app/register/` - Authentication pages
- `middleware.ts` - Route protection logic redirecting unauthenticated users to `/login`

**Core Directories:**
- `components/` - React components (Header, Sidebar, ReviewCard, Modal, NewReview, AvatarSelector)
  - `ui/` - shadcn/ui components
- `context/` - React Context providers
  - `AuthContext.tsx` - Global authentication state with login/logout methods
  - `ToastContext.tsx` - Toast notifications
- `lib/` - Utility modules
  - `queries.ts` - API fetch functions (fetchReviews, loginUser, followUser, etc.)
  - `definitions.ts` - TypeScript type definitions
  - `styles.ts` - Shared style utilities
  - `utils.ts` - Helper functions

**Data Fetching:**
- TanStack Query (React Query) for server state management with persistence
- All API calls in `lib/queries.ts` use `credentials: 'include'` for cookie-based auth
- Infinite scroll for reviews using `useInfiniteQuery`

**State Management:**
- AuthContext provides `user`, `isAuthenticated`, `login()`, `logout()`, `loading`
- TanStack Query handles server state caching and synchronization

## Development Commands

### Backend
```bash
cd backend
npm run dev          # Start backend with nodemon (watches for changes)
npm run seed        # Seed database with sample data
```

### Frontend
```bash
cd frontend
npm run dev         # Start Next.js dev server with Turbopack
npm run build       # Production build
npm start           # Start production server
npm run lint        # Run ESLint
```

### Environment Variables

**Backend** (`.env`):
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_API_URL` - Backend API URL (e.g., `http://localhost:5000/api`)

## Key Architectural Patterns

### Authentication Flow
1. Login/register sends credentials to backend `/api/auth/login` or `/api/auth/register`
2. Backend sets JWT token in HTTP-only cookie
3. Frontend calls `/api/auth/profile` to get user data
4. AuthContext stores user data and provides `isAuthenticated` state
5. Middleware on both frontend and backend protect routes

### Review Pagination
- Backend: Uses MongoDB skip/limit with `?page=X&limit=Y&category=Z` query params
- Frontend: TanStack Query `useInfiniteQuery` for infinite scroll
- Reviews include populated user and item data with category

### Social Features
- User model has bidirectional `followers` and `following` arrays
- Follow/unfollow endpoints at `/api/users/:id/follow` and `/api/users/:id/unfollow`
- Following feed filters reviews by followed users

## Common Development Patterns

### Adding a New API Endpoint
1. Create controller function in `backend/src/controllers/`
2. Add route in corresponding file in `backend/src/routes/`
3. Add TypeScript types in `frontend/src/lib/definitions.ts`
4. Create fetch function in `frontend/src/lib/queries.ts`
5. Use TanStack Query hooks in components

### Adding Protected Routes
- Backend: Use `protect` middleware from `authMiddleware.js`
- Frontend: Add route to middleware matcher config or handle in page component

### Working with Mongoose Models
- All models are imported in `backend/src/models/index.js` to ensure registration
- Use `.populate()` for referenced fields (user, item, category)
- Timestamps are automatically managed with `{ timestamps: true }`

## Known Issues & TODOs

From README.md:
- Review query optimization needed: Currently fetching all items is not optimal
