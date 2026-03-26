'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import SignUpEmployer from '@/components/employer/SignUpEmployer';
import EmailVerificationCodeCompany from '@/components/ui/email-verification-code-company';
import SignUpEmployerCompanySection from '@/components/employer/SignUpEmployerCompanySection';
import { useCompanyStore } from '@/app/store/authCompanyStore';

import { AlertState, HttpErrorPayload } from '@/interfaces/AlertInterface';
import Alerts from '../ui/Alerts';


const SignUpEmployerAny = SignUpEmployer as React.ComponentType<any>;
const EmailVerificationCodeCompanyAny = EmailVerificationCodeCompany as React.ComponentType<any>;
const SignUpEmployerCompanySectionAny = SignUpEmployerCompanySection as React.ComponentType<any>;

export default function CompanySignup() {
  const [step, setStep] = useState(1);
  const [alert, setAlert] = useState<AlertState>(null);

  const totalSteps = 3;
  const router = useRouter();

  const email = useCompanyStore((s) => s.email);

  const closeAlert = () => setAlert(null);

  const showError = useCallback((title: string, description: string) => {
    setAlert({ type: 'error', title, description });
  }, []);



  const handleHttpError = useCallback(
    (statusCode?: number, currentStep?: number) => {
      const s = Number(statusCode);
      console.log("entre", s)
      if (s === 409 && currentStep === 1) {
        showError('Conflicto', 'Este correo ya está asociado a alguna cuenta existente.');
        return;
      }
      if (s === 400) {
        showError('Error', 'Error de datos, inténtalo nuevamente o más tarde.');
        return;
      }
      showError('Error', 'Ocurrió un error inesperado. Inténtalo nuevamente o más tarde.');
    },
    [showError]
  );

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const handleResendCode = async () => {
    try {
      await fetch(`/api/v1/verifications/company-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      console.log("Correo de verificación reenviado a la empresa");
    } catch (error) {
      console.error("Error al reenviar código:", error);
    }
  };

  return (
    <main className="flex h-fit flex-col items-center justify-center gap-10">
      {/* ALERTA */}
      <div className="w-full max-w-[900px]">
        <Alerts
          type={alert?.type ?? 'error'}
          title={alert?.title ?? ''}
          description={alert?.description ?? ''}
          isVisible={!!alert}
          onClose={closeAlert}
          duration={6000}
        />
      </div>

      {/* CONTENIDO */}
      {step === 1 ? (
        <SignUpEmployerAny
          onSuccess={() => setStep(2)}
          onHttpError={(err: { status?: number }) => handleHttpError(err?.status, 1)}
        />
      ) : (
        <div className="h-full w-full max-w-[900px] space-y-8 rounded-md border border-gray-300 bg-white px-12 py-6 shadow-sm">
          <div className="mb-4 flex items-center gap-4">
            <Button variant="ghost" className="scale-150" type="button" onClick={goBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1 text-sm text-gray-500">
              Paso {step} de {totalSteps}
            </div>
          </div>

          <div className="mb-6 text-center">
            {step === 2 && (
              <>
                <h1 className="text-2xl font-semibold">Verifica el correo de tu empresa</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Ingresa el código que enviamos al correo registrado para continuar con el registro.
                </p>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="text-2xl font-semibold">Completa el registro de la empresa</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Proporciona los datos generales, fiscales y de ubicación de la empresa para finalizar el registro.
                </p>
              </>
            )}
          </div>

          <div className="space-y-6">
            {step === 2 && (
              <EmailVerificationCodeCompanyAny
                onSuccess={() => setStep(3)}
                onHttpError={(err: HttpErrorPayload) => handleHttpError(err?.status, 2)}
                onResend={handleResendCode}
              />
            )}

            {step === 3 && (
              <SignUpEmployerCompanySectionAny
                onSuccess={() => {
                  console.log(
                    'CompanySignup: onSuccess from step3 received, navigating to /login/waiting'
                  );
                  router.push('/login/waiting');
                }}
                onHttpError={(err: { status?: number }) => handleHttpError(err?.status, 3)}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}