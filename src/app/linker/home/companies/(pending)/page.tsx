'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { InboxIn } from '@solar-icons/react';
import { toast } from 'sonner';

import TitleSection from '@/components/common/TitleSection';
import EmptyDisplay from '@/components/empty-display/EmptyDisplay';
import NoteRemove from '@/components/common/hugeIcons';
import { DataTableCustomSearchBar } from '@/components/tables/layouts/DateTableCustomSearchBar';
import PaginationControl from '@/components/navigation/paginationControl';

import { 
  getCompaniesLinkerColumns, 
  filtersLinkerCompanies 
} from '@/components/linker/LinkerTabs';
import { useApplicantStore } from '@/app/store/authApplicantStore';
import { apiService } from '@/services/api.service';
import { CompanyData } from '@/interfaces';

const sectionConfig = {
  profile: {
    icon: <InboxIn size={24} weight="Bold" />,
    title: 'SOLICITUDES DE EMPRESAS PENDIENTES',
    description: 'Gestiona las empresas que requieren revisión para ingresar a la plataforma.',
  },
};

export default function PendingCompaniesPage() {
  const { id: linkerId, token } = useApplicantStore();

  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchCompanies = useCallback(async () => {
    if (!linkerId || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const offset = (currentPage - 1) * pageSize;
      const queryParams = new URLSearchParams({
        status: 'REVISION',
        limit: pageSize.toString(),
      });

      if (offset > 0) {
        queryParams.append('offset', offset.toString());
      }

      const response = await apiService.get(`/linkers/${linkerId}/companies?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Fallo al obtener empresas`);
      }

      const result = await response.json();
      
      let backendList: CompanyData[] = [];
      let backendTotal = 0;

      if (Array.isArray(result.data)) {
        backendList = result.data;
        backendTotal = offset + result.data.length + (result.data.length === pageSize ? 1 : 0);
      } else if (result.data && Array.isArray(result.data.companies)) {
        backendList = result.data.companies;
        backendTotal = result.data.total || 0;
      }

      setCompanies(backendList);
      setTotalItems(backendTotal);
    } catch (error: any) {
      console.error("Error en fetchCompanies:", error);
      toast.error('No se pudieron cargar las empresas pendientes.');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [linkerId, token, currentPage, pageSize]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);
  const columns = useMemo(() => getCompaniesLinkerColumns(fetchCompanies), [fetchCompanies]);

  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const hasData = companies.length > 0;

  if (loading && companies.length === 0) {
    return (
      <div className="mx-32 flex flex-col gap-5 m-10">
        <TitleSection sections={sectionConfig} currentSection="profile" />
        <div className="h-64 flex items-center justify-center text-zinc-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-uaq-brand-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-32 flex flex-col gap-5 m-10">
      <TitleSection sections={sectionConfig} currentSection="profile" />

      <div className={`space-y-4 transition-opacity duration-300 ${loading ? 'opacity-60' : 'opacity-100'}`}>
        {hasData ? (
          <>
            <DataTableCustomSearchBar
              columns={columns}
              data={companies}
              filters={filtersLinkerCompanies}
              hidePagination={true} 
            />
            
            <div className="border-t pt-4">
              <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                pageSizeOptions={[10, 20, 30, 40, 50]}
              />
            </div>
          </>
        ) : (
          <div className="flex w-full flex-col items-center justify-center text-center mt-10">
            <EmptyDisplay
              icon={<NoteRemove color="#D4D4D8" width={158} height={166} />}
              firstLine="No hay solicitudes de empresas en revisión."
              secondline="Las nuevas empresas que se registren aparecerán aquí."
            />
          </div>
        )}
      </div>
    </div>
  );
}