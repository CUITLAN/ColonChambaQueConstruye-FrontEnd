'use client';

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
 * 🎭 COMPONENTE REUTILIZABLE: AVATAR CON DROPDOWN
 * 
 * Uso:
 * <UserAvatarMenu onLogout={() => router.push('/login')} />
 * 
 * Característica:
 * - Obtiene datos del usuario desde el store de Zustand
 * - Muestra iniciales dinámicamente
 * - Dropdown con opciones de perfil y logout
 * - Callback personalizable para logout
 */

interface UserAvatarMenuProps {
  onLogout?: () => void;
  showProfileLink?: boolean;
}

export default function UserAvatarMenu({ 
  onLogout, 
  showProfileLink = true 
}: UserAvatarMenuProps) {
  const [showLogout, setShowLogout] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { token, id: userId, logoutAplicant: logout, user: storeUser } = useApplicantStore();

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);

        if (!token || !userId) {
          setError('No autenticado');
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/v1/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }

        const data = await res.json();
        setUserData(data.data);
      } catch (err) {
        console.error('Error cargando usuario:', err);
        setError('Error cargando datos');
      } finally {
        setLoading(false);
      }
    }

    if (!storeUser && token && userId) {
      fetchUser();
    } else if (storeUser) {
      setUserData(storeUser);
      setLoading(false);
    }

  }, [token, userId, storeUser]);

  const initials = userData
    ? `${userData.firstName?.[0] ?? ''}${userData.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  const handleLogout = () => {
    setShowLogout(false);
    logout();
    if (onLogout) {
      onLogout();
    } else {
      router.push('/login/applicant');
    }
  };

  // Estado de error o sin autenticación
  if (error && !userData) {
    return null; // No mostrar nada si hay error
  }

  // Estado de carga
  if (loading) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  // Renderizado principal
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="mono" 
            className="gap-2 cursor-pointer"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={userData?.photoURL} 
                alt={`${userData?.firstName} ${userData?.lastName}`}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

            <span className="font-medium hidden sm:inline">
              {userData?.firstName || 'Usuario'}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {showProfileLink && (
            <>
              <DropdownMenuItem asChild>
                <a href="/user/profile" className="cursor-pointer flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Ver Perfil</span>
                </a>
              </DropdownMenuItem>
              <div className="my-1" />
            </>
          )}

          <DropdownMenuItem
            onClick={() => setShowLogout(true)}
            className="cursor-pointer text-red-600"
          >
            <Logout2 className="h-4 w-4 mr-2" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <LogoutModal
            onConfirm={handleLogout}
            onClose={() => setShowLogout(false)}
          />
        </div>
      )}
    </>
  );
}
