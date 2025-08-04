'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from '@/lib/queries';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { AvatarSelector } from '@/components/AvatarSelector';
import Image from 'next/image';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    avatarUrl: '',
  });
  const router = useRouter();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log('Registro exitoso:', data);
      router.push('/home');
    },
    onError: (error) => {
      showToast(error.message, 'destructive');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAvatarChange = (avatarUrl: string) => {
    setFormData(prev => ({ ...prev, avatarUrl }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.avatarUrl) {
      showToast('Por favor, selecciona un avatar.', 'destructive');
      return;
    }
    mutation.mutate({ 
      name: formData.name, 
      username: formData.username, 
      email: formData.email, 
      password: formData.password, 
      avatarUrl: formData.avatarUrl 
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Ingresa tus datos para registrarte.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="grid gap-4">
            <div className="flex justify-center mb-4">
              <AvatarSelector onAvatarChange={handleAvatarChange} value={formData.avatarUrl} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Tu Nombre" required onChange={handleChange} value={formData.name} disabled={mutation.isPending} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" placeholder="tu_usuario" required onChange={handleChange} value={formData.username} disabled={mutation.isPending} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" required onChange={handleChange} value={formData.email} disabled={mutation.isPending} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" required onChange={handleChange} value={formData.password} disabled={mutation.isPending} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrarse
            </Button>
            <div className="text-center text-sm">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="underline">
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
