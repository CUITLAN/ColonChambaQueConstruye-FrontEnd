'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recoverySchema, RecoveryFormType } from '@/validations/recoverySchema';

import { useRecoveryStore } from '@/app/store/recoveryPasswordStore';

import HeaderSimple from '@/components/ui/header-simple';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/forms/FormInput';
import Alert from '@/components/common/Alert';

import { EmailCodeValidationStep } from '@/components/auth/EmailCodeValidationStep';
import { RecoverySetPasswordStep } from '@/components/recovey/RecoverySetPasswordStep';
import { RecoverySuccessStep } from '@/components/recovey/RecoverySuccessStep';

interface VerifyUserResponse {
  statusCode: number;
  message: string;
  data: {
    success: boolean;
    message: string;
    sent: boolean;
    verificationId?: string;
    token?: string; 
  };
}

export default function RecoveryPage() {
  const [step, setStep] = useState(1);
  
  const { setRecoveryData, email: storedEmail, token: storedToken } = useRecoveryStore();

  const [stepValid, setStepValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeIsLoading, setCodeIsLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    isVisible: boolean;
    type: 'error' | 'warning';
    title: string;
    description: string;
  }>({
    isVisible: false,
    type: 'error',
    title: '',
    description: '',
  });

  const methods = useForm<RecoveryFormType>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
    shouldFocusError: true,
  });

  const { control, trigger, watch, getValues } = methods;

  useEffect(() => {
    const sub = watch((value) => {
      if (step === 1) {
        setStepValid(!!value.email);
      } else if (step === 3) {
        setStepValid(
          !!value.password &&
          !!value.confirmPassword &&
          value.password === value.confirmPassword
        );
      } else {
        setStepValid(true);
      }
    });
    return () => sub.unsubscribe();
  }, [step, watch]);

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isVisible: false }));
  };

  const sendVerificationEmail = async (email: string) => {
    const response = await fetch(`/api/v1/verifications/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    const result: VerifyUserResponse = await response.json();

    const isSuccess = response.ok && (result.statusCode === 200 || result.statusCode === 201) && result.data?.success;
    
    if (!isSuccess) {
      throw new Error('No se encontró el correo');
    }
    return result;
  };

  const handleNextStep = async () => {
    closeAlert(); 

    if (step === 1) {
      const ok = await trigger('email');
      if (!ok) return;

      setIsSubmitting(true);
      try {
        const { email } = getValues();
        await sendVerificationEmail(email);
        
        console.log("Correo enviado exitosamente");
        setStep(2); 
        setStepValid(true);

      } catch (err) {
        console.error(err);
        setAlertConfig({
          isVisible: true,
          type: 'error',
          title: 'Credenciales inválidas',
          description: 'No se ha encontrado un correo asociado',
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (step === 3) {
      const ok = await trigger(['password', 'confirmPassword']);
      if (!ok) return;

      if (!storedToken) {
        setAlertConfig({ isVisible: true, type: 'error', title: 'Error', description: 'Sesión expirada. Inicia de nuevo.' });
        setStep(1);
        return;
      }

      setIsSubmitting(true);
      try {
        const { email, password } = getValues();
        
        const response = await fetch(`/api/v1/password-reset/user`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: email || storedEmail, 
            newPassword: password,
            token: storedToken 
          }),
        });

        const result = await response.json();

        if (response.ok && (result.statusCode === 200 || result.statusCode === 201) && result.data?.updated) {
           setStep(4);
        } else {
           throw new Error('Error al actualizar');
        }

      } catch (err) {
        setAlertConfig({
            isVisible: true,
            type: 'error',
            title: 'Error',
            description: 'No se pudo cambiar la contraseña. Intenta nuevamente.',
          });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
  };

  const handleCodeVerified = async (codeStr: string) => {
    closeAlert();
    setCodeIsLoading(true);

    try {
      const { email } = getValues();
      
      const codeInt = parseInt(codeStr, 10);

      if (isNaN(codeInt)) {
        throw new Error('El código debe ser numérico');
      }

      const response = await fetch(`/api/v1/reset-password-verification/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: email || storedEmail, 
            code: codeInt 
        }),
      });

      const result = await response.json(); 

      if (response.ok && (result.statusCode === 200 || result.statusCode === 201) && result.data?.verified) {
         
         if (result.data.token) {
             setRecoveryData(email || storedEmail || '', result.data.token);
         }
         
         setStep(3); 
      } else {
         throw new Error('Código inválido');
      }

    } catch (err) {
      console.error('Error al validar código:', err);
      setAlertConfig({
        isVisible: true,
        type: 'error',
        title: 'Error de verificación',
        description: 'Código incorrecto.',
      });
    } finally {
      setCodeIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    closeAlert();
    try {
        const { email } = getValues();
        await sendVerificationEmail(email || storedEmail || '');
    } catch (error) {
        console.error("Error reenviando", error);
    }
  };

  const getButtonText = () => {
    if (isSubmitting) {
      if (step === 1) return 'Verificando correo...';
      if (step === 3) return 'Actualizando contraseña...';
    }
    if (step === 1) return 'Enviar código';
    if (step === 3) return 'Cambiar contraseña';
    return 'Continuar';
  };

  return (
    <>
      <HeaderSimple />

      <Alert 
        isVisible={alertConfig.isVisible}
        onClose={closeAlert}
        type={alertConfig.type}
        title={alertConfig.title}
        description={alertConfig.description}
      />

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
            
            <div className="mb-4 flex items-center justify-start gap-4">
              {step === 1 ? (
                <Link href="/">
                  <Button variant="ghost" className="scale-150">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  className="scale-150"
                  type="button"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
            </div>

            <FormProvider {...methods}>
              <div className="space-y-6">
                
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="flex flex-col items-center gap-4">
                      <img src="/ADMON24-27-1-03.png" alt="Recuperación" className="scale-50" />
                      <h1 className="text-3xl font-medium -space-y-28">
                        ¿Olvidaste tu contraseña?
                      </h1>
                      <p className="text-center">
                        Sigue las instrucciones para restablecer tu contraseña.
                      </p>
                    </div>

                    <div className="space-y-10 mt-8">
                      <FormInput
                        name="email"
                        label="Correo electrónico"
                        type="email"
                        placeholder="Ingresa tu correo"
                        control={control}
                        maxChars={244}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <EmailCodeValidationStep
                      email={getValues('email') || storedEmail || ''}
                      onVerified={handleCodeVerified}
                      onBack={() => setStep(1)}
                      onResend={handleResendCode}
                    />
                    {codeIsLoading && (
                      <p className="text-xs text-center text-muted-foreground">Verificando código...</p>
                    )}
                  </div>
                )}

                {step === 3 && <RecoverySetPasswordStep />}

                {step === 4 && <RecoverySuccessStep />}

                {(step === 1 || step === 3) && (
                  <div className="mt-6 flex justify-center">
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!stepValid || isSubmitting}
                    >
                      {getButtonText()}
                    </Button>
                  </div>
                )}
              </div>
            </FormProvider>
          </div>
        </main>
      </div>
    </>
  );
}