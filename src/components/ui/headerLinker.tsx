'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logout2 } from '@solar-icons/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import LogoutModal from './modal/LogoutModal';

interface HeaderLinkerProps {
  logoutRedirectPath?: string;
}

export default function HeaderLinker({
  logoutRedirectPath = '/',
}: HeaderLinkerProps) {
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  const openLogoutModal = () => setShowLogout(true);
  const closeLogoutModal = () => setShowLogout(false);

  const handleLogoutConfirm = () => {
    closeLogoutModal();
    router.push(logoutRedirectPath);
  };

  return (
    <>
      <header className="bg-accent !z-50 flex items-center justify-between px-10 border-b border-zinc-200 drop-shadow-md">
        <div className="flex items-center gap-4 py-4">
          <Link href="/" className="text-lg font-bold">
            <img src="/UCQC.png" alt="Colon" className="h-10 w-28 scale-100" />
          </Link>
          <Link href="/" className="text-lg font-bold">
            <img src="/ADMON24-27-1-03.png" alt="Colon" className="h-10 w-28 scale-100" />
          </Link>
        </div>

        {/* LADO DERECHO: SOLO BOTÓN DE SALIR */}
        <div className="flex items-center justify-center">
            <Button 
              onClick={openLogoutModal} 
              variant="mono" // Rojo para indicar salida, o usa "mono" si prefieres gris
              className="flex items-center gap-2"
            >
              <Logout2 className="h-5 w-5" />
              <span className="ml-2">Cerrar sesión</span>
            </Button>
        </div>
      </header>

      {/* EL MODAL DE CONFIRMACIÓN SE MANTIENE */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <LogoutModal onConfirm={handleLogoutConfirm} onClose={closeLogoutModal} />
        </div>
      )}
    </>
  );
}