'use client';

import Link from 'next/link';
import * as React from 'react';
import { useEffect } from 'react';
import { Logout2 } from '@solar-icons/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

import { useApplicantStore } from '@/app/store/authApplicantStore';

interface HeaderLinkerProps {
  linkermail?: string;
}

export default function HeaderLinker({
  linkermail = 'vinculadorx@gmail.com',
}: HeaderLinkerProps) {
  const router = useRouter();
  const { id, token, logout } = useApplicantStore();

  // ✅ 1) Mostrar ID y TOKEN del linker en consola
  useEffect(() => {
    console.log('[LINKER] ID:', id);
    console.log('[LINKER] TOKEN:', token);
  }, [id, token]);

  // ✅ 2) Cerrar sesión real
  const handleLogout = () => {
    console.log('Cerrar sesión (Linker)');
    logout();
    router.push('/auth/login'); // ✅ cambia si tu login está en otra ruta
  };

  return (
    <header className="bg--accent flex items-center justify-between px-10 border-b border-zinc-200 drop-shadow-md">
      <div className="flex items-center gap-4 py-4">
        <Link href="/" className="text-lg font-bold">
          <img src="/UCQC.png" alt="Colon" className="h-10 w-28 scale-100" />
        </Link>
        <Link href="/" className="text-lg font-bold">
          <img
            src="/ADMON24-27-1-03.png"
            alt="Colon"
            className="h-10 w-28 scale-100"
          />
        </Link>
      </div>

      <div className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="mono">{linkermail}</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            {/* ✅ Solo debe existir Cerrar sesión */}
            <DropdownMenuItem onClick={handleLogout} variant="destructive">
              <Logout2 className="h-5 w-5" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
