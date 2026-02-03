'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import FormInput from '@/components/forms/FormInput';

type RecoveryPasswordFields = {
  password: string;
  confirmPassword: string;
};

export function RecoverySetPasswordStep() {
  const {
    control,
    watch,
    setError,
    clearErrors,
  } = useFormContext<RecoveryPasswordFields>();

  const getPasswordErrors = (pw: string) => {
    const errors: string[] = [];
    if (!pw || pw.length < 8) errors.push('Mínimo 8 caracteres');
    if (!/[A-Z]/.test(pw)) errors.push('Requiere mayúscula');
    if (!/[a-z]/.test(pw)) errors.push('Requiere minúscula');
    if (!/[0-9]/.test(pw)) errors.push('Requiere número');
    return errors;
  };

  React.useEffect(() => {
    const subscription = watch((value) => {
      const pw = value.password ?? '';
      const cpw = value.confirmPassword ?? '';

      const pwErrors = getPasswordErrors(pw);
      if (pwErrors.length > 0) {
        setError('password', {
          type: 'manual',
          message: pwErrors.join('. '),
        });
      } else {
        clearErrors('password');
      }

      if (cpw && pw !== cpw) {
        setError('confirmPassword', {
          type: 'manual',
          message: 'Las contraseñas no coinciden',
        });
      } else {
        const confirmErrors = getPasswordErrors(cpw);
        if (cpw && confirmErrors.length > 0) {
          setError('confirmPassword', {
            type: 'manual',
            message: confirmErrors.join('. '),
          });
        } else {
          if (!cpw || pw === cpw) clearErrors('confirmPassword');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setError, clearErrors]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/ADMON24-27-1-03.png"
          alt="Recuperación de contraseña"
          className="scale-50"
        />
        <h1 className="text-3xl font-medium -space-y-28">
          RESTABLECE TU CONTRASEÑA
        </h1>
        <p className="text-center">
          Elige una nueva contraseña para tu cuenta
        </p>
      </div>

      <div className="space-y-10 mt-8">
        <FormInput
          control={control}
          name="password"
          label="Contraseña"
          type="password"
          maxChars={50}
        />
        <FormInput
          control={control}
          name="confirmPassword"
          label="Confirma tu contraseña"
          type="password"
          maxChars={50}
        />
      </div>

    </div>
  );
}
