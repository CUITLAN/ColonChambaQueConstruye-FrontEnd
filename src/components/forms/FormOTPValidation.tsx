'use client';
import { Input } from '@/components/ui/input';
import { Controller, Control, useFormContext } from 'react-hook-form';
import { useRef } from 'react';

type OtpDigitProps = {
  control: Control<any>;
  name: string;        // ej: `otp.0`, `otp.1`...
  index: number;
  inputsRef: React.MutableRefObject<(HTMLInputElement | null)[]>;
  total: number;
  className?: string;
};

export function FormOTPValidation({ control, name, index, inputsRef, total, className }: OtpDigitProps) {
  const { setValue } = useFormContext();

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <Controller
      control={control}
      name={name as any}
      render={({ field }) => (
        <Input
          {...field}
          ref={(el) => {
            inputsRef.current[index] = el;
            // Ensure react-hook-form ref is also called if field.ref is a function, though field doesn't expose it here since we spread it
            // Actually, Controller gives field.ref. We can set it.
            if (typeof field.ref === 'function') field.ref(el);
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={total}
          value={field.value ?? ''}
          onFocus={handleFocus}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '');
            if (!v) {
              field.onChange('');
              return;
            }

            if (v.length === 1) {
              field.onChange(v);
              if (index < total - 1) {
                inputsRef.current[index + 1]?.focus();
              }
            } else {
              const chars = v.slice(0, total - index).split('');
              const baseName = name.replace(/\.\d+$/, '');
              field.onChange(chars[0]); // update current input

              chars.slice(1).forEach((char, i) => {
                const nextIndex = index + 1 + i;
                if (nextIndex < total) {
                  setValue(`${baseName}.${nextIndex}`, char, { shouldValidate: true, shouldDirty: true });
                }
              });

              const focusIndex = Math.min(index + chars.length, total - 1);
              inputsRef.current[focusIndex]?.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !field.value && index > 0) {
              const baseName = name.replace(/\.\d+$/, '');
              setValue(`${baseName}.${index - 1}`, '', { shouldValidate: true, shouldDirty: true });
              inputsRef.current[index - 1]?.focus();
            } else if (e.key === 'ArrowLeft' && index > 0) {
              inputsRef.current[index - 1]?.focus();
              setTimeout(() => inputsRef.current[index - 1]?.select(), 0);
            } else if (e.key === 'ArrowRight' && index < total - 1) {
              inputsRef.current[index + 1]?.focus();
              setTimeout(() => inputsRef.current[index + 1]?.select(), 0);
            }
          }}
          className={className || 'w-[66px] h-[66px] text-center text-xl border-2 rounded-xl'}
        />
      )}
    />
  );
}
