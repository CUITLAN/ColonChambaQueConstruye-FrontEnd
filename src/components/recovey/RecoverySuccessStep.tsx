'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useRecoveryStore } from '@/app/store/recoveryPasswordStore';

interface RecoverySuccessStepProps {
  initialSeconds?: number;
}

export function RecoverySuccessStep({ initialSeconds = 7 }: RecoverySuccessStepProps) {
  const router = useRouter();
  const { resetRecoveryData } = useRecoveryStore(); 
  const [secondsLeft, setSecondsLeft] = React.useState<number>(initialSeconds);

  React.useEffect(() => {
    resetRecoveryData();
  }, [resetRecoveryData]);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  React.useEffect(() => {
    if (secondsLeft <= 0) {
      router.push(`/login/applicant`);
    }
  }, [secondsLeft, router]);

  return (
    <div className="h-full w-full max-w-2xl space-y-8 rounded-md border border-gray-300 bg-white px-12 py-6 shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <img src="/ADMON24-27-1-03.png" alt="Éxito" className="scale-50" />
        <h1 className="text-2xl font-medium -space-y-28">¡Tu cuenta está lista!</h1>
        <p className="text-center">Serás redirigido al inicio de sesión en un momento</p>
        <img src="/reload.gif" className="h-20 w-20" alt="Cargando" />
      </div>
    </div>
  );
}