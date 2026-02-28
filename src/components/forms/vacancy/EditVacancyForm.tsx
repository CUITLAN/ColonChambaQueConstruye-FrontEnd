'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerVacancy, VacancyFormType } from '@/validations/registerVacancy';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import JobConditionsSection from './JobConditionsSection';
import InterestAreasSelector from './AdditionalInformation';
import GeneralInfoSection from './GeneralInfoSection';
import BenefitsSection from './BenefitsSection';
import VacancyInfoSection from './VacancyInfoSection';
import RequiredExperience from './RequiredExperience';

import { VacancyU } from '@/interfaces/vacancyUpdate';
import { useCompanyStore } from '@/app/store/authCompanyStore';
import { apiService } from '@/services/api.service';

export default function EditVacancyForm({ idVacancy }: { idVacancy: string }) {
  const { token, companyId } = useCompanyStore();
  const router = useRouter();

  const [vacancy, setVacancy] = useState<VacancyU | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchVacancy = async () => {
      if (!token || !companyId || !idVacancy) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiService.get(
          `/companies/${companyId}/vacancies/${idVacancy}`
        );

        if (!res?.ok) {
          setVacancy(null);
          setIsLoading(false);
          return;
        }

        const json = await res.json();
        const data = json?.data?.vacancy ?? json?.data ?? json;
        setVacancy(data as VacancyU);
      } catch (e) {
        console.error('Error cargando vacante', e);
        setVacancy(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVacancy();
  }, [idVacancy, token, companyId]);

  const methods = useForm<VacancyFormType>({
    resolver: zodResolver(registerVacancy),
    defaultValues: {
      name: '',
      sector: '',
      modality: undefined,
      location: '',
      numberOpenings: '',
      description: '',
      experience: '',
      gender: '',
      ageRange: '',
      minAge: '',
      maxAge: '',
      requiredDegree: undefined,
      salaryRange: '',
      minSalary: '',
      maxSalary: '',
      currency: 'mxn',
      benefits: '',
      workingDays: [],
      workShift: undefined,
      workSchedule: '',
      workHourStart: '',
      workHourEnd: '',
      additionalInformation: '',
    },
  });

  const { control, handleSubmit, reset } = methods;

  useEffect(() => {
    if (!vacancy) return;

    reset({
      name: vacancy.name ?? '',
      sector: vacancy.businessSector ?? '',
      modality: vacancy.modality ?? undefined,
      location: vacancy.location ?? '',
      numberOpenings:
        vacancy.numberOpenings != null ? String(vacancy.numberOpenings) : '',
      description: vacancy.description ?? '',
      experience: vacancy.experience ?? '',
      gender: vacancy.gender ?? '',
      ageRange: '',
      minAge:
        vacancy.ageRange && vacancy.ageRange[0] != null
          ? String(vacancy.ageRange[0])
          : '',
      maxAge:
        vacancy.ageRange && vacancy.ageRange[1] != null
          ? String(vacancy.ageRange[1])
          : '',
      requiredDegree: vacancy.requiredDegree ?? '',
      salaryRange: '',
      minSalary:
        vacancy.salary && vacancy.salary.min != null
          ? String(vacancy.salary.min)
          : '',
      maxSalary:
        vacancy.salary && vacancy.salary.max != null
          ? String(vacancy.salary.max)
          : '',
      currency: vacancy.salary?.coin?.toLowerCase() === 'usd' ? 'usd' : 'mxn',
      benefits: vacancy.benefits ?? '',
      workingDays: vacancy.workingDay ?? [],
      workShift: vacancy.workShift ?? '',
      workSchedule: '',
      workHourStart:
        vacancy.workSchedule && vacancy.workSchedule[0]
          ? vacancy.workSchedule[0]
          : '',
      workHourEnd:
        vacancy.workSchedule && vacancy.workSchedule[1]
          ? vacancy.workSchedule[1]
          : '',
      additionalInformation: vacancy.additionalInformation ?? '',
    });
  }, [vacancy, reset]);

  const onSubmit = async (data: VacancyFormType) => {
    if (!token || !companyId) return;

    setIsSubmitting(true);

    const payload = {
      name: data.name || undefined,
      businessSector: data.sector || undefined,
      modality: data.modality || undefined,
      location: data.location || undefined,
      numberOpenings: data.numberOpenings
        ? Number(data.numberOpenings)
        : undefined,
      description: data.description || undefined,
      experience: data.experience || undefined,
      gender: data.gender || undefined,
      ageRange:
        data.minAge && data.maxAge
          ? [Number(data.minAge), Number(data.maxAge)]
          : undefined,
      requiredDegree: data.requiredDegree || undefined,
      salary:
        data.minSalary || data.maxSalary
          ? {
              min: data.minSalary ? Number(data.minSalary) : null,
              max: data.maxSalary ? Number(data.maxSalary) : null,
              coin: data.currency?.toUpperCase() ?? 'MXN',
            }
          : undefined,
      benefits: data.benefits || undefined,
      workingDay: data.workingDays ?? [],
      workShift: data.workShift || undefined,
      workSchedule:
        data.workHourStart || data.workHourEnd
          ? [data.workHourStart || null, data.workHourEnd || null]
          : [],
      additionalInformation: data.additionalInformation || undefined,
    };

    try {
      const response = await apiService.patch(
        `/companies/${companyId}/vacancies/${idVacancy}`,
        payload
      );

      if (!response?.ok) {
        console.error('Error al actualizar la vacante');
        return;
      }

      router.push('/employer/home/vacancies');
    } catch (error) {
      console.error('Error inesperado:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmSave = handleSubmit(async (data) => {
    setConfirmOpen(false);
    await onSubmit(data);
  });

  if (isLoading) {
    return (
      <div className="py-10 text-center text-zinc-500">
        Cargando información de la vacante...
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="py-10 text-center text-zinc-500">
        No se encontró la vacante.
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()} className="mx-12 pt-12 space-y-4">
        <h2 className="text-4xl font-bold text-center text-[var(--secundary)]">
          Editar vacante
        </h2>

        <GeneralInfoSection control={control} />
        <RequiredExperience control={control} />
        <VacancyInfoSection control={control} />
        <BenefitsSection control={control} />
        <JobConditionsSection control={control} />
        <InterestAreasSelector control={control} />

        <div className="flex justify-end">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setConfirmOpen(true)}
            className="bg-[var(--secundary)] text-white px-6 py-2 rounded-md hover:opacity-90 transition"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold">Confirmar cambios</h3>
              <p className="mt-2 text-sm text-gray-600">
                ¿Estás seguro de los datos de la vacante? Esta pasará a revisión.
              </p>

              <div className="mt-6 flex justify-end gap-6">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setConfirmOpen(false)}
                  className="text-[#E5484D] font-semibold hover:opacity-80 transition"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={confirmSave}
                  className="text-[#22C55E] font-semibold hover:opacity-80 transition"
                >
                  {isSubmitting ? 'Guardando...' : 'Aceptar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  );
}