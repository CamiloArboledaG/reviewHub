'use client';

import { Bell, LogOut, Search } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/lib/theme';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { header: h } = theme.components;

  return (
    <header className={`${h.container.base} ${h.container.border} ${h.container.background}`}>
      <div className={h.inner.base}>
        {/* Logo */}
        <div className={h.logo.container}>
          <Link href="/home">
            <span className={h.logo.text}>
              Blurbit
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        {isAuthenticated && (
          <div className={h.search.container}>
            <div className={h.search.wrapper}>
              <Search className={h.search.icon} />
              <Input
                placeholder="Buscar reseñas, usuarios, o títulos..."
                className={h.search.input}
              />
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className={h.actions.container}>
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={h.actions.button}
              >
                <Bell className={h.actions.icon} />
              </Button>

              <Avatar className={`${h.avatar.size} ${h.avatar.ring}`}>
                <AvatarImage
                  src={user?.avatar?.imageUrl || "/placeholder.svg"}
                  alt={user?.name || "Usuario"}
                />
                <AvatarFallback className={h.avatar.fallback}>
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                size="icon"
                className={h.actions.button}
                onClick={logout}
              >
                <LogOut className={h.actions.icon} />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button>Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary">Registrarse</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 