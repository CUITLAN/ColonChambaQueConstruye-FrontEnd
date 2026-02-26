'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { InboxIn } from '@solar-icons/react';
import { toast } from 'sonner';

import TitleSection from '@/components/common/TitleSection';
import EmptyDisplay from '@/components/empty-display/EmptyDisplay';
import NoteRemove from '@/components/common/hugeIcons';
import { DataTableCustomSearchBar } from '@/components/tables/layouts/DateTableCustomSearchBar';
import { getVacanciesLinkerColumns, filtersLinkerVacancies } from '@/components/linker/LinkerTabs';

import { useApplicantStore } from '@/app/store/authApplicantStore';
import { apiService } from '@/services/api.service';
import { JobCardProps, BackendVacancyItem, mapBackendVacancyToJobCard } from '@/interfaces';

const SECTION_CONFIG = {
  profile: {
    icon: <InboxIn size={24} weight="Bold" />,
    title: 'SOLICITUDES DE VACANTES PENDIENTES',
    description: 'Gestiona las vacantes que requieren revisión.',
  },
};

export default function TablillaPage() {
  const { id: linkerId, token } = useApplicantStore();
  const [vacancies, setVacancies] = useState<JobCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVacancies = useCallback(async () => {
    if (!linkerId || !token) return;

    setIsLoading(true);
    try {
      const response = await apiService.get(`/linkers/${linkerId}/vacancies?status=REVISION`);
      if (!response.ok) throw new Error(`Error ${response.status}`);

      const { data } = await response.json();
      const items: BackendVacancyItem[] = data?.vacancies || [];

      // Uso del mapper importado: El componente permanece limpio
      setVacancies(items.map(mapBackendVacancyToJobCard));
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error('No se pudieron cargar las solicitudes pendientes.');
    } finally {
      setIsLoading(false);
    }
  }, [linkerId, token]);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  const columns = useMemo(() => getVacanciesLinkerColumns(fetchVacancies), [fetchVacancies]);

  if (isLoading && vacancies.length === 0) {
    return (
      <div className="mx-32 flex flex-col gap-5 m-10">
        <TitleSection sections={SECTION_CONFIG} currentSection="profile" />
        <div className="w-full h-64 flex flex-col items-center justify-center text-zinc-500 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-uaq-brand-500"></div>
          <p className="font-medium">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-32 flex flex-col gap-5 m-10">
      <TitleSection sections={SECTION_CONFIG} currentSection="profile" />

      {vacancies.length > 0 ? (
        <DataTableCustomSearchBar
          columns={columns}
          data={vacancies}
          filters={filtersLinkerVacancies}
        />
      ) : (
        <div className="flex w-full flex-col items-center justify-center text-center mt-10">
          <EmptyDisplay
            icon={<NoteRemove color="#D4D4D8" width={158} height={166} />}
            firstLine="Todavía no tienes solicitudes de vacantes en revisión."
            secondline="Las nuevas vacantes aparecerán listadas en esta sección."
          />
        </div>
      )}
    </div>
  );
}