'use client';

import React, { useEffect, useState } from 'react';
import TitleSection from '@/components/common/TitleSection';
import EmptyDisplay from '@/components/empty-display/EmptyDisplay';
import { InboxIn } from '@solar-icons/react';
import { DataTableCustomSearchBar } from '@/components/tables/layouts/DateTableCustomSearchBar';
import NoteRemove from '@/components/common/hugeIcons';
import { filtersLinkerVacancies, vacanciesLinkerColumns } from '@/components/linker/LinkerTabs';
import { useApplicantStore } from '@/app/store/authApplicantStore';
import { apiService } from '@/services/api.service';
import { toast } from 'sonner';
import { JobCardProps } from '@/interfaces';

const sectionConfig = {
  profile: {
    icon: <InboxIn size={24} weight="Bold" />,
    title: 'SOLICITUDES DE VACANTES PENDIENTES',
    description: 'Gestiona las vacantes que requieren revisión.',
  },
};

export default function TablillaPage() {
  const { id: linkerId, token } = useApplicantStore();
  const [data, setData] = useState<JobCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!linkerId || !token) {
        setLoading(false);
        return;
    }

    const fetchVacancies = async () => {
      setLoading(true);
      try {
        const endpoint = `/linkers/${linkerId}/vacancies?status=REVISION`;
        const response = await apiService.get(endpoint);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Error al obtener vacantes`);
        }

        const result = await response.json();
        const backendData = result.data?.vacancies || [];

        const mappedData: JobCardProps[] = backendData.map((item: any) => {
          const v = item.Vacancy || {};
          const c = item.Company || {};
          
          const minAge = Array.isArray(v.ageRange) ? v.ageRange[0] : 0;
          const maxAge = Array.isArray(v.ageRange) ? v.ageRange[1] : 0;

          return {
            id: v.id,
            status: v.status,
            title: v.name || 'Sin título',
            company: c.tradeName || 'Empresa desconocida',
            location: v.location || 'Ubicación no especificada',
            description: v.description || '',
            
            salaryRange: v.salary 
              ? `$${v.salary.min} - $${v.salary.max} ${v.salary.coin}` 
              : 'No visible',
            
            schedule: v.workShift || 'TIEMPO_COMPLETO',
            modality: v.modality || 'PRESENCIAL',
            logoUrl: c.logoUrl || '',
            createdAt: v.createdAt,
            sector: v.businessSector || c.workSector || 'No especificado',

            numberOfPositions: v.numberOpenings || 1,
            BenefitsSection: v.benefits || '',
            degree: v.requiredDegree || 'No especificada',
            AdditionalInformation: v.additionalInformation || '',
            gender: v.gender || 'Indistinto',
            
            ageRange: {
              min: minAge,
              max: maxAge
            },
            
            RequiredExperience: v.experience || '',
            
            cellPhone: c.CompanyAccount?.cellPhone || 'N/A',
            email: c.CompanyAccount?.email || c.companyEmail || 'N/A',

            companyDetails: {
              legalName: c.legalName,
              rfc: c.rfc,
              street: c.street,
              streetNumber: c.streetNumber,
              district: c.district,
              municipality: c.municipality,
              workSector: c.workSector,
              companyEmail: c.companyEmail
            }
          };
        });

        setData(mappedData);

      } catch (error: any) {
        console.error("Error en fetchVacancies:", error);
        toast.error('No se pudieron cargar las solicitudes.');
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, [linkerId, token]);

  const hasData = data.length > 0;

  if (loading) {
    return (
      <div className="mx-32 flex flex-col gap-5 m-10">
        <TitleSection sections={sectionConfig} currentSection={'profile'} />
        <div className="w-full h-64 flex items-center justify-center text-zinc-500">
          <p>Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-32 flex flex-col gap-5 m-10">
      <TitleSection sections={sectionConfig} currentSection={'profile'} />

      {hasData ? (
        <DataTableCustomSearchBar
          columns={vacanciesLinkerColumns}
          data={data}
          filters={filtersLinkerVacancies}
        />
      ) : (
        <div className="flex w-full flex-col items-center justify-center text-center">
            <EmptyDisplay
                icon={<NoteRemove color="#D4D4D8" width={158} height={166} />}
                firstLine="Todavía no tienes solicitudes de vacantes en revisión."
            />
        </div>
      )}
    </div>
  );
}