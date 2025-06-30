import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Redirige la ruta raíz a /home, que es pública
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Rutas de autenticación que un usuario logueado no debería visitar
  const authRoutes = ['/login', '/register'];
  // Rutas públicas que todos pueden visitar
  const publicRoutes = ['/home', ...authRoutes];

  const isAccessingAuthRoute = authRoutes.includes(pathname);
  const isAccessingPublicRoute = publicRoutes.includes(pathname);

  // Lógica para usuarios autenticados
  if (token) {
    // Si un usuario logueado intenta acceder a /login o /register, redirigir a /home
    if (isAccessingAuthRoute) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    // Si está logueado, puede acceder a cualquier otra ruta (pública o protegida)
    return NextResponse.next();
  }

  // Lógica para usuarios no autenticados
  if (!token) {
    // Si intenta acceder a una ruta que NO es pública, redirigir a /login
    if (!isAccessingPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Dejar pasar a cualquier ruta pública
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 