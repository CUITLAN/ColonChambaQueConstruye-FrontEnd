'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import TitleSection from '@/components/common/TitleSection';
import EmptyDisplay from '@/components/empty-display/EmptyDisplay';
import { InboxIn } from '@solar-icons/react';
import NoteRemove from '@/components/common/hugeIcons';

import { DataTableCustomSearchBar } from '@/components/tables/layouts/DateTableCustomSearchBar';
import { getCompaniesLinkerColumns, filtersLinkerCompanies } from '@/components/linker/LinkerTabs';
import { useApplicantStore } from '@/app/store/authApplicantStore';
import { apiService } from '@/services/api.service';
import { toast } from 'sonner';
import { CompanyData } from '@/interfaces';

const sectionConfig = {
  profile: {
    icon: <InboxIn size={24} weight="Bold" />,
    title: 'SOLICITUDES DE EMPRESAS PENDIENTES',
    description: 'Gestiona las empresas que requieren revisión.',
  },
};

export default function PendingCompaniesPage() {
  const { id: linkerId, token } = useApplicantStore();

  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = useCallback(async () => {
    if (!linkerId || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const endpoint = `/linkers/${linkerId}/companies?status=REVISION`;
      const response = await apiService.get(endpoint);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Fallo al obtener empresas`);
      }

      const result = await response.json();
      
      // Ajuste según la estructura de tu backend
      let backendList: CompanyData[] = [];
      if (Array.isArray(result.data)) {
        backendList = result.data;
      } else if (result.data && Array.isArray(result.data.companies)) {
        backendList = result.data.companies;
      }

      setCompanies(backendList);
    } catch (error: any) {
      console.error("Error en fetchCompanies:", error);
      toast.error('No se pudieron cargar las empresas pendientes.');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [linkerId, token]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const columns = useMemo(() => getCompaniesLinkerColumns(fetchCompanies), [fetchCompanies]);

  const hasData = companies.length > 0;

  if (loading && companies.length === 0) {
    return (
      <div className="mx-32 flex flex-col gap-5 m-10">
        <TitleSection sections={sectionConfig} currentSection={'profile'} />
        <div className="h-64 flex items-center justify-center text-zinc-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-uaq-brand-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-32 flex flex-col gap-5 m-10">
      <TitleSection sections={sectionConfig} currentSection={'profile'} />

      {hasData ? (
        <div className="space-y-4">
          <DataTableCustomSearchBar
            columns={columns}
            data={companies}
            filters={filtersLinkerCompanies}
            hidePagination={false} 
          />
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center text-center">
          <EmptyDisplay
            icon={<NoteRemove color="#D4D4D8" width={158} height={166} />}
            firstLine="Todavía no tienes solicitudes de empresas en revisión."
            secondline="Las nuevas solicitudes aparecerán aquí."
          />
        </div>
      )}
    </div>
  );
}