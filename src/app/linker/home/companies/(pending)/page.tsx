'use client';

import React, { useEffect, useState } from 'react';
import TitleSection from '@/components/common/TitleSection';
import EmptyDisplay from '@/components/empty-display/EmptyDisplay';
import { InboxIn } from '@solar-icons/react';
import NoteRemove from '@/components/common/hugeIcons';

import { DataTableCustomSearchBar } from '@/components/tables/layouts/DateTableCustomSearchBar';
import { companiesLinkerColumns, filtersLinkerCompanies } from '@/components/linker/LinkerTabs';
import PaginationControl from '@/components/navigation/paginationControl';

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
  const { id: linkerId } = useApplicantStore();

  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!linkerId) {
       setLoading(false);
       return;
    }

    const fetchCompanies = async () => {
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

        const endpoint = `/linkers/${linkerId}/companies?${queryParams.toString()}`;
        console.log("Fetching Companies URL:", endpoint);

        const response = await apiService.get(endpoint);

        if (!response.ok) {
           throw new Error(`Error ${response.status}: Fallo al obtener empresas`);
        }

        const result = await response.json();
        console.log("Respuesta Companies:", result); 

        let backendList: CompanyData[] = [];
        let backendTotal = 0;

        if (Array.isArray(result.data)) {
            backendList = result.data;
            
            backendTotal = offset + result.data.length + (result.data.length === pageSize ? 1 : 0); 
        } else if (result.data && Array.isArray(result.data.companies)) {
            backendList = result.data.companies;
            backendTotal = result.data.total || 0;
        }

        setTotalItems(backendTotal);
        setCompanies(backendList);

      } catch (error: any) {
        console.error("Error en fetchCompanies:", error);
        toast.error('No se pudieron cargar las empresas pendientes.');
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [linkerId, currentPage, pageSize]);

  const totalPages = Math.ceil(totalItems / pageSize);
  const hasData = companies.length > 0;

  if (loading) {
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
      <div>
        <TitleSection sections={sectionConfig} currentSection={'profile'} />
      </div>

      {hasData ? (
        <div className="space-y-4">
          <DataTableCustomSearchBar
            columns={companiesLinkerColumns}
            data={companies}
            filters={filtersLinkerCompanies}
            hidePagination={false} 
          />
          
          {/* <div className="border-t pt-4">
             <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages || 1} 
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
          </div> */}
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