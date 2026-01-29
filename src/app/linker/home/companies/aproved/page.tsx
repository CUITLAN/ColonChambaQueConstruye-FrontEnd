'use client';

import React, { useEffect, useState } from 'react';
import { Industry } from '@/interfaces/industries';
import UniversalCardsFilter from '@/components/ui/UniversalCardFilter';
import { FileRemove, InboxIn } from '@solar-icons/react';
import TitleSection from '@/components/common/TitleSection';
import { CompanyData } from '@/interfaces'; 
import CompanyLinkerCard from '@/components/linker/CompanyLinkerCard';
import { filtersLinkerCompanies } from '@/components/linker/LinkerTabs';
import PaginationControl from '@/components/navigation/paginationControl';

import { useApplicantStore } from '@/app/store/authApplicantStore';
import { apiService } from '@/services/api.service';
import { toast } from 'sonner';

export default function CompaniesAprovedPage() {
  const { id: linkerId } = useApplicantStore();

  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const sectionConfig = {
    talents: {
      title: 'SOLICITUDES DE EMPRESAS APROBADAS',
      icon: <InboxIn size={24} weight="Bold" className="text-uaq-brand" />,
      description: 'Empresas activas en la plataforma.',
    },
  };

  // 4. Fetch de Datos
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
          status: 'ACTIVA',
          limit: pageSize.toString(),
        });

        if (offset > 0) {
          queryParams.append('offset', offset.toString());
        }

        const endpoint = `/linkers/${linkerId}/companies?${queryParams.toString()}`;
        console.log("Fetching Approved Companies:", endpoint);

        const response = await apiService.get(endpoint);

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

        setTotalItems(backendTotal);
        setCompanies(backendList);

      } catch (error: any) {
        console.error("Error en fetchCompanies:", error);
        toast.error('No se pudieron cargar las empresas aprobadas.');
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [linkerId, currentPage, pageSize]);

  const totalPages = Math.ceil(totalItems / pageSize);

  if (loading) {
    return (
      <div className="mx-32 flex flex-col gap-5 m-10">
        <TitleSection sections={sectionConfig} currentSection={'talents'} />
        <div className="h-64 flex items-center justify-center text-zinc-400">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uaq-brand-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-32 flex flex-col gap-5 m-10">
      <div>
        <TitleSection sections={sectionConfig} currentSection={'talents'} />
      </div>

      <div>
        <UniversalCardsFilter<CompanyData>
          items={companies}
          filters={filtersLinkerCompanies}
          accessors={{
            name: (c) =>
              `${c.Company.tradeName} ${c.Company.legalName} ${c.Company.state} ${c.Company.workSector}`,
            workSector: (c) => c.Company.workSector,
            registeredAt: (c) => c.Company.registeredAt,
          }}
          render={(filtered) => (
            <div className="space-y-4">
              
              {!filtered.length && (
                <div className="flex flex-col items-center justify-center gap-4 m-10 text-gray-300 font-bold">
                  <FileRemove className="w-20 h-20 text-gray-300" />
                  <div className="text-center">
                    <h1>NO SE ENCONTRARON EMPRESAS ACTIVAS</h1>
                    <h2 className="text-sm font-normal mt-2">INTENTA CON OTRAS PALABRAS CLAVE</h2>
                  </div>
                </div>
              )}

              {filtered.map((company) => (
                <CompanyLinkerCard 
                    key={company.Company.id} 
                    company={company} 
                    sideDrawer="right" 
                />
              ))}

              {companies.length > 0 && (
                <div className="border-t pt-4 mt-4">
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
                </div>
              )}
            </div>
          )}
          multiMode='OR'
        />
      </div>
    </div>
  );
}