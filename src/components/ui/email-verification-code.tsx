'use client';

import React, { useState, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormOTPValidation } from '../forms/FormOTPValidation';
import { Button } from '@/components/ui/button';
import { useApplicantStore } from '@/app/store/authApplicantStore';

interface OtpInputProps {
  length?: number;
  onChange?: (code: string) => void;
  onSuccess?: () => void;
  onResend?: () => Promise<void>;
}

export default function EmailVerificationCode({ length = 6, onChange, onSuccess, onResend }: OtpInputProps) {
  const { id: userId, token } = useApplicantStore(); // Obtenemos credenciales del store
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

    if (!userId) {
      setError("No se encontró el ID del usuario. Por favor intenta registrarte de nuevo.");
      return;
    }

    if (otpCode.length < length) {
      setError("Por favor completa el código de verificación.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(` ${userId}: ${otpCode}`);


      const response = await fetch(`/api/v1/validation-email/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },

        body: JSON.stringify({ code: parseInt(otpCode, 10) }),
      });

      const result = await response.json();

      if (!response.ok) {

        const errorMsg = Array.isArray(result.message) ? result.message[0] : result.message;
        throw new Error(errorMsg || 'Código incorrecto o expirado.');
      }




      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error al validar el código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center w-full mx-auto my-8 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold mb-2 text-brand">Revisa tu correo</h3>
        <p className="text-sm text-gray-500">
          Hemos enviado un código de verificación a tu correo registrado.
          Ingrésalo para continuar.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md w-full text-center border border-red-100">
        </div>
      )}

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center w-full"
        >
          <div className="flex gap-2 sm:gap-3 justify-center w-full">
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

          <div className="mt-8 flex justify-between items-center w-full">
            <div className="flex flex-col text-sm text-left">
              <p className="text-gray-500">¿No lo recibiste?</p>
              <button
                type="button"
                disabled={!canResend}
                className={`font-medium text-left ${canResend ? 'text-[#FF7F40] hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
                onClick={handleResendClick}
              >
                {canResend ? 'Reenviar código' : `Reenviar en ${formatTime(timeLeft)}`}
              </button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                type="submit"
                className='w-full'
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