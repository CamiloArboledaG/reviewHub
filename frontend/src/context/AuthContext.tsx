'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginCredentials, User } from '@/lib/definitions';
import { getProfile, loginUser, logoutUser } from '@/lib/queries';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 1. useEffect para la carga inicial de la sesión.
  // Se ejecuta UNA SOLA VEZ al montar el componente.
  useEffect(() => {
    const checkUser = async () => {
      try {
        const profile = await getProfile();
        // Si profile es null o undefined, limpiar sesión
        if (!profile) {
          setUser(null);
          // Limpiar la cookie inválida
          await logoutUser().catch(() => {});
        } else {
          setUser(profile);
        }
      } catch {
        // Si hay error (401, 403, etc), limpiar sesión
        setUser(null);
        // Limpiar la cookie inválida
        await logoutUser().catch(() => {});
      }
      setLoading(false);
    };
    checkUser();
  }, []); // <-- El array de dependencias vacío es la clave.

  // 2. useEffect para manejar las redirecciones.
  // Se ejecuta cada vez que el usuario o la ruta cambian.
  useEffect(() => {
    // No hacer nada si aún estamos cargando la sesión inicial.
    if (loading) {
      return;
    }

    const isAuthPage = pathname === '/login' || pathname === '/register';

    // Si el usuario está logueado y visita /login o /register, redirigir a /home.
    if (user && isAuthPage) {
      router.push('/home');
    }
  }, [user, pathname, router, loading]);

  const login = async (credentials: LoginCredentials) => {
    // 1. Llama a loginUser para establecer la cookie de sesión.
    await loginUser(credentials);
    // 2. Obtiene el perfil completo y autorizado.
    const fullUserData = await getProfile();
    // 3. Establece el estado con los datos completos.
    setUser(fullUserData);
    router.push('/home');
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 