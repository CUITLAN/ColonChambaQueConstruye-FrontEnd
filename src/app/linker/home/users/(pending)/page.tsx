'use client';

import { useEffect, useState, useCallback } from 'react';
import { InboxIn } from '@solar-icons/react';

// Componentes
import TitleSection from '@/components/common/TitleSection';
import EmptyDisplay from '@/components/empty-display/EmptyDisplay';
import NoteRemove from '@/components/common/hugeIcons';
import { DataTableCustomSearchBar } from '@/components/tables/layouts/DateTableCustomSearchBar';
import {
  UserLinkerColumns,
  UserSearchFilters,
} from '@/components/linker/CompanySearchEmploy';
import PaginationControl from '@/components/navigation/paginationControl';

// Datos e Interfaces
import { UserCandidate } from '@/interfaces/usercandidates';
import { useApplicantStore } from '@/app/store/authApplicantStore';
import { apiService } from '@/services/api.service';

interface UserApiResponse {
  statusCode: number;
  message: string;
  data: {
    User: UserCandidate[];
  }[];
}

export const listAcademicLevelOptions = [
  { label: 'Preescolar', value: 'PREESCOLAR' },
  { label: 'Primaria', value: 'PRIMARIA' },
  { label: 'Secundaria', value: 'SECUNDARIA' },
  { label: 'Bachillerato General', value: 'BACHILLERATO_GENERAL' },
  { label: 'Carrera Técnica', value: 'CARRERA_TECNICA' },
  { label: 'Licenciatura', value: 'LICENCIATURA' },
  { label: 'Ingeniería', value: 'INGENIERIA' },
  { label: 'Maestría', value: 'MAESTRIA' },
  { label: 'Doctorado', value: 'DOCTORADO' },
  { label: 'Posdoctorado', value: 'POSDOCTORADO' },
];
//
const UpdatedUserSearchFilters = UserSearchFilters.map((filter) => {
  if (filter.name === 'academicLevel') {
    return {
      ...filter,
      options: listAcademicLevelOptions,
    };
  }
  return filter;
});

const sectionConfig = {
  profile: {
    icon: <InboxIn size={24} weight="Bold" />,
    title: 'SOLICITUDES PENDIENTES DE BUSCADORES DE EMPLEO',
    description: '',
  },
};
//
export default function UsersPage() {
  const { token, id: linkerId } = useApplicantStore();

  // Estados
  const [users, setUsers] = useState<UserCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [academicLevel, setAcademicLevel] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(inputValue);
      if (inputValue !== debouncedSearch) setCurrentPage(1);
    }, 600);
    return () => clearTimeout(timer);
  }, [inputValue, debouncedSearch]);

  // Función de carga de datos
  const fetchUsers = useCallback(async () => {
    if (!token || !linkerId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const offset = (currentPage - 1) * pageSize;
      const query = new URLSearchParams({
        status: 'REVISION',
        limit: pageSize.toString(),
      });

      if (debouncedSearch) query.append('search', debouncedSearch);
      if (academicLevel) query.append('academicLevel', academicLevel);
      if (dateFilter) query.append('date', dateFilter);
      if (offset > 0) query.append('offset', offset.toString());

      const endpoint = `/linkers/${linkerId}/users?${query.toString()}`;
      const response = await apiService.get(endpoint);

      if (response.ok) {
        const result: UserApiResponse = await response.json();
        const cleanData = result.data.flatMap((item) => item.User);
        
        // Lógica de total simple si el API no devuelve totalCount
        const calculatedTotal =
          offset + cleanData.length + (cleanData.length === pageSize ? 1 : 0);

        setUsers(cleanData);
        setTotalItems(calculatedTotal);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    } finally {
      setLoading(false);
    }
  }, [linkerId, currentPage, token, pageSize, debouncedSearch, academicLevel, dateFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Manejadores de eventos
  const handleSearchChange = (term: string) => {
    setInputValue(term);
    if (term === '') {
      setDebouncedSearch('');
      setCurrentPage(1);
    }
  };

  const handleFilterChange = (columnId: string, value: string) => {
    if (columnId === 'academicLevel') setAcademicLevel(value);
    if (columnId === 'dateFilter') setDateFilter(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const hasData = users.length > 0;

  // Renderizado de Loading Inicial
  if (loading && users.length === 0 && !debouncedSearch) {
    return (
      <div className="m-10 mx-32 flex flex-col gap-5">
        <TitleSection sections={sectionConfig} currentSection={'profile'} />
        <div className="flex h-64 items-center justify-center text-zinc-400">
          <div className="border-uaq-brand-500 h-8 w-8 animate-spin rounded-full border-b-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-10 mx-32 flex flex-col gap-5">
      <TitleSection sections={sectionConfig} currentSection={'profile'} />

      <div
        className={`space-y-4 transition-opacity duration-300 ${
          loading ? 'opacity-60' : 'opacity-100'
        }`}
      >
        <DataTableCustomSearchBar
          columns={UserLinkerColumns}
          data={users}
          filters={UpdatedUserSearchFilters}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          hidePagination={true}
        />

        {hasData && (
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
              pageSizeOptions={[5, 10, 20, 50]}
            />
          </div>
        )}
      </div>

      {!loading && !hasData && (
        <div className="mt-10 flex w-full flex-col items-center justify-center text-center">
          <EmptyDisplay
            icon={<NoteRemove color="#D4D4D8" width={158} height={166} />}
            firstLine="No se encontraron usuarios."
            secondline={
              inputValue
                ? 'Intenta ajustar los filtros de búsqueda.'
                : 'No hay usuarios con estatus INACTIVO.'
            }
          />
        </div>
      )}
    </div>
  );
}