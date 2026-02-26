'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { InboxIn } from '@solar-icons/react';
import { toast } from 'sonner';

import TitleSection from '@/components/common/TitleSection';
import EmptyDisplay from '@/components/empty-display/EmptyDisplay';
import NoteRemove from '@/components/common/hugeIcons';
import { DataTableCustomSearchBar } from '@/components/tables/layouts/DateTableCustomSearchBar';
import PaginationControl from '@/components/navigation/paginationControl';

import { 
  getUserLinkerColumns, 
  UserSearchFilters 
} from '@/components/linker/CompanySearchEmploy';
import { UserCandidate, listAcademicLevelOptions } from '@/interfaces/usercandidates';
import { useApplicantStore } from '@/app/store/authApplicantStore';
import { apiService } from '@/services/api.service';

interface UserApiResponse {
  statusCode: number;
  message: string;
  data: {
    User: UserCandidate[];
  }[];
}

const sectionConfig = {
  profile: {
    icon: <InboxIn size={24} weight="Bold" />,
    title: 'SOLICITUDES PENDIENTES DE BUSCADORES DE EMPLEO',
    description: 'Gestiona los perfiles de candidatos en proceso de revisión.',
  },
};

export default function UsersPage() {
  const { token, id: linkerId } = useApplicantStore();

  const [users, setUsers] = useState<UserCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [academicLevel, setAcademicLevel] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(inputValue);
      if (inputValue !== debouncedSearch) setCurrentPage(1);
    }, 600);
    return () => clearTimeout(timer);
  }, [inputValue, debouncedSearch]);

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
        offset: offset.toString(),
      });

      if (debouncedSearch) query.append('search', debouncedSearch);
      if (academicLevel) query.append('academicLevel', academicLevel);
      if (dateFilter) query.append('date', dateFilter);

      const response = await apiService.get(`/linkers/${linkerId}/users?${query.toString()}`);

      if (response.ok) {
        const result: UserApiResponse = await response.json();
        const cleanData = result.data.flatMap((item) => item.User);
        
        const calculatedTotal = offset + cleanData.length + (cleanData.length === pageSize ? 1 : 0);

        setUsers(cleanData);
        setTotalItems(calculatedTotal);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  }, [linkerId, currentPage, token, pageSize, debouncedSearch, academicLevel, dateFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updatedFilters = useMemo(() => 
    UserSearchFilters.map((f) => f.value === 'academicLevel' ? { ...f, options: listAcademicLevelOptions } : f), 
  []);

  const columns = useMemo(() => getUserLinkerColumns(fetchUsers), [fetchUsers]);

  const handleSearchChange = (term: string) => {
    setInputValue(term);
    if (!term) {
      setDebouncedSearch('');
      setCurrentPage(1);
    }
  };

  const handleFilterChange = (columnId: string, value: string) => {
    if (columnId === 'academicLevel') setAcademicLevel(value);
    if (columnId === 'registeredAt') setDateFilter(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const hasData = users.length > 0;

  if (loading && users.length === 0 && !debouncedSearch) {
    return (
      <div className="m-10 mx-32 flex flex-col gap-5">
        <TitleSection sections={sectionConfig} currentSection="profile" />
        <div className="flex h-64 items-center justify-center">
          <div className="border-uaq-brand-500 h-8 w-8 animate-spin rounded-full border-b-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-10 mx-32 flex flex-col gap-5">
      <TitleSection sections={sectionConfig} currentSection="profile" />

      <div className={`space-y-4 transition-opacity duration-300 ${loading ? 'opacity-60' : 'opacity-100'}`}>
        <DataTableCustomSearchBar
          columns={columns}
          data={users}
          filters={updatedFilters}
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
            firstLine="No se encontraron solicitudes pendientes."
            secondline={inputValue ? 'Intenta ajustar los filtros de búsqueda.' : 'Las nuevas solicitudes aparecerán aquí.'}
          />
        </div>
      )}
    </div>
  );
}