'use client';

import * as React from 'react';
import HeaderSimple from '@/components/ui/header-simple';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EmailCodeValidationStep } from '@/components/auth/EmailCodeValidationStep';
import { useSearchParams, useRouter } from 'next/navigation';

export function RecoveryCodePageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') ?? 'Tu correo registrado';

  const handleVerified = (code: string) => {
    // TODO: aquí va la llamada al backend para validar el código
    console.log('Código verificado (recovery):', code);
    // Ejemplo: router.push('/login/reset-password');
  };

  const handleResend = () => {
    // TODO: aquí llamas a tu endpoint de reenviar código
    console.log('Reenviar código (recovery)');
  };

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
        <main className="flex h-fit flex-col items-center justify-center gap-10">
          <div className="h-full w-full max-w-2xl space-y-8 rounded-md border border-gray-300 bg-white px-12 py-6 shadow-sm">
            
            <Button variant="ghost" className="scale-150" asChild>
              <Link href="/login/recovery/applicant">
                <ArrowLeft className="h-50 w-50" />
              </Link>
            </Button>

            <EmailCodeValidationStep
              email={email}
              onVerified={handleVerified}
              onBack={async () => { router.push('/login/recovery/applicant'); }}
              onResend={handleResend}
            />
          </div>
        </main>
      </div>
    </>
  );
}
