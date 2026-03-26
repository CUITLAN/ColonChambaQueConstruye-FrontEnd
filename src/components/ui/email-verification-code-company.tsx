// email-verification-code-company.tsx
'use client';

import React, { useState, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormOTPValidation } from '@/components/forms/FormOTPValidation';
import { Button } from '@/components/ui/button';
import { useCompanyStore } from '@/app/store/authCompanyStore';

interface OtpInputProps {
  length?: number;
  onSuccess?: () => void;
  onResend?: () => Promise<void>;
}

export default function EmailVerificationCodeCompany({
  length = 6,
  onSuccess,
  onResend
}: OtpInputProps) {
  const companyId = useCompanyStore((store) => store.companyId);
  const token = useCompanyStore((store) => store.token);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState(90);
  const [canResend, setCanResend] = useState(false);

  React.useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResendClick = async () => {
    if (!canResend || !onResend) return;
    setCanResend(false);
    setTimeLeft(90);
    await onResend();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const methods = useForm({ defaultValues: { otp: Array(length).fill('') } });
  const { control, watch, handleSubmit } = methods;
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const otpValues = watch('otp');
  const otpCode = (otpValues || []).join('');

  const onSubmit = async () => {
    if (!companyId) {
      setError('No se encontró el ID de la empresa. Intenta registrarte de nuevo.');
      return;
    }

    if (otpCode.length < length) {
      setError('Por favor completa el código de verificación.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const numericCode = Number(otpCode);

      console.log('▶ Validando empresa:', companyId, 'con código:', numericCode);

      const response = await fetch(
        `/api/v1/validation-email/company-account/${companyId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            // lo mandamos como número, pero JSON lo envía bien
            code: numericCode,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        console.log('Error backend:', result);
        const errorMsg = Array.isArray(result?.message)
          ? result.message[0]
          : result?.message;
        setError(errorMsg || 'Código incorrecto o expirado.');
        return;
      }

      console.log('Código validado correctamente:', result);
      onSuccess?.();

    } catch (err) {
      console.error(err);
      setError('Error al validar el código.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto my-8 flex w-full max-w-md flex-col items-center justify-center">
      <div className="mb-6 text-center">
        <h3 className="mb-2 text-xl font-semibold text-brand">
          Revisa tu correo
        </h3>
        <p className="text-sm text-gray-500">
          Hemos enviado un código de verificación al correo de tu empresa.
          Ingrésalo para continuar.
        </p>
      </div>

      {error && (
        <div className="mb-4 w-full rounded-md border border-red-100 bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center"
        >
          <div className="flex w-full justify-center gap-2 sm:gap-3">
            {Array.from({ length }).map((_, i) => (
              <FormOTPValidation
                key={i}
                control={control}
                name={`otp.${i}`}
                index={i}
                total={length}
                inputsRef={refs}
              />
            ))}
          </div>

          <div className="mt-8 flex w-full items-center justify-between">
            <div className="flex flex-col text-left text-sm">
              <p className="text-gray-500">¿No lo recibiste?</p>
              <button
                type="button"
                disabled={!canResend}
                className={`text-left font-medium ${canResend ? 'text-[#FF7F40] hover:underline' : 'cursor-not-allowed text-gray-400'}`}
                onClick={handleResendClick}
              >
                {canResend ? 'Reenviar código' : `Reenviar en ${formatTime(timeLeft)}`}
              </button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                color="brand"
                type="submit"
                className="w-full max-w-xs"
                disabled={isLoading}
              >
                {isLoading ? 'Verificando...' : 'Continuar'}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
