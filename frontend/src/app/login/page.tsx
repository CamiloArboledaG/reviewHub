'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomInput } from "@/components/ui/custom-input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 'destructive');
      } else {
        showToast('Ocurrió un error inesperado', 'destructive');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tu usuario y contraseña para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Usuario</Label>
              <CustomInput
                id="username"
                type="text"
                variant="md"
                placeholder="tu_usuario"
                required
                value={username}
                onChange={(e) => setUsername((e.target as HTMLInputElement).value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <CustomInput
                id="password"
                type="password"
                variant="md"
                required
                value={password}
                onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ingresar
            </Button>
            <div className="mt-4 text-center text-sm">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="underline">
                Regístrate
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage; 