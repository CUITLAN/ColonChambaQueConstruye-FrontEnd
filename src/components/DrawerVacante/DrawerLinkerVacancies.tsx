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
import { useState, useRef, useEffect } from 'react';

interface DrawerLinkerVacanciesProps {
  job: JobCardProps;
  sideDrawer: 'right' | 'left';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  company?: string;
  logoUrl?: string;
}

export default function DrawerLinkerVacancies({
  job,
  sideDrawer,
  open,
  onOpenChange,
  company,
  logoUrl,
}: DrawerLinkerVacanciesProps) {
  console.log('DrawerLinkerVacancies mounted — job:', job);

  if (!job) {
    return (
      <div className="p-4 border rounded bg-yellow-50 text-sm text-uaq-danger">
        DrawerLinkerVacancies: no se recibió "job". Revisa el componente padre.
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
  const modalTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (modalTimerRef.current) {
        clearTimeout(modalTimerRef.current);
        modalTimerRef.current = null;
      }
    };
  }, []);

  const openModalAfterDrawerClose = (setter: (v: boolean) => void) => {
    setOpen(false);

    if (modalTimerRef.current) {
      clearTimeout(modalTimerRef.current);
      modalTimerRef.current = null;
    }

    modalTimerRef.current = window.setTimeout(() => {
      setter(true);
      modalTimerRef.current = null;
    }, 280); 
  };

  const handleAllowConfirm = () => setShowAllowVacancy(false);
  const handleRejectConfirm = () => setShowRejectVacancy(false);
  const closeAllow = () => setShowAllowVacancy(false);
  const closeReject = () => setShowRejectVacancy(false);

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
                <Button variant="primary" color="danger" className="px-6" onClick={() => openModalAfterDrawerClose(setShowRejectVacancy)}>
                  Rechazar
                </Button>
                <Button variant="primary" color="success" className="px-6" onClick={() => openModalAfterDrawerClose(setShowAllowVacancy)}>
                  Aprobar
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <div className="w-10/12 bg-white justify-center mx-auto my-5 my-5shadow-md border border-gray-200 rounded-lg">
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Número de plazas</h3>
              <div className="w-2/3"><span>{job.numberOfPositions ?? '-'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Descripción</h3>
              <div className="w-2/3"><p className="leading-relaxed text-gray-800">{job.description ?? '-'}</p></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Sueldo mensual</h3>
              <div className="w-2/3"><span>{job.salaryRange ?? '-'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Prestaciones</h3>
              <div className="w-2/3"><span>{job.BenefitsSection ?? '-'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Escolaridad requerida</h3>
              <div className="w-2/3"><span>{job.degree ? String(job.degree).toLowerCase() : '-'}</span></div>
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
              <div className="w-2/3"><span>{job.ageRange?.min ?? '-'} - {job.ageRange?.max ?? '-'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Datos adicionales</h3>
              <div className="w-2/3"><span>{job.AdditionalInformation ?? '-'}</span></div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />
          </div>

          <DrawerClose className='text-base font-bold hover:bg-zinc-200 border-0 text-uaq-danger px-4 py-3 rounded-md mx-auto mb-7' onClick={() => setOpen(false)}>
            Cancelar
          </DrawerClose>
        </DrawerContent>
      </Drawer>

      {showAllowVacancy && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
          <AllowVacancyModal onConfirm={handleAllowConfirm} onClose={closeAllow} />
        </div>
      )}

      {showRejectVacancy && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
          <AllowVacancyModal onConfirm={handleRejectConfirm} onClose={closeReject} />
        </div>
      )}
    </div>
  );
}