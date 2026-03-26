'use client';

import React, { useEffect, useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import AdminSideBar from "@/components/sidebar/AdminSideBar";
import HeaderLinker from "@/components/ui/headerLinker";
import { useApplicantStore } from "../../store/authApplicantStore";


export default function LinkerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const token = useApplicantStore((state) => state.token);
  const initialize = useApplicantStore((state) => state.initialize);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initialize();
    setInitialized(true);
  }, [initialize]);

  useEffect(() => {
    if (!initialized) return;

    if (!token) {
      router.replace('/acceso-privado-b4x7');
    }
  }, [initialized, token, router]);

  const styleVars: CSSProperties & {
    '--sb-collapsed': string;
    '--sb-expanded': string;
  } = {
    '--sb-collapsed': '64px',
    '--sb-expanded': '256px',
  };

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        Verificando sesión...
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={styleVars}>
      <AdminSideBar />

      <div
        className="
          flex min-h-screen flex-col
          ml-[var(--sb-collapsed)]
          peer-hover:ml-[var(--sb-expanded)]
          transition-all duration-300 ease-in-out
        "
      >
        <header className="w-full sticky top-0 z-40 !mb-0">
          <HeaderLinker />
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
