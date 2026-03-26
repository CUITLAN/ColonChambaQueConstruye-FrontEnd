'use client';

import { AdminNavbarMenu } from "@/components/navigation/AdminNavbarMenu";
import React from "react";

export default function LinkerLayout({ children }: { children: React.ReactNode }) {
  const styleVars: React.CSSProperties & {
    '--sb-collapsed': string;
    '--sb-expanded': string;
  } = {
    '--sb-collapsed': '64px', 
    '--sb-expanded': '256px', 
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={styleVars}
    >
      
      <div>
        <div>
          <AdminNavbarMenu NameTitle="Empresas" basePath="companies" />
        </div>

        {/* Contenido principal */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
