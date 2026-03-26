'use client'

import HeaderSimple from '@/components/ui/header-simple';
import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  // Recarga de página (segundos)
  const initialSeconds = 7;
  const [secondsLeft, setSecondsLeft] = React.useState<number>(initialSeconds);

  // Empezar la cuenta regresiva
  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Cuando se llega a cero, navegar a login y pasar los segundos restantes como parámetro de consulta
  React.useEffect(() => {
    if (secondsLeft <= 0) {
      router.push(`/login/applicant?timeLeft=${Math.max(0, secondsLeft)}`);
    }
  }, [secondsLeft, router]);

  return (
    <>
      <HeaderSimple />
      <div
        className="flex min-h-screen flex-col items-center justify-center py-1"
        style={{
          backgroundImage: 'url("/backgroundSignUp.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <main className="flex h-fit flex-col items-center justify-center gap-10"></main>

        <div className="h-full w-full max-w-2xl space-y-8 rounded-md border border-gray-300 bg-white px-12 py-6 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <img src="/ADMON24-27-1-03.png" alt="Recuperación de contraseña" className="scale-50" />
            <h1 className="text-2xl font-medium -space-y-28">¡Tu cuenta está lista para usarse!</h1>
            <p> </p>
            <p className="text-center">Serás redirigido al inicio de sesión en un momento</p>
            <img src="/reload.gif" className="h-20 w-20" />
          </div>
        </div>
      </div>
    </>
  );
}
