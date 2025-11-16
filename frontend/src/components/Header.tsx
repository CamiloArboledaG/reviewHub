'use client';

import { Bell, LogOut, Search } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-card border-b border-border fixed top-0 left-0 right-0 z-10">
      <div className="flex justify-between items-center h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/home">
            <h1 className="text-2xl font-bold text-purple-800">ReviewHub</h1>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-full max-w-md">
            <label htmlFor="search" className="sr-only">
              Buscar
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-input rounded-md leading-5 bg-card placeholder-muted-foreground focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-ring focus:border-ring sm:text-sm"
                placeholder="Buscar reseñas, usuarios, contenido..."
                type="search"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                  <Button variant="ghost" className="p-2 rounded-full hover:bg-accent">
                    <Bell className="h-6 w-6 text-foreground" />
                  </Button>
                  <Button variant="ghost" className="p-2 rounded-full hover:bg-accent">
                    <div className="w-6 h-6 relative">
                      {user?.avatar?.imageUrl ? (
                        <Image
                          src={user.avatar.imageUrl}
                          alt={user?.name || 'avatar'}
                          width={38}
                          height={38}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-full" />
                      )}
                    </div>
                  </Button>
                  <Button variant="ghost" className="p-2 rounded-full hover:bg-accent" onClick={logout}>
                    <LogOut className="h-6 w-6 text-foreground" />
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
      </div>
    </header>
  );
};

export default Header; 