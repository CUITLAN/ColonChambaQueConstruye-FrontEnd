import { JobCardProps } from '@/interfaces/jobCard';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface DrawerLinkerVacanciesProps {
  job: JobCardProps;
  sideDrawer: 'right' | 'left';
  open?: boolean;
}

export default function DrawerLinkerVacancies({
  job,
  sideDrawer,
}: DrawerLinkerVacanciesProps) {

  if (!job) return null;

  const details = job?.companyDetails || {};

  return (
    <div className="hover:border-uaq-brand-800 group flex flex-col rounded-lg border border-zinc-300 shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
      <Drawer direction={sideDrawer === "left" ? "left" : "right"}>
        <DrawerTrigger asChild>
          <Button variant="primary" className="w-full">
            Revisar
          </Button>
        </DrawerTrigger>

        <DrawerContent className="flex h-full w-[500px] overflow-y-auto overflow-x-hidden bg-gray-50 pt-5 outline-none">
          <DrawerHeader className="px-10">
            <div className="flex w-full items-center justify-between">
              
              <div className='flex flex-col text-left space-y-1'>
                <DrawerTitle className="text-xl font-[800] uppercase text-brand-500 leading-tight">
                  {job.title}
                </DrawerTitle>
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {job.company}
                </span>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <Button variant="primary" size="sm" className="w-full">
                  Rechazar
                </Button>
                <Button variant="primary" className="bg-green-600 hover:bg-green-700 w-full" size="sm">
                  Aprobar
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <div className="w-10/12 bg-white mx-auto my-5 shadow-sm border border-gray-200 rounded-lg pb-5">
            
            <div className="px-6 py-4 bg-gray-100 rounded-t-lg border-b">
               <h3 className="font-bold text-gray-700">Detalles de la Vacante</h3>
            </div>

            {/* Descripción */}
            <div className="px-6 py-4 flex flex-col gap-2">
              <h3 className="text-sm font-bold text-gray-900">Descripción</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap text-justify leading-relaxed break-words">
                {job.description || 'Sin descripción'}
              </p>
            </div>
            <Separator className='w-11/12 mx-auto' />

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Sueldo mensual</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {job.salaryRange}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />

             <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Modalidad</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {job.modality}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />
            
            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Jornada</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {job.schedule}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Prestaciones</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {job.BenefitsSection || '-'}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Plazas disponibles</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {job.numberOfPositions}
              </div>
            </div>

             <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Escolaridad</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {job.degree}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />
            
            {/* AGREGADO: Información Adicional que mapeamos antes */}
             <div className="px-6 py-4 flex flex-col gap-2">
              <h3 className="text-sm font-bold text-gray-900">Información Adicional</h3>
              <p className="text-sm text-gray-600 text-justify leading-relaxed break-words">
                {job.AdditionalInformation || 'N/A'}
              </p>
            </div>

            
            <div className="mt-6 px-6 py-4 bg-gray-100 border-y">
               <h3 className="font-bold text-gray-700">Datos de la Empresa</h3>
            </div>

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Razón Social</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {details.legalName || '-'}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">RFC</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {details.rfc || '-'}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />

            <div className="px-6 py-4 flex justify-between items-start">
              <h3 className="text-sm font-bold w-1/3 mt-1">Dirección</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right break-words">
                {details.street || '-'} 
                {details.streetNumber ? ` #${details.streetNumber}` : ''}
                {details.district ? `, Col. ${details.district}` : ''}
                {details.municipality ? `, ${details.municipality}` : ''}
              </div>
            </div>
             <Separator className='w-11/12 mx-auto' />

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Giro</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right lowercase first-letter:uppercase">
                {details.workSector || job.sector || '-'}
              </div>
            </div>

             <Separator className='w-11/12 mx-auto' />

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Correo</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {details.companyEmail || job.email || '-'}
              </div>
            </div>

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Teléfono</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {details.cellPhone || job.cellPhone || '-'}
              </div>
            </div>

          </div>

          <DrawerClose className='text-sm font-bold hover:bg-zinc-200 border-0 text-red-500 px-4 py-3 rounded-md mx-auto mb-7 cursor-pointer transition-colors'>
            Cerrar Ventana
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    </div>
  );
}