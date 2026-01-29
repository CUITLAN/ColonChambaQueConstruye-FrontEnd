'use client';

import { useRouter } from 'next/navigation';
import FormInput from '@/components/forms/FormInput';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { LoginFormType, loginSchema } from '@/validations/loginSchema';

import Headersimple from '@/components/ui/header-simple';
import { apiService } from '@/services/api.service';
import { useApplicantStore } from '../store/authApplicantStore';


export default function PublicLogin() {
  const methods = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',

  });

  const loginApplicant = useApplicantStore((state) => state.login);
  
    
  const { control, handleSubmit } = methods;

  const router = useRouter();

  const onSubmit = async (data: LoginFormType) => {
    try {
      console.log('Enviando datos de login...', data);

      const response = await apiService.post('/auth/linker/login', {
        email: data.email,
        password: data.password,
      });

      if (!response) {
        console.error('No hubo respuesta del servidor');
        return;
      }

      const json = await response.json();
      console.log('Respuesta de login (SUCCESS):', json);

      const token = json.data.data.token;
      const id = json.data.data.id;
      const email = json.email;
      const status = json.status;

      // Guardar en el store de applicant
      loginApplicant({
        id,
        email,
        status,
        token,
      });

      // Logs chidos pa' revisar
      console.log('ESTE ES EL ID DEL LINKER/APPLICANT:', id);
      console.log('ESTE ES EL TOKEN:', token);

            if (response.status === 200) {
        router.push('/linker/home/companies');
      }

    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  return (
    <>
      <Headersimple />
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
                Inicio de sesión
              </h1>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <div className="space-y-10">
                  <div>
                    <FormInput
                      control={control}
                      name="email"
                      label="Correo"
                      type="email"
                      maxChars={244}
                    />
                    <p className="mt-2 text-xs text-zinc-700">
                      Usuario Administrador.
                    </p>
                  </div>

                  <div>
                    <FormInput
                      control={control}
                      name="password"
                      label="Contraseña"
                      type="password"
                      maxChars={50}
                    />
                    <p className="mt-2 text-xs text-zinc-700">
                      Escribe la contraseña de Admin
                    </p>
                  </div>
                </div>

                

                <div className="flex items-center justify-end">
                  
                  <Button
                    variant="primary"
                    color="brand"
                    type="submit"
                  >
                    Iniciar sesión
                  </Button>
                </div>
              </form>
            </FormProvider>

            <div className="space-y-2 text-center text-sm text-gray-600" />
          </div>
        </main>
      </div>
    </>
  );
}
