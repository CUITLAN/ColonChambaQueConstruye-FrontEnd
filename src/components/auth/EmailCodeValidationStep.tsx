'use client';

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '@/components/forms/FormInput';
import { Button } from '@/components/ui/button';

type CodeFormValues = {
  code0: string;
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
};

const CODE_KEYS: (keyof CodeFormValues)[] = ['code0', 'code1', 'code2', 'code3', 'code4', 'code5'];

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
      code0: '', code1: '', code2: '', code3: '', code4: '', code5: '',
    },
  });

  const { control } = methods;

  const onSubmit = (data: CodeFormValues) => {
    const code = `${data.code0}${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}`;
    if (onVerified) onVerified(code);
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
          {CODE_KEYS.map((name) => (
            <FormInput
              key={name}
              name={name} 
              control={control}
              maxChars={1}
              className="w-12 [&_input]:h-12 [&_input]:text-center [&_input]:text-xl"
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
            {onBack && (
              <Button type="button" variant="primary" onClick={onBack}>
                Volver
              </Button>
            )}
            <Button type="submit">Continuar</Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}