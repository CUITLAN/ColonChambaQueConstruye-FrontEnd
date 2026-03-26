'use client';

import React, { useState } from 'react'; 
import FormInput from '@/components/forms/FormInput';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { LoginFormType, loginSchema } from '@/validations/loginSchema';
import Headersimple from '@/components/ui/header-simple';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCompanyStore } from '@/app/store/authCompanyStore';
import Alert from '@/components/ui/Alerts';

export default function PublicLogin() {
  const router = useRouter();
  const { login } = useCompanyStore();
  
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const methods = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const { control, handleSubmit } = methods;

  const onSubmit = async (data: LoginFormType) => {
    setShowErrorAlert(false);

    try {
      const normalizedEmail = data.email.trim().toLowerCase();

      const response = await authService.loginAccount(
        normalizedEmail,
        data.password,
        'company'
      );

      const accountData = response.data;

      if (!accountData || !accountData.Company) {
        throw new Error('La respuesta del servidor está incompleta.');
      }

      const token = accountData.token;
      const accountId = accountData.id;
      const accountStatus = String(accountData.status).toUpperCase();
      
      const companyId = accountData.Company.id;
      const companyStatus = String(accountData.Company.status).toUpperCase();

      console.log('ACCOUNT ID:', accountId, '| STATUS:', accountStatus);
      console.log('COMPANY ID:', companyId, '| STATUS:', companyStatus);

      if (!token || !companyId) {
        throw new Error('Error: Faltan el token o el ID de la empresa en la respuesta del servidor.');
      }

      if (companyStatus === 'RECHAZADA' || 
          accountStatus === 'RECHAZADA' ) {
        
        login({
          token: token,
          companyId: companyId,
          email: normalizedEmail, 
          status: companyStatus === 'RECHAZADA'  ? companyStatus : accountStatus,
        });

        toast.error('Tu empresa fue rechazada. Por favor revisa y actualiza tu información.');
        router.push('/employer/profileconfig');
        return;
      }

      const isAccountActive = accountStatus === 'ACTIVA' || accountStatus === 'ACTIVO';
      const isCompanyActive = companyStatus === 'ACTIVA' || companyStatus === 'ACTIVO';

      if (isAccountActive && isCompanyActive) {
        login({
          token: token,
          companyId: companyId,
          email: normalizedEmail, 
          status: accountStatus,
        });

        toast.success('Inicio de sesión exitoso');
        router.push('/employer/home/vacancies');
        return;
      }

      console.warn('Cuenta en revisión o inactiva. No se guardó la sesión completa.');
      
      if (companyStatus === 'REVISION' || accountStatus === 'REVISION' ||
          companyStatus === 'PENDIENTE' || accountStatus === 'PENDIENTE') {
        toast.info('Tu cuenta está en revisión. Te notificaremos cuando sea aprobada.');
      } else {
        toast.warning('Tu cuenta no se encuentra activa en este momento.');
      }

      router.push('/login/waiting');
      
    } catch (error: any) {
      console.error('Error en login:', error?.message);
      
      const errorMsg = error?.message || "";

      if (
        errorMsg.includes("User doesn't exist") || 
        errorMsg.includes("Not Found") ||
        errorMsg.includes("404") ||
        errorMsg.includes("401") ||
        errorMsg.includes("Bad credentials")
      ) {
        setShowErrorAlert(true);
      } else {
        toast.error(errorMsg || 'Error al iniciar sesión');
      }
    }
  };

  return (
    <>
      <Headersimple />
      
      <Alert 
        isVisible={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        type="error"
        title="Credenciales inválidas"
        description="El correo o la contraseña son incorrectos."
      />

      <div
        className="flex min-h-screen flex-col items-center justify-center py-15"
        style={{
          backgroundImage: 'url("/backgroundSignUp.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <main className="flex h-fit flex-col items-center justify-center gap-10">
          <div className="h-full max-w-2xl space-y-8 rounded-md border border-gray-300 bg-white p-12 gap-8 w-[696px] shadow-sm">
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-xl font-normal leading-none tracking-normal text-center text-[#FF7F40]">
                Ingresar como reclutador de talentos
              </h1>
            </div>

            <FormProvider {...methods}>
              <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="mt-8 space-y-4"
                onChange={() => {
                   if(showErrorAlert) setShowErrorAlert(false);
                }}
              >
                <div className="space-y-10">
                  <div>
                    <FormInput
                      control={control}
                      name="email"
                      label="Correo "
                      type="email"
                      maxChars={244}
                    />
                  </div>

                  <div>
                    <FormInput
                      control={control}
                      name="password"
                      label="Contraseña "
                      type="password"
                      maxChars={50}
                    />
                  </div>
                </div>

                <div>
                  <Link
                    href={'recovery'}
                    className="block text-right font-medium no-underline hover:no-underline focus:no-underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1 text-sm font-bold">
                    ¿No tienes cuenta?
                    <Link href="/signup/employer" className="font-bold no-underline text-[#FF7F40]">
                      Regístrate
                    </Link>
                  </p>

                  <Button variant="primary" color="brand" type="submit">
                    Iniciar sesión
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </main>
      </div>
    </>
  );
}