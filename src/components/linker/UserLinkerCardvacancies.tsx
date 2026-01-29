import Image from 'next/image';
import { Balloon, Buildings, Calendar, ClockCircle, Dollar, Gps, MapPoint, User, Letter, PhoneCalling, AddCircle, InboxIn } from '@solar-icons/react';
import { JobCardProps } from '@/interfaces';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { workShiftLabelMap } from '@/constants';
import { Separator } from '../ui/separator';
import { DataVacancies } from '../../data/testDataVacancies';
import { stat } from 'fs';

interface jobCardApplicationProps {
  job: JobCardProps;
  sideDrawer?: "left" | "right"
  logoUrl?: string;
  company: string;
}

function getInitials(company: string) {
    return company
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2); 
}

function daysSince(date: string): number {
  const today = new Date();
  const registeredDate = new Date(date);
  today.setHours(0, 0, 0, 0);
  registeredDate.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - registeredDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

 function  handleAcceptVacancy(id: string) {
   console.log(`Vacante con ID ${id} aceptada.`);
 }

 function handleRejectVacancy(id: string) {
   console.log(`Vacante con ID ${id} rechazada.`);
 }

export default function UserLinkerVacanciesCard({
  job, sideDrawer, company, logoUrl
}: jobCardApplicationProps) {

    const initials = getInitials(company);

  return (
    <div className="hover:border-uaq-brand-800 group flex flex-col rounded-lg border border-zinc-300 shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
        <Drawer direction={sideDrawer === "left" ? "left" : "right"}>
          <div className="flex flex-row max-w-full items-center align-middle justify-between p-3">
            <div className="flex-shrink-0 rounded-l-lg pl-4 transition-colors duration-300">
              <Avatar className="h-18 w-18 object-contain">
                <AvatarImage src={logoUrl ?? undefined} alt={company} />
                <AvatarFallback className="bg-uaq-terniary text-white text-2xl font-semibold">
                {initials}
                </AvatarFallback>
              </Avatar>
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
                {workShiftLabelMap[job.schedule] ?? job.schedule}
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

            <div className="flex flex-1 flex-col px-4 py-4 transition-colors duration-300">
              <div className="flex-1 space-y-1 text-start">
                <div className="text-start font-[400] text-gray-600 line-clamp-3 break-all">{job.description /* Descripción del trabajo */}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-row px-5 mb-5 justify-between items-center">
            <div className="flex items-center gap-2 text-l font-[600] text-brand transition-colors duration-200 group-hover:text-brand-hover mx-3">
              <span className="text-start">{job.salaryRange /* Rango salarial */}</span>
            </div>

            <div className="flex flex-1 flex-col self-center px-4 transition-colors duration-300 items-end">
              <DrawerTrigger className="text-start font-[400] text-brand group-hover:hover:text-uaq-brand active:text-uaq-terniary-hover cursor-pointer hover:bg-gray-50 active:bg-gray-100 p-3 rounded-2xl flex items-center gap-2 text-l transition-colors duration-200 mx-3">
                <AddCircle weight='Bold' className="h-4 w-4" />
                Información
              </DrawerTrigger>
            </div>
          </div>
        
          {/* Drawer Content */}
          <DrawerContent className=" flex overflow-y-auto overflow-x-hidden bg-gray-50 pt-5">
              <DrawerHeader className="px-10">
                <div className="flex w-full items-center justify-between">
                  {/* TÍTULO */}
                  <DrawerTitle className="text-2xl font-[800]">
                    VACANTE:{' '}
                    <span className="font-[800] tracking-wide">
                      {job.title.toUpperCase()}
                    </span>
                  </DrawerTitle>

                  <div className={`text-white text-lg font-semibold px-4 py-2 rounded-lg ${
                    (String(job.status ?? '').toUpperCase() === 'RECHAZADA') ? 'bg-uaq-danger' : 'bg-success'
                  }`}>
                    {String(job.status ?? '').toUpperCase() === 'RECHAZADA' ? (
                      <div>
                        RECHAZADA
                      </div>
                    ) :  (
                      <div>
                        APROBADA
                      </div>
                    )}
                  </div>
                </div>

                  
              </DrawerHeader>
              <div className="w-10/12 bg-white justify-center mx-auto my-5 my-5shadow-md border border-gray-200 rounded-lg">

                {/* Número de plazas */}
                <div className="px-10 py-6 flex justify-between">
                  <h3 className="text-base font-medium w-1/3">Número de plazas</h3>
                  <div className="w-2/3">
                    <span>{job.numberOfPositions}</span>
                  </div>
                </div>
                <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

                {/* Descripción */}
                <div className="px-10 py-6 flex justify-between">
                  <h3 className="text-base font-medium w-1/3">Descripción</h3>
                  <div className="w-2/3">
                    <p className="leading-relaxed text-gray-800">
                      {job.description}
                    </p>
                  </div>
                </div>
                <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

                {/* Sueldo mensual */}
                <div className="px-10 py-6 flex justify-between">
                  <h3 className="text-base font-medium w-1/3">Sueldo mensual</h3>
                  <div className="w-2/3">
                    <span>
                      {job.salaryRange}
                    </span>
                  </div>
                </div>
                <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

                {/* Modalidad */}
                <div className="px-10 py-6 flex justify-between">
                  <h3 className="text-base font-medium w-1/3">Prestaciones</h3>
                  <div className="w-2/3">
                    <span>{job.BenefitsSection}</span>
                  </div>
                </div>
                <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

                {/* Modalidad */}
                <div className="px-10 py-6 flex justify-between">
                  <h3 className="text-base font-medium w-1/3">Escolaridad requerida</h3>
                  <div className="w-2/3">
                    <span>{job.degree?.toLowerCase()}</span>
                  </div>
                </div>
                <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

                 {/* Modalidad */}
                <div className="px-10 py-6 flex justify-between">
                  <h3 className="text-base font-medium w-1/3">Horarios</h3>
                  <div className="w-2/3">
                    {workShiftLabelMap[job.schedule] ?? job.schedule}
                  </div>
                </div>
                <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

                <div className="px-10 py-6 flex justify-between">
                  <h3 className="text-base font-medium w-1/3">Género</h3>
                  <div className="w-2/3">
                    <span>{job.gender ?? 'Indistinto'}</span>
                  </div>
                </div>
                <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

                 <div className="px-10 py-6 flex justify-between">
                  <h3 className="text-base font-medium w-1/3">Rango de edad</h3>
                  <div className="w-2/3">
                    <span>{job.ageRange?.min ?? '-'} - {job.ageRange?.max ?? '-'}</span>
                  </div>
                </div>
                <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />
                {/* Modalidad */}
                <div className="px-10 py-6 flex justify-between">
                  <h3 className="text-base font-medium w-1/3">Datos adicionales</h3>
                  <div className="w-2/3">
                    <span>{job.AdditionalInformation}</span>
                  </div>
                </div>
                <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

              </div>            
          </DrawerContent>
      </Drawer>
    </div>
  );
}