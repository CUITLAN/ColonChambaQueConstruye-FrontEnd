'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApplicantStore } from '@/app/store/uselinkerstore';

export default function LinkerHeaderMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { id, token, logout } = useApplicantStore();

  // ✅ Mostrar ID y token en consola (como pide la tarea)
  useEffect(() => {
    console.log('[LINKER STORE] ID:', id);
    console.log('[LINKER STORE] TOKEN:', token);
  }, [id, token]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push('/auth/login'); // ✅ ajusta a tu ruta real de login si es distinta
  };

  return (
    <div className="relative">
      {/* Botón sin avatar */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border px-3 py-2 text-sm font-medium text-brand hover:bg-gray-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Menú
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 overflow-hidden rounded-md border bg-white shadow-md"
        >
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-50"
            role="menuitem"
          >
            <span aria-hidden="true">🚪</span>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
