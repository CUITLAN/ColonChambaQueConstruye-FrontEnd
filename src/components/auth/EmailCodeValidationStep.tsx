'use client';

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormOTPValidation } from '../forms/FormOTPValidation';
import { Button } from '@/components/ui/button';

type CodeFormValues = {
  otp: string[];
};

interface EmailCodeValidationStepProps {
  email?: string;
  onVerified?: (code: string) => void;
  onBack?: () => void;
  onResend?: () => Promise<void>;
}

export function EmailCodeValidationStep({
  email,
  onVerified,
  onBack,
  onResend,
}: EmailCodeValidationStepProps) {

  const [timeLeft, setTimeLeft] = React.useState(90);
  const [canResend, setCanResend] = React.useState(false);

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
  // ---------------------------

  const methods = useForm<CodeFormValues>({
    defaultValues: {
      otp: Array(6).fill(''),
    },
  });

  const { control } = methods;
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  const onSubmit = (data: CodeFormValues) => {
    const code = data.otp.join('');
    if (onVerified) onVerified(code);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.tagName !== 'INPUT') return;
    
    // Auto-advance
    if (target.value.length >= 1) {
      const name = target.name;
      const match = name.match(/code(\d)/);
      if (match) {
        const idx = parseInt(match[1], 10);
        if (idx < 5) {
          const nextInput = document.querySelector(`input[name="code${idx + 1}"]`) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
            nextInput.select(); 
          }
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.tagName !== 'INPUT') return;

    if (e.key === 'Backspace' && target.value === '') {
      const name = target.name;
      const match = name.match(/code(\d)/);
      if (match) {
        const idx = parseInt(match[1], 10);
        if (idx > 0) {
          const prevInput = document.querySelector(`input[name="code${idx - 1}"]`) as HTMLInputElement;
          if (prevInput) {
            prevInput.focus();
          }
        }
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="flex flex-col items-center gap-4">
          <img src="/ADMON24-27-1-03.png" alt="Recovery" className="scale-50" />
          <h1 className="text-3xl font-medium">Revisa tu correo</h1>
          <p className="text-center">Hemos enviado un código de verificación a tu correo registrado</p>
          {email && <p className="font-medium text-uaq-brand">{email}</p>}
          <p>Ingresa el código enviado para continuar</p>
        </div>

        <div className="mt-6 flex flex-row justify-center gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <FormOTPValidation
              key={i}
              name={`otp.${i}`}
              control={control}
              index={i}
              total={6}
              inputsRef={refs}
              className="w-12 h-12 text-center text-xl border-1 rounded-xl"
            />
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="flex flex-col text-sm">
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
            <Button type="submit">Continuar</Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}