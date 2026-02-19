'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User, Logout2 } from '@solar-icons/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useApplicantStore } from '@/app/store/authApplicantStore';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import LogoutModal from '@/components/ui/modal/LogoutModal';

/**
 * 🎭 COMPONENTE DE TESTING: AVATAR DINÁMICO CON BACKEND
 * 
 * Este componente demuestra cómo:
 * 1. Obtener datos del usuario desde el backend usando el token del store
 * 2. Generar iniciales dinámicamente
 * 3. Mostrar avatar con fallback de iniciales
 * 4. Manejar logout limpiando el store
 * 
 * Patrón basado en: ApplicantSignUp.tsx
 */

export default function HeaderAvatarTestPage() {
  const [showLogout, setShowLogout] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  
  // ✅ Obtener token y userId del store de Zustand (patrón ApplicantSignUp)
  const { token, id: userId, logoutAplicant: logout, user: storeUser } = useApplicantStore();

  // ✅ Opción 1: Usar usuario del store directamente (si ya está cargado)
  // ✅ Opción 2: Hacer fetch a la API para datos más frescos
  
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);

        // Validar que existan token y userId en el store
        if (!token || !userId) {
          setError('❌ No autenticado. Inicia sesión primero en /login/applicant');
          console.warn('⚠️ Token o userId no disponibles en el store');
          setLoading(false);
          return;
        }

        console.log('📋 Fetch desde Backend:');
        console.log('   Token:', token.substring(0, 30) + '...');
        console.log('   UserID:', userId);

        // ✅ Petición GET a la API (patrón ApplicantSignUp)
        const res = await fetch(`/api/v1/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Manejo de errores
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const errorMsg = errorData.message || `Error ${res.status}: ${res.statusText}`;
          throw new Error(errorMsg);
        }

        // Parsear respuesta
        const data = await res.json();
        console.log('✅ Usuario cargado desde API:', data.data);
        
        setUserData(data.data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
        console.error('❌ Error al cargar usuario:', errorMsg);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }

    // Solo fetch si no hay datos en el store
    if (!storeUser && token && userId) {
      fetchUser();
    } else if (storeUser) {
      // Si el store ya tiene usuario, usarlo directamente
      console.log('✅ Usando usuario desde store:', storeUser);
      setUserData(storeUser);
      setLoading(false);
    }

  }, [token, userId, storeUser]);

  // ✅ Generar iniciales (patrón ApplicantSignUp)
  const initials = userData
    ? `${userData.firstName?.[0] ?? ''}${userData.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  // ✅ Lógica de logout
  const openLogoutModal = () => setShowLogout(true);
  const closeLogoutModal = () => setShowLogout(false);

  const handleLogoutConfirm = () => {
    closeLogoutModal();
    console.log('🚪 Logout confirmado');
    
    // Limpiar store de Zustand
    logout();
    
    // Redirigir a login
    router.push('/login/applicant');
  };

  // ✅ Estado de carga
  if (loading) {
    return (
      <header className="bg-accent !z-50 flex items-center justify-between px-10 border-b border-zinc-200 drop-shadow-md">
        <div className="flex items-center gap-4 py-4">
          <img src="/UCQC.png" alt="Colon" className="h-10 w-28" />
        </div>
        <p className="text-gray-500 text-sm">⏳ Cargando usuario...</p>
      </header>
    );
  }

  // ✅ Estado de error
  if (error) {
    return (
      <header className="bg-accent !z-50 flex items-center justify-between px-10 border-b border-zinc-200 drop-shadow-md">
        <div className="flex items-center gap-4 py-4">
          <img src="/UCQC.png" alt="Colon" className="h-10 w-28" />
        </div>
        <div className="flex items-center gap-3">
          <p className="text-red-500 text-sm">{error}</p>
          <Button 
            variant="outline"
            onClick={() => router.push('/login/applicant')}
            className="text-xs"
          >
            Ir a Login
          </Button>
        </div>
      </header>
    );
  }

  // ✅ Renderizado principal
  return (
    <>
      <header className="bg-accent !z-50 flex items-center justify-between px-10 border-b border-zinc-200 drop-shadow-md">
        
        {/* LOGOS */}
        <div className="flex items-center gap-4 py-4">
          <Link href="/" className="hover:opacity-80 transition">
            <img src="/UCQC.png" alt="Colon" className="h-10 w-28 scale-100" />
          </Link>
          <Link href="/" className="hover:opacity-80 transition">
            <img
              src="/ADMON24-27-1-03.png"
              alt="Colon Admin"
              className="h-10 w-28 scale-100"
            />
          </Link>
        </div>

        {/* MENÚ CON AVATAR DINÁMICO */}
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="mono" 
                className="gap-2 cursor-pointer hover:bg-gray-100 transition"
              >
                {/* 🔥 AVATAR DINÁMICO CON INICIALES */}
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={userData?.photoURL} 
                    alt={`${userData?.firstName} ${userData?.lastName}`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* NOMBRE DEL USUARIO */}
                <span className="font-medium hidden sm:inline">
                  {userData
                    ? `${userData.firstName} ${userData.lastName}`
                    : 'Usuario'
                  }
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {/* Opción: Ver Perfil */}
              <Link href="/user/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  <span>Ver Perfil</span>
                </DropdownMenuItem>
              </Link>

              {/* Opción: Cerrar Sesión */}
              <DropdownMenuItem
                onClick={openLogoutModal}
                className="cursor-pointer text-red-600"
              >
                <Logout2 className="h-4 w-4 mr-2" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* MODAL DE LOGOUT */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <LogoutModal
            onConfirm={handleLogoutConfirm}
            onClose={closeLogoutModal}
          />
        </div>
      )}
    </>
  );
}
