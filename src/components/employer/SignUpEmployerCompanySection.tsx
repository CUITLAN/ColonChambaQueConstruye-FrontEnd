'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CompanyFormType, companySchema } from '@/validations/companySchema';
import CompanyDetails from './CompanyDetails';
import { Button } from '@/components/ui/button';
import { useCompanyStore } from '@/app/store/authCompanyStore';
import { apiService } from '@/services/api.service';

interface SignUpEmployerCompanySectionProps {
  onSuccess?: () => void;
}

export default function SignUpEmployerCompanySection({
  onSuccess,
}: SignUpEmployerCompanySectionProps) {
  const methods = useForm<CompanyFormType>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: '',
      companyEmail: '',
      companySector: '',
      companyDescription: '',
      companyInvestmentCountry: '',
      companyEmlpoyeesNumber: '',
      companyRFC: '',
      companyRazonSocial: '',
      companyAddressCountry: '',
      companyAddressState: '',
      companyAddressMunicipality: '',
      companyAddressColonia: '',
      companyAddressStreet: '',
      companyAddressZip: '',
      companyAddressNo: '',
    },
    mode: 'onSubmit',
  });

  const { control, handleSubmit } = methods;

  // helper to log validation errors when submit fails (debug)
  const onError = (errors: any) => {
    console.log('SignUpEmployerCompanySection: validation errors on submit:', errors);
  };

  const companyId = useCompanyStore((s) => s.companyId);


  const onSubmit = async (data: CompanyFormType) => {
  try {
    if (!companyId) {
      console.log('No companyId en store. Data:', data);
      throw new Error('No se encontró el ID de la empresa. Vuelve a registrarte desde el paso 1.');
    }

    const payload = {
        tradeName: data.companyName,
        legalName: data.companyRazonSocial,
        zipCode: data.companyAddressZip,
        street: data.companyAddressStreet,
        state: data.companyAddressState,
        district: data.companyAddressColonia,
        streetNumber: data.companyAddressNo,
        municipality: data.companyAddressMunicipality,
        country: data.companyAddressCountry,
        investmentCountry: data.companyInvestmentCountry,
        totalWorkers: Number(data.companyEmlpoyeesNumber), 
        rfc: data.companyRFC,
        description: data.companyDescription,
        companyEmail: data.companyEmail,
        workSector: data.companySector,
      };

        if (Number.isNaN(payload.totalWorkers)) {
      throw new Error('El número de empleados no es válido.');
    }

   const response = await apiService.put(`/employers/${companyId}/company`, payload);
    const result = await response.json();


 
      
    if (!response.ok) {
      const errorMsg = Array.isArray(result?.message) ? result.message[0] : result?.message;
      console.log('Error backend:', result);
      throw new Error(errorMsg || 'Company creation failed');
    }
    console.log('Empresa registrada correctamente:', result);

    onSuccess?.();
  } catch (err) {
    console.error('Error registrando empSresa:', err);
  }
};


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <p className="text-center text-sm leading-5 text-gray-600">
          Por favor, completa la información general, fiscal y de ubicación de tu
          empresa para continuar con el registro.
        </p>

        <CompanyDetails control={control} />

        <div className="mt-4 flex justify-center">
          <Button type="submit" className="px-10">
            Registrarse
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
