'use client';

import { Separator } from '@/components/ui/separator';
import FormInput from '../forms/FormInput';
import { ApplicantFormType } from '@/validations/applicantSchema';
import { Control } from 'react-hook-form';
import { FormBirthDate } from '../forms/FormBirthDate';
import FormPhone from '../forms/FormPhone';
import Link from 'next/link';

interface ApplicantDetailsStepProps {
  control: Control<ApplicantFormType>;
}

export default function PersonalInfoStep({ control }: ApplicantDetailsStepProps) {

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-hover">Información Personal</h3>
      </div>

      <Separator />

      <div className="mb-6 space-y-4">
        <FormInput
          control={control}
          name="name"
          label="Nombre(s)"
          type="text"
          description="Ingresa tu nombre o nombres tal cual como aparecen en tus documentos oficiales."
          className="mt-6"
        />

        <FormInput
          control={control}
          name="lastName"
          label="Apellidos"
          type="text"
          description="Escribe tus apellidos. Asegúrate de que estén completos y sin errores."
        />

        <FormInput
          control={control}
          name="address"
          label="Domicilio"
          description="Escribe tu dirección completa, incluyendo calle, número, colonia y ciudad."
          type="text"
        />

        <FormBirthDate
          name="birthDate"
          label="Fecha de nacimiento"
          description="Selecciona tu fecha de nacimiento."
        />
      </div>

      <h3 className="mb-4 text-xl font-bold text-accent-hover">Cuenta y acceso</h3>
      <Separator />

      <div className="mt-6 space-y-4">
        <FormInput
          control={control}
          name="email"
          label="Correo"
          type="email"
          description="Proporciona un correo personal. Este correo te permitirá entrar a la plataforma."
        />

        <FormPhone
          control={control}
          name="telefono"
          codeName="telefonoCode"
          label="Número de teléfono"
          description="Ingresa tu número de teléfono a 10 dígitos (sin espacios ni guiones)."
        />

        <FormInput
          control={control}
          name="password"
          label="Contraseña"
          type="password"
          description="Tu contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
        />
        

        <FormInput
          control={control}
          name="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          description='Escribe tu contraseña nuevamente.'
        />


      </div>

      <div className="my-6 text-sm font-bold text-gray-600">
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link href={'/login/applicant'} className="text-orange-400 hover:text-orange-300">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
