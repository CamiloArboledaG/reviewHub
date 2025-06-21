'use client';

import { Book, Film, Gamepad2, Home, Tv, Users, TrendingUp, LucideIcon } from 'lucide-react';
import React from 'react';
import { Skeleton } from './ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@/lib/definitions';
import { fetchCategories } from '@/lib/queries';

const categoryIcons: { [key: string]: LucideIcon } = {
    game: Gamepad2,
    movie: Film,
    series: Tv,
    book: Book
};

const Sidebar = () => {
  const { data: categories, isLoading, isError } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  return (
    <aside className="w-64 flex-shrink-0 px-4 py-8 bg-card border-r border-border fixed top-16 h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-8">
        <div>
          <nav className="flex flex-col gap-2">
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-accent-foreground bg-accent rounded-md">
              <Home className="h-5 w-5" />
              <span>Feed</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md">
              <TrendingUp className="h-5 w-5" />
              <span>Tendencias</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md">
              <Users className="h-5 w-5" />
              <span>Siguiendo</span>
            </a>
          </nav>
        </div>
        <div className="border-t border-border -mx-4"></div>
        <div>
          <h2 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Categorías
          </h2>
          <nav className="flex flex-col gap-2 mt-4">
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            {isError && <p className="px-3 text-red-500">Error al cargar.</p>}
            {!isLoading && !isError && categories?.map((category) => {
              const Icon = categoryIcons[category.slug];
              return (
                <a
                  key={category._id}
                  href="#"
                  className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <span>{category.name}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;