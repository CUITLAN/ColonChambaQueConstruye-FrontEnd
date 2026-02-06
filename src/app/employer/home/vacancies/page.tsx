'use client';

import { useEffect, useState, useCallback } from 'react';

import TitleSection from '@/components/common/TitleSection';
import { createVacanciesColumns } from '@/components/tables/schemas/Vacancies';
import { Button } from '@/components/ui/button';
import { CaseRound } from '@solar-icons/react';
import { DataTableCustomSearchBar } from '@/components/tables/layouts/DateTableCustomSearchBar';
import { filtersVacancies } from '@/data/filtersVacancies';
import { useCompanyStore } from '@/app/store/authCompanyStore';
import { apiService } from '@/services/api.service';

const sectionConfig = {
  profile: {
    icon: <CaseRound size={24} weight="Bold" />,
    title: 'MIS VACANTES',
    description: '',
  },
};

export interface VacancyRow {
  id: string;
  name: string;
  description: string;
  location: string;
  modality: string;
  workShift: string;
  company: string;
  logoUrl: string;
  numberOpenings: number;
  salaryRange: string;
  status: string;
  dateFilter: string;
}

const mapCompanyStatus = (raw: any): 'APROBADA' | 'REVISION' | 'RECHAZADA' => {
  if (!raw) return 'APROBADA';
  const s = String(raw).toLowerCase();
  if (s.includes('reject') || s.includes('rechaz')) return 'RECHAZADA';
  if (
    s.includes('review') ||
    s.includes('pending') ||
    s.includes('revision') ||
    s.includes('pendiente')
  ) {
    return 'REVISION';
  }
  return 'APROBADA';
};

const VacanciesContent = ({
  hasData,
  accountStatus,
  vacancies,
  onSearchChange,
  onFilterChange,
  onCloseVacancy,
}: {
  hasData: boolean;
  accountStatus: 'APROBADA' | 'REVISION' | 'RECHAZADA';
  vacancies: VacancyRow[];
  onSearchChange?: (value: string) => void;
  onFilterChange?: (columnId: string, value: any) => void;
  onCloseVacancy?: (vacancyId: string) => void;
}) => {
  const statusComponents: Record<string, React.ReactNode> = {
    APROBADA: hasData ? (
      <div>
        <DataTableCustomSearchBar
          columns={createVacanciesColumns(onCloseVacancy)}
          data={vacancies}
          filters={filtersVacancies}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
        />
      </div>
    ) : (
      <div className="flex w-full flex-col items-center justify-center text-center">
        {/* Recordatorio de limpiar esto, no se quien lo puso pero X */}
      </div>
    ),
  };

  return statusComponents[accountStatus] || null;
};

export default function VacanciesPage() {
  const { token, companyId, status } = useCompanyStore();

  const [vacancies, setVacancies] = useState<VacancyRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //  estado para buscar y filtros backend
  const [search, setSearch] = useState('');
  const [backendFilters, setBackendFilters] = useState<Record<string, any>>({});

  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null);

  const confirmClose = async () => {
    if (!selectedVacancyId) return;

    const ok = await closeVacancy(selectedVacancyId);
    console.log('CONFIRM CLICK', ok);
    if (ok) {
      setCloseModalOpen(false);
      setSelectedVacancyId(null);
    }
  };

  const cancelClose = () => {
    setCloseModalOpen(false);
    setSelectedVacancyId(null);
  };

  const askCloseVacancy = (vacancyId: string) => {
    setSelectedVacancyId(vacancyId);
    setCloseModalOpen(true);
  };

  // handlers que se pasan al DataTableCustomSearchBar
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleFilterChange = (columnId: string, value: any) => {
    setBackendFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  const fetchVacancies = useCallback(async () => {
    if (!token || !companyId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams();

      // ✅ Filtrar solo vacantes ABIERTAS
      params.set('status', 'ABIERTA');

      if (search.trim()) {
        params.set('search', search.trim());
      }

      Object.entries(backendFilters).forEach(([key, value]) => {
        if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) return;

        if (key === 'createdAt' || key === 'dateFilter') {
          const date = value instanceof Date ? value : new Date(value);
          if (isNaN(date.getTime())) return;

          const formatted = date.toISOString().split('T')[0];
          const formattedDateOnly = new Date(formatted);
          formattedDateOnly.setHours(0, 0, 0, 0);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (formattedDateOnly > today) return;

          params.set('dateFilter', formatted);
          return;
        }

        if (Array.isArray(value)) {
          value
            .map((v) => String(v ?? '').trim())
            .filter(Boolean)
            .forEach((v) => params.append(key, v));
          return;
        }

        if (typeof value === 'string') {
          value
            .split(/[|,]/)
            .map((v) => v.trim())
            .filter(Boolean)
            .forEach((v) => params.append(key, v));
          return;
        }

        params.append(key, String(value));
      });

      const url = `/companies/${companyId}/vacancies?${params.toString()}`;
      const response = await apiService.get(url);

      console.log(url,response)
      if (!response?.ok) {
        setVacancies([]);
        return;
      }

      const result = await response.json();
      console.log('Vacancies fetched:', result);

      const rawVacancies = Array.isArray(result?.data?.vacancies)
        ? result.data.vacancies
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
            ? result
            : [];

      const mapped: VacancyRow[] = rawVacancies.map((item: any) => ({
        id: item.id,
        name: item.name ?? item.title ?? '',
        company: item.company?.name ?? item.company ?? 'Empresa',
        location: item.location ?? '',
        description: item.description ?? '',
        workShift: item.workShift ?? item.schedule ?? '',
        modality: item.modality ?? '',
        salaryRange:
          item.salary && typeof item.salary === 'object'
            ? `$${Number(item.salary.min).toLocaleString()} - $${Number(item.salary.max).toLocaleString()} MXN`
            : (item.salaryRange ?? ''),
        logoUrl: item.company?.logoUrl ?? item.logoUrl ?? '/default-company-logo.svg',
        status: item.status,
        numberOpenings: item.numberOpenings ?? 0,
        dateFilter: item.createdAt,
      }));

      setVacancies(mapped);
    } catch {
      setVacancies([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, companyId, search, backendFilters]);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  const closeVacancy = useCallback(
    async (vacancyId: string): Promise<boolean> => {
      if (!companyId || !vacancyId) return false;

      try {
        const response = await apiService.put(`/companies/${companyId}/vacancies/${vacancyId}`, {
          companyStatus: 'CERRADA',
        });

        const result = await response.json();
        console.log('✅ Vacante cerrada exitosamente:', result);

        if (!response.ok) {
          console.log('Error cerrando vacante:', result);
          return false;
        }

        // ✅ Refrescar lista para remover la vacante cerrada
        await fetchVacancies();

        return true;
      } catch (e) {
        console.log('Error cerrando vacante:', e);
        return false;
      }
    },
    [companyId, fetchVacancies],
  );

  const hasData = vacancies.length > 0;
  const mappedStatus = mapCompanyStatus(status);

  return (
    <div className="">
      <div className="mx-32 my-16 flex flex-col gap-5">
        <div>
          <TitleSection sections={sectionConfig} currentSection={'profile'} />
        </div>

        {isLoading ? (
          <div className="py-8 text-center">Cargando vacantes...</div>
        ) : (
          <VacanciesContent
            hasData={hasData}
            accountStatus={mappedStatus}
            vacancies={vacancies}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onCloseVacancy={askCloseVacancy}
          />
        )}
      </div>
      {closeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Cerrar vacante</h3>
            <p className="mt-2 text-sm text-gray-600">
              Esta acción dará de baja la vacante de forma definitiva. ¿Deseas continuar?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={cancelClose}>
                Cancelar
              </Button>
              <Button type="button" onClick={confirmClose}>
                Confirmar cierre
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
