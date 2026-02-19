'use client';

import { useState, useEffect } from 'react';
import { useApplicantStore } from '@/app/store/authApplicantStore';
import { JobCardProps } from '@/interfaces';

import Header from '@/components/ui/header';
import TitleSectionIconLeft from '@/components/common/TitleSection IconLeft';
import DrawerApplicantVacant from '@/components/applicant/jobsCard';
import UniversalCardsFilter from '@/components/ui/UniversalCardFilter';
import PaginationControl from '@/components/navigation/paginationControl';
import { CaseRound, MinimalisticMagnifer, FileRemove } from '@solar-icons/react';
import { filtersVacanciesUser } from '@/data/filtersVacancies';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface ApiVacancy {
  Vacancy: {
    id: string;
    name: string;
    location: string;
    description: string;
    salary: { coin: string; min: number; max: number };
    workShift: string;
    modality: string;
    createdAt: string;
    status: string;
    companyStatus: string;
  };
  Company: {
    id: string;
    tradeName: string;
    legalName: string;
    cellPhone: string;
    email: string;
  };
}

interface FilterState {
  modality: string | string[];
  workShift: string | string[];
  sector: string | string[];
  name: string; 
  [key: string]: string | string[];
}

export default function JobsPage() {
  const { token, id: userId } = useApplicantStore();
  const [vacancies, setVacancies] = useState<JobCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false); // Indica si tuvimos que desactivar la paginación

  // 1. ESTADO DE FILTROS
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    modality: '',
    workShift: '',
    sector: '',
    name: ''
  });

  const [pagination, setPagination] = useState({
    page: 1,      
    limit: 10,    
    totalItems: 0, 
  });

  const formatEnum = (text: string) => {
    if (!text) return '';
    return text.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  };

  // 3. ACTUALIZAR FILTROS
  const handleFilterUpdate = (key: string, value: string | string[] | null) => {
    setPagination(prev => ({ ...prev, page: 1 })); 
    setSelectedFilters(prev => ({
        ...prev,
        [key]: value == null ? '' : value 
    }));
  };

  // 4. HANDLERS PARA PAGINACIÓN
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Helper para procesar los datos de la API
  const processResult = (result: any) => {
    const totalCount = result.data?.total ?? result.total ?? 0;
    
    if (result.statusCode === 200 && Array.isArray(result.data?.vacancies)) {
        setPagination(prev => ({ ...prev, totalItems: totalCount }));

        return result.data.vacancies.map((item: ApiVacancy) => ({
          id: item.Vacancy.id,
          title: item.Vacancy.name,
          company: item.Company.tradeName,
          location: item.Vacancy.location,
          description: item.Vacancy.description,
          schedule: formatEnum(item.Vacancy.workShift), 
          modality: formatEnum(item.Vacancy.modality),
          salaryRange: `$${item.Vacancy.salary.min.toLocaleString()} - $${item.Vacancy.salary.max.toLocaleString()} ${item.Vacancy.salary.coin}`,
          logoUrl: '', 
          sector: '', 
          createdAt: item.Vacancy.createdAt,
          cellPhone: item.Company.cellPhone,
          email: item.Company.email,
        }));
    }
    return [];
  };

  // 5. EFECTO DE BÚSQUEDA ROBUSTO
  useEffect(() => {
    const fetchVacancies = async () => {
      if (!token || !userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setApiError(null);
      setIsFallbackMode(false);

      // A. Construimos los parámetros BASE (solo filtros)
      const baseParams = new URLSearchParams();

      const appendFilterParam = (param: string, raw: string | string[]) => {
        if (Array.isArray(raw)) {
          raw
            .map((value) => (typeof value === 'string' ? value : String(value)))
            .map((value) => value.trim())
            .filter((value) => value.length > 0)
            .forEach((value) => baseParams.append(param, value));
          return;
        }

        if (!raw) return;

        String(raw)
          .split(/[|,]/)
          .map((value) => value.trim())
          .filter((value) => value.length > 0)
          .forEach((value) => baseParams.append(param, value));
      };

      appendFilterParam('modality', selectedFilters.modality);
      appendFilterParam('workShift', selectedFilters.workShift);
      appendFilterParam('sector', selectedFilters.sector);
      if (selectedFilters.name) baseParams.append('search', selectedFilters.name);

      const baseUrl = `/api/v1/users/${userId}/vacancies`;

      try {
        // --- INTENTO 1: CON PAGINACIÓN COMPLETA ---
        const fullParams = new URLSearchParams(baseParams);
        const offset = (pagination.page - 1) * pagination.limit;
        
        fullParams.append('limit', String(pagination.limit));
        // Solo enviamos offset si es mayor a 0 para evitar errores de validación de "positive number"
        if (offset > 0) {
            fullParams.append('offset', String(offset));
        }

        console.log(`[API Try 1] ${baseUrl}?${fullParams.toString()}`);

        let response = await fetch(`${baseUrl}?${fullParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Si falla con 400 (Bad Request), asumimos que el backend rechaza nuestros params de paginación
        if (response.status === 400) {
            console.warn('[API Warning] El servidor rechazó la paginación. Intentando modo seguro...');
            
            // --- INTENTO 2: MODO SEGURO (SIN PAGINACIÓN) ---
            // Enviamos solo los filtros, dejando que el backend use sus defaults para limit/offset
            console.log(`[API Try 2] ${baseUrl}?${baseParams.toString()}`);
            
            response = await fetch(`${baseUrl}?${baseParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Si este segundo intento funciona, activamos el modo fallback
            if (response.ok) {
                setIsFallbackMode(true);
            }
        }

        // Manejo de 404 (Lista vacía)
        if (response.status === 404) {
            setVacancies([]);
            setPagination(prev => ({ ...prev, totalItems: 0 }));
            setIsLoading(false); 
            return;
        }

        // Si después de los intentos sigue fallando
        if (!response.ok) {
            let errorMsg = `Status: ${response.status}`;
            try {
                const errorData = await response.json();
                console.error('[API Error JSON]', errorData);
                if (errorData.message) errorMsg = JSON.stringify(errorData.message);
            } catch (e) {
                const txt = await response.text();
                console.error('[API Error Text]', txt);
            }
            throw new Error(errorMsg);
        }

        const result = await response.json();
        const data = processResult(result);
        setVacancies(data);

      } catch (error: any) {
        console.error("Error fetching vacancies:", error);
        setApiError(error.message || "Error desconocido");
        // No borramos vacancies para evitar parpadeo si es un error temporal
      } finally {
        setIsLoading(false);
      }
    };

    fetchVacancies();
  }, [token, userId, selectedFilters, pagination.page, pagination.limit]);

  const sectionConfig = {
    talents: { icon: <CaseRound size={24} weight="Bold" />, title: 'Empleos sugeridos', description: '' },
  };
  const sectionConfig2 = {
    talents: { icon: <MinimalisticMagnifer weight="Bold" size={24} />, title: 'Búsqueda de vacantes', description: '' },
  };

  const totalPages = Math.max(1, Math.ceil(pagination.totalItems / pagination.limit));

  return (
    <>
      <Header companyTitle='' />

      <div className="flex w-full flex-col items-center justify-center gap-3">
        
        <div className="w-full max-w-7xl px-4 md:px-6 pt-5 text-lg text-orange-400">
          <TitleSectionIconLeft currentSection="talents" sections={sectionConfig2} />
        </div>
        
        {/* --- ALERTAS --- */}
        <div className="w-full max-w-7xl px-4 md:px-6 mb-2 space-y-2">
            
            {/* Error Crítico */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 shadow-sm" role="alert">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                <div className="flex flex-col">
                  <strong className="font-bold">No pudimos cargar las vacantes</strong>
                  <span className="block sm:inline text-sm mt-1">{apiError}</span>
                </div>
              </div>
            )}

            {/* Aviso de Modo Seguro (Fallback) */}
            {isFallbackMode && !apiError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>
                   <strong>Aviso:</strong> La paginación personalizada está desactivada temporalmente por restricciones del servidor. Se muestran los resultados por defecto.
                </span>
              </div>
            )}
        </div>
        
        <div className="w-full max-w-7xl px-4 md:px-6 text-purple-800">
          <TitleSectionIconLeft currentSection="talents" sections={sectionConfig} />
        </div>

        <div className='w-full max-w-7xl px-4 md:px-6 mb-10'>
          
          <UniversalCardsFilter<JobCardProps>
            items={vacancies} 
            filters={filtersVacanciesUser}
            onFilterChange={handleFilterUpdate} 
            activeFilters={selectedFilters} 
            accessors={{
              name: (j) => `${j.title} ${j.company}`,
              sector: (j) => j.sector || '',
              modality: (j) => j.modality ? j.modality.toUpperCase() : '',
              workShift: (j) => j.schedule ? j.schedule.toUpperCase().trim().replace(/\s+/g, '_') : '',
              createdAt: (j) => j.createdAt || '',
            }}
            render={(filtered) => (
              <div className="space-y-4 w-full relative min-h-[200px] flex flex-col">
                
                {isLoading && (
                   <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-start pt-10 backdrop-blur-[1px]">
                     <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                     <span className="mt-2 text-zinc-500 font-medium animate-pulse">Cargando resultados...</span>
                   </div>
                )}

                {!isLoading && !filtered.length && !apiError && (
                  <div className="flex flex-col items-center justify-center gap-4 py-10 text-gray-300 font-bold text-center">
                    <FileRemove className="w-20 h-20 text-gray-300" />
                    <div>
                      <h1>NO SE ENCONTRARON RESULTADOS</h1>
                      <h2 className="text-sm font-normal mt-2">Intenta modificar tus filtros</h2>
                    </div>
                  </div>
                )}

                <div className={`${isLoading ? 'opacity-30' : 'opacity-100 transition-opacity duration-300'} space-y-4`}>
                    {filtered.map((job) => (
                        <div key={job.id ? `${job.id}` : `${job.title}-${job.company}`} className="w-full">
                            <DrawerApplicantVacant job={job} />
                        </div>
                    ))}
                </div>

                {/* PAGINACIÓN */}
                {/* Ocultamos los controles si estamos en modo fallback porque no funcionarán */}
                {!isFallbackMode && (pagination.totalItems > 0 || pagination.page > 1) && (
                  <div className="mt-6 border-t pt-4">
                    <PaginationControl
                      currentPage={pagination.page}
                      totalPages={totalPages}
                      pageSize={pagination.limit}
                      totalItems={pagination.totalItems}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
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
    </>
  );
}