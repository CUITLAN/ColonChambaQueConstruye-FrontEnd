import { JobCardProps } from '@/interfaces';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '../ui/button';
import { workShiftLabelMap } from '@/constants';
import { Separator } from '../ui/separator';
import AllowVacancyModal from '../ui/modal/AllowVacancy';
import RejectVacancyModal from '../ui/modal/RejectVacancyModal';
import { useState, useRef, useEffect } from 'react';
import { useApplicantStore } from '@/app/store/authApplicantStore';
import { apiService } from '@/services/api.service';
import { toast } from 'sonner';
import { createPortal } from 'react-dom'; 

interface DrawerLinkerVacanciesProps {
  job: JobCardProps;
  sideDrawer: 'right' | 'left';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void; 
}

export default function DrawerLinkerVacancies({
  job,
  sideDrawer,
  open,
  onOpenChange,
  onSuccess
}: DrawerLinkerVacanciesProps) {
  
  const { id: linkerId } = useApplicantStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!job) {
    return (
      <div className="p-4 border rounded bg-yellow-50 text-sm text-uaq-danger">
        Error: No se recibió información de la vacante.
      </div>
    );
  }

  const isControlled = typeof open === 'boolean' && typeof onOpenChange === 'function';
  const [internalOpen, setInternalOpen] = useState<boolean>(open ?? false);

  useEffect(() => {
    if (!isControlled && typeof open === 'boolean') {
      setInternalOpen(open);
    }
  }, [open]);

  const getOpen = () => (isControlled ? open! : internalOpen);
  const setOpen = (v: boolean) => {
    if (isControlled) {
      onOpenChange!(v);
    } else {
      setInternalOpen(v);
    }
  };

  const [showAllowVacancy, setShowAllowVacancy] = useState(false);
  const [showRejectVacancy, setShowRejectVacancy] = useState(false);


  const closeAllow = () => setShowAllowVacancy(false);
  const closeReject = () => setShowRejectVacancy(false);

  const handleReviewVacancy = async (validation: boolean, comment?: string) => {
    if (!linkerId) {
      toast.error('Error de sesión: No se encontró el ID del Linker.');
      return;
    }

    try {
      const endpoint = `/linkers/${linkerId}/vacancies/${job.id}`;
      
      const body = {
        validation,
        ...(comment && { comment }) 
      };

      const response = await apiService.patch(endpoint, body);

      if (!response.ok) {
        throw new Error('Error al procesar la solicitud');
      }

      toast.success(validation ? 'Vacante aprobada correctamente.' : 'Vacante rechazada correctamente.');
      
      setShowAllowVacancy(false);
      setShowRejectVacancy(false);

      setOpen(false);

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al actualizar la vacante.');
    }
  };

  const handleAllowConfirm = () => {
    handleReviewVacancy(true); 
  };

  const handleRejectConfirm = (data: { reason: string }) => {
    handleReviewVacancy(false, data.reason); 
  };

  const displayAgeRange = () => {
    if (!job.ageRange || (job.ageRange.min === 0 && job.ageRange.max === 0)) {
        return 'No especificado';
    }
    return `${job.ageRange.min} - ${job.ageRange.max} años`;
  };

  return (
    <div className="hover:border-uaq-brand-800 group flex flex-col rounded-lg border border-zinc-300 shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
      <Drawer direction={sideDrawer === "left" ? "left" : "right"} open={getOpen()} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="primary" color='accent' onClick={() => setOpen(true)}>
            Revisar
          </Button>
        </DrawerTrigger>

        <DrawerContent className="flex overflow-y-auto overflow-x-hidden bg-gray-50 pt-5">
          <DrawerHeader className="px-10">
            <div className="flex w-full items-center justify-between">
              <DrawerTitle className="text-2xl font-[800]">
                VACANTE:{' '}
                <span className="font-[800] tracking-wide">{job.title?.toUpperCase()}</span>
              </DrawerTitle>

              <div className="flex flex-row gap-4">
                <Button variant="primary" color="danger" className="px-6" onClick={() => setShowRejectVacancy(true)}>
                  Rechazar
                </Button>
                <Button variant="primary" color="success" className="px-6" onClick={() => setShowAllowVacancy(true)}>
                  Aprobar
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <div className="w-10/12 bg-white justify-center mx-auto my-5 shadow-md border border-gray-200 rounded-lg">
            
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Descripción</h3>
              <div className="w-2/3">
                <p className="leading-relaxed text-gray-800">
                  {job.description && job.description.trim() !== '' ? job.description : 'Sin descripción detallada.'}
                </p>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Empresa</h3>
              <div className="w-2/3"><span className="font-semibold">{job.company ?? '-'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Ubicación</h3>
              <div className="w-2/3"><span>{job.location ?? '-'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Sector</h3>
              <div className="w-2/3"><span>{job.sector ?? '-'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Número de plazas</h3>
              <div className="w-2/3"><span>{job.numberOfPositions ?? 1}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Sueldo mensual</h3>
              <div className="w-2/3"><span>{job.salaryRange ?? '-'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Prestaciones</h3>
              <div className="w-2/3"><span>{job.BenefitsSection && job.BenefitsSection !== '' ? job.BenefitsSection : 'No especificadas'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Escolaridad requerida</h3>
              <div className="w-2/3"><span>{job.degree ? String(job.degree) : 'No especificada'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Experiencia requerida</h3>
              <div className="w-2/3"><span>{job.RequiredExperience ?? 'No especificada'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Horarios</h3>
              <div className="w-2/3">{workShiftLabelMap[job.schedule] ?? job.schedule ?? '-'}</div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Género</h3>
              <div className="w-2/3"><span>{job.gender ?? 'Indistinto'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Rango de edad</h3>
              <div className="w-2/3"><span>{displayAgeRange()}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Datos adicionales</h3>
              <div className="w-2/3"><span>{job.AdditionalInformation && job.AdditionalInformation !== '' ? job.AdditionalInformation : 'Ninguno'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />
          </div>

          <DrawerClose className='text-base font-bold hover:bg-zinc-200 border-0 text-uaq-danger px-4 py-3 rounded-md mx-auto mb-7' onClick={() => setOpen(false)}>
            Cancelar
          </DrawerClose>
        </DrawerContent>
      </Drawer>

      
      
      {mounted && showAllowVacancy && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <AllowVacancyModal 
            open={true} 
            onConfirm={handleAllowConfirm} 
            onClose={closeAllow} 
          />
        </div>,
        document.body
      )}

      {mounted && showRejectVacancy && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <RejectVacancyModal 
            open={true}
            companyName={job.company} 
            roleTitle={job.title}    
            onConfirm={handleRejectConfirm} 
            onClose={closeReject} 
          />
        </div>,
        document.body
      )}
    </div>
  );
}