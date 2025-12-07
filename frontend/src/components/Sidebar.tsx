'use client';

import { Book, Film, Gamepad2, Home, Tv, Users, LucideIcon } from 'lucide-react';
import React from 'react';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@/lib/definitions';
import { fetchCategories } from '@/lib/queries';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { theme } from '@/lib/theme';

const categoryIcons: { [key: string]: LucideIcon } = {
    game: Gamepad2,
    movie: Film,
    series: Tv,
    book: Book
};

const Sidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const selectedCategories = searchParams.getAll('category');

  const { data: categories, isLoading, isError } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 0,
    initialData: [],
  });

  const s = theme.components.sidebar;

  const isHomeFeedActive = pathname === '/home' && selectedCategories.length === 0;
  const isFollowingActive = pathname === '/following';

  const handleCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentCategories = params.getAll('category');

    if (currentCategories.includes(categorySlug)) {
      const newCategories = currentCategories.filter(slug => slug !== categorySlug);
      params.delete('category');
      newCategories.forEach(slug => params.append('category', slug));
    } else {
      params.append('category', categorySlug);
    }

    const queryString = params.toString();
    router.push(`/home${queryString ? `?${queryString}` : ''}`);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <aside className={`${s.container.base} ${s.container.height} ${s.container.border} ${s.container.background}`} data-view={isFollowingActive ? 'following' : (selectedCategories.length > 0 ? 'home_with_categories' : 'home')}>
      <ScrollArea className={s.scroll.base}>
        <div className={s.content.base}>
          <div className={s.nav.container}>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/home')}
              className={`${s.nav.button.base} ${isHomeFeedActive ? s.nav.button.active : s.nav.button.inactive}`}
            >
              <Home className={`${s.nav.button.icon} ${isHomeFeedActive ? s.nav.button.iconActive : ''}`} />
              <span>Feed</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/following')}
              className={`${s.nav.button.base} ${isFollowingActive ? s.nav.button.active : s.nav.button.inactive}`}
            >
              <Users className={`${s.nav.button.icon} ${isFollowingActive ? s.nav.button.iconActive : ''}`} />
              <span>Siguiendo</span>
            </Button>
          </div>

          <Separator className={s.separator} />

          <div className={s.categories.container}>
            <h2 className={s.categories.header}>
              Categorías
            </h2>
            <nav className={s.categories.nav}>
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              {isError && <p className="px-4 text-red-500">Error al cargar.</p>}
              {!isLoading && !isError && categories?.map((category) => {
                const Icon = categoryIcons[category.slug];
                const categoryColor = s.categoryColors[category.slug as keyof typeof s.categoryColors];

                return (
                  <Button
                    key={category._id}
                    variant="ghost"
                    onClick={() => handleCategoryClick(category.slug)}
                    className={s.categories.button.base}
                  >
                    {Icon && <Icon className={`${s.categories.button.icon} ${categoryColor}`} />}
                    <span className={s.categories.button.label}>{category.name}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;