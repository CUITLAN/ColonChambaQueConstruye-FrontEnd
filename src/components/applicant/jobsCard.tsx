'use client';

import { useState } from 'react';
import { Balloon, Buildings, Calendar, ClockCircle, Dollar, Gps, MapPoint, User, Letter, PhoneCalling, AddCircle } from '@solar-icons/react';
import type { JobCardProps, VacancyDetailResponse } from '@/interfaces';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import CompanyAvatar from '../common/AvatarTrasnform';
import { useApplicantStore } from '@/app/store/authApplicantStore';
import { ApiService } from '@/services/api.service';
import { formatWorkingDays } from '@/lib/utils';

interface jobCardApplicationProps {
  job: JobCardProps
  sideDrawer?: "left" | "right"
}

function daysSince(date: string): number {
  const today = new Date();
  const registeredDate = new Date(date);
  // Se trata de normalizar ambas fechas a medianoche local
  today.setHours(0, 0, 0, 0);
  registeredDate.setHours(0, 0, 0, 0);

  //Se obtiene los dias de diferencia en milisegundos por lo que se regresa convertido a dias truncandolo
  const diffMs = today.getTime() - registeredDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

const apiService = new ApiService();

export default function DrawerApplicantVacant({
  job, sideDrawer
}: jobCardApplicationProps) {
  const { id: userId } = useApplicantStore();
  const [vacancyDetails, setVacancyDetails] = useState<VacancyDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchVacancyDetails = async () => {
    if (!userId || !job.id || vacancyDetails) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.get(`/users/${userId}/vacancies/${job.id}`);

      if (!response.ok) {
        throw new Error('Error al obtener los detalles de la vacante');
      }

      const rawData = await response.json();

      let data: VacancyDetailResponse;
      if (rawData?.data) {
        data = rawData.data;
      } else {
        data = rawData;
      }

      setVacancyDetails(data);
    } catch (err) {
      console.error('Error fetching vacancy details:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (open) {
      fetchVacancyDetails();
    }
  };

  return (
    //Job Card Container
    <div className="hover:border-uaq-brand-800 group flex flex-col w-12/12 rounded-lg border border-zinc-300 shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
      {/* Fila 1 - Logo de la empresa, nombre del trabajo, nobmre de la empresa, jornada y modalidad */}
      <Drawer direction={sideDrawer === "left" ? "left" : "right"} open={isDrawerOpen} onOpenChange={handleDrawerOpenChange}>
        <div className="flex flex-row max-w-full items-center ">
          <div className="w-[100px] flex-shrink-0 rounded-l-lg p-4 transition-colors duration-300">
            <CompanyAvatar
              companyName={job.company}
              logoUrl={job.logoUrl}
              size="md" // O el tamaño que necesites
            />
          </div>

          <div className="flex flex-1 flex-col self-center px-4 py-4 transition-colors duration-300">
            <div className="flex-1 space-y-1 text-start">
              <div className="text-lg font-[800]">{job.title /* Nombre del trabajo */}</div>
              <div className="text-l">{job.company /* Nombre de la empresa */}</div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2 self-center rounded-r-lg p-4 transition-colors duration-300 ">
            <div className="flex items-center gap-2 text-sm text-gray-700 transition-colors duration-200 group-hover:text-gray-900">
              <ClockCircle className="h-4 w-4" weight="Linear" />
              <span className="whitespace-nowrap">{job.schedule /* Horario de trabajo */}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 transition-colors duration-200 group-hover:text-gray-900">
              <Gps className="h-4 w-4" weight="Linear" />
              <span>{job.modality /* Modalidad de empleo (híbrido, remoto, presencial) */}</span>
            </div>
          </div>

        </div>

        {/* Fila 2 - Descripción del trabajo y direccion de la empresa */}
        <div className="flex flex-col px-2">
          <div className="flex items-center gap-2 text-sm text-gray-400 transition-colors duration-200 group-hover:text-gray-500 mx-3">
            <MapPoint className="h-4 w-4" weight="Linear" />
            <span className="whitespace-nowrap">{job.location /* Dirección de la empresa */}</span>
          </div>

          <div className="flex flex-1 flex-col self-center px-4 py-4 transition-colors duration-300">
            <div className="flex-1 space-y-1 text-start">
              <div className="text-start font-[400] text-gray-600">{job.description /* Descripción del trabajo */}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-row px-5 mb-5">
          <div className="flex items-center gap-2 text-l font-[600] text-uaq-terniary transition-colors duration-200 group-hover:text-uaq-brand-hover mx-3">
            <span className="text-start">{job.salaryRange /* Rango salarial */}</span>
          </div>

          <div className="flex flex-1 flex-col self-center px-4 py-4 transition-colors duration-300 items-end">
            <DrawerTrigger className="text-start font-[400] text-uaq-terniary group-hover:text-uaq-terniary-hover hover:text-uaq-brand active:text-uaq-terniary-hover cursor-pointer hover:bg-gray-50 active:bg-gray-100 p-3 rounded-2xl flex items-center gap-2 text-l transition-colors duration-200 mx-3">
              <AddCircle weight='Bold' className="h-4 w-4" />
              Información
            </DrawerTrigger>
          </div>
        </div>

        {/* Drawer Content */}
        <DrawerContent className="overflow-y-auto overflow-x-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-10">
              <p className="text-gray-500">Cargando información...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-10">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : vacancyDetails ? (
            <>
              <DrawerHeader className='px-10 items-start'>
                <DrawerTitle className='text-2xl font-[800]'>
                  {vacancyDetails?.Vacancy?.name}
                </DrawerTitle>
                <div className="flex flex-row items-center w-full">
                  <div className="w-[100px] flex-shrink-0 rounded-l-lg p-4">
                    <CompanyAvatar
                      companyName={vacancyDetails?.Company?.tradeName || ''}
                      logoUrl={job.logoUrl}
                      size="md"
                    />
                  </div>

                  <div className="flex flex-1 flex-col self-center text-start px-4 py-4">
                    <div className="text-xl font-bold">{vacancyDetails?.Company?.tradeName}</div>
                    <div className="text-sm text-gray-600">{vacancyDetails?.Company?.legalName}</div>
                  </div>
                  <div className="flex flex-col self-center px-4 py-4 items-end text-end">
                    <div className="text-base">{"Hace " + daysSince(job.createdAt) + " días"}</div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 rounded-r-lg py-4">
                  <div className="flex items-center gap-2">
                    <MapPoint className="h-4 w-4" weight="Linear" />
                    <h5>Dirección: </h5>
                    <span className="whitespace-nowrap">{vacancyDetails?.Vacancy?.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gps className="h-4 w-4" weight="Linear" />
                    <h5>Modalidad: </h5>
                    <span>{vacancyDetails?.Vacancy?.modality}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockCircle className="h-4 w-4" weight="Linear" />
                    <h5>Jornada: </h5>
                    <span className="whitespace-nowrap">{vacancyDetails?.Vacancy?.workShift}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" weight="Linear" />
                    <h5 className='whitespace-nowrap'>Días Laborables: </h5>
                    <span className="whitespace-nowrap">{formatWorkingDays(vacancyDetails?.Vacancy?.workingDay)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockCircle className="h-4 w-4" weight="Linear" />
                    <h5 className='whitespace-nowrap'>Horario: </h5>
                    <span className="whitespace-nowrap">
                      {vacancyDetails?.Vacancy?.workSchedule?.[0]} - {vacancyDetails?.Vacancy?.workSchedule?.[1]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dollar className="h-4 w-4" weight="Linear" />
                    <h5>Salario: </h5>
                    <span className="whitespace-nowrap">
                      {vacancyDetails?.Vacancy?.salary?.coin} ${vacancyDetails?.Vacancy?.salary?.min?.toLocaleString()} - ${vacancyDetails?.Vacancy?.salary?.max?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" weight="Linear" />
                    <h5>Género: </h5>
                    <span className="whitespace-nowrap">{vacancyDetails?.Vacancy?.gender || 'Indistinto'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Balloon className="h-4 w-4" weight="Linear" />
                    <h5>Edad: </h5>
                    <span className="whitespace-nowrap">
                      {vacancyDetails?.Vacancy?.ageRange?.[0]} - {vacancyDetails?.Vacancy?.ageRange?.[1]} años
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Buildings className="h-4 w-4" weight="Linear" />
                    <h5>Sector: </h5>
                    <span className="whitespace-nowrap">{vacancyDetails?.Vacancy?.businessSector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" weight="Linear" />
                    <h5>Vacantes: </h5>
                    <span className="whitespace-nowrap">{vacancyDetails?.Vacancy?.numberOpenings}</span>
                  </div>
                </div>

                <hr className='w-full' />
                <h2 className='text-xl font-[800] text-uaq-brand'>ACERCA DEL EMPLEO</h2>

                <h3 className='text-lg font-[600]'>Descripción</h3>
                <DrawerDescription className='text-left text-gray-600 text-base'>
                  {vacancyDetails?.Vacancy?.description}
                </DrawerDescription>

                <h3 className='text-lg font-[600]'>Perfil requerido</h3>
                <DrawerDescription className='text-left text-gray-600 text-base'>
                  {vacancyDetails?.Vacancy?.requiredDegree}
                </DrawerDescription>

                <h3 className='text-lg font-[600]'>Beneficios</h3>
                <DrawerDescription className='text-left text-gray-600 text-base'>
                  {vacancyDetails?.Vacancy?.benefits}
                </DrawerDescription>

                <h3 className='text-lg font-[600]'>Experiencia</h3>
                <DrawerDescription className='text-left text-gray-600 text-base'>
                  {vacancyDetails?.Vacancy?.experience}
                </DrawerDescription>

                <h3 className='text-lg font-[600]'>Horario de trabajo</h3>
                <DrawerDescription className='text-left text-gray-600 text-base'>
                  {vacancyDetails?.Vacancy?.workSchedule?.[0]} - {vacancyDetails?.Vacancy?.workSchedule?.[1]}
                </DrawerDescription>

                <h3 className='text-lg font-[600]'>Días de trabajo</h3>
                <DrawerDescription className='text-left text-gray-600 text-base'>
                  {formatWorkingDays(vacancyDetails?.Vacancy?.workingDay)}
                </DrawerDescription>

                {vacancyDetails?.Vacancy?.additionalInformation && (
                  <>
                    <h3 className='text-lg font-[600]'>Información adicional</h3>
                    <DrawerDescription className='text-left text-gray-600 text-base'>
                      {vacancyDetails?.Vacancy?.additionalInformation}
                    </DrawerDescription>
                  </>
                )}
              </DrawerHeader>

              <div className="mx-10 mb-5 rounded-xl border-2 bg-uaq-white px-8 py-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-[600]">Información de contacto</h3>
                    <span className="text-sm text-gray-700">{vacancyDetails?.Company?.tradeName}</span>
                    <span className="text-xs text-gray-500">
                      {vacancyDetails?.CompanyAccount?.firstName} {vacancyDetails?.CompanyAccount?.lastName}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {vacancyDetails?.CompanyAccount?.cellPhone && (
                      <div className="flex items-center gap-3">
                        <PhoneCalling className="h-4 w-4 flex-shrink-0" weight="Linear" />
                        <span className="whitespace-nowrap">{vacancyDetails?.CompanyAccount?.cellPhone}</span>
                      </div>
                    )}

                    {vacancyDetails?.CompanyAccount?.landlinePhone && (
                      <div className="flex items-center gap-3">
                        <PhoneCalling className="h-4 w-4 flex-shrink-0" weight="Linear" />
                        <span className="whitespace-nowrap">{vacancyDetails?.CompanyAccount?.landlinePhone}</span>
                      </div>
                    )}

                    {vacancyDetails?.CompanyAccount?.email && (
                      <div className="flex items-center gap-3">
                        <Letter className="h-4 w-4 flex-shrink-0" weight="Linear" />
                        <span className="max-w-[260px] truncate">
                          {vacancyDetails?.CompanyAccount?.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center p-10">
              <p className="text-gray-500">No hay información disponible</p>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
