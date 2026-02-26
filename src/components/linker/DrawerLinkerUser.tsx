'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserCandidate } from '@/interfaces/usercandidates';
import { dateToLocaleDateString } from '@/lib/utils';
import { useApplicantStore } from '@/app/store/authApplicantStore';
import { apiService } from '@/services/api.service';
import { toast } from 'sonner';

import AllowUserModal from '@/components/ui/modal/AllowUserModal';
import RejectUserModal from '@/components/ui/modal/RejectUserModal';

interface DrawerLinkerUserProps {
  user: UserCandidate;
  sideDrawer: 'right' | 'left';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void; 
}

export default function DrawerLinkerUser({
  user,
  sideDrawer,
  open,
  onOpenChange,
  onSuccess
}: DrawerLinkerUserProps) {
  const { id: linkerId, token } = useApplicantStore();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isControlled = typeof open === 'boolean' && typeof onOpenChange === 'function';
  const [internalOpen, setInternalOpen] = useState<boolean>(open ?? false);

  useEffect(() => {
    if (!isControlled && typeof open === 'boolean') {
      setInternalOpen(open);
    }
  }, [open, isControlled]);

  const getOpen = () => (isControlled ? open! : internalOpen);
  const setOpen = (v: boolean) => {
    if (isControlled) {
      onOpenChange!(v);
    } else {
      setInternalOpen(v);
    }
  };

  const [showAllowUser, setShowAllowUser] = useState(false);
  const [showRejectUser, setShowRejectUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const candidateName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

  const handleReviewUser = async (validation: boolean, comment?: string) => {
    if (!linkerId || !token) {
      toast.error('Error de sesión: No se encontró el ID o token del Linker.');
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = `/linkers/${linkerId}/users/${user.id}`;
      
      const body = {
        validation,
        comment: validation ? null : (comment || "Información incompleta o incorrecta")
      };

      const response = await apiService.patch(endpoint, body);

      if (!response.ok) {
        throw new Error('Error al procesar la solicitud');
      }

      toast.success(validation ? 'Usuario aprobado correctamente.' : 'Usuario rechazado correctamente.');
      
      setShowAllowUser(false);
      setShowRejectUser(false);
      setOpen(false);

      if (onSuccess) {
        onSuccess(); 
      }
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al actualizar el estatus del usuario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAllowConfirm = () => handleReviewUser(true);
  const handleRejectConfirm = (data: { reason: string }) => handleReviewUser(false, data.reason);

  return (
    <div className="hover:border-uaq-brand-800 group flex flex-col rounded-lg border border-zinc-300 shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
      <Drawer direction={sideDrawer === "left" ? "left" : "right"} open={getOpen()} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="primary" color='accent' onClick={() => setOpen(true)}>
            Revisar
          </Button>
        </DrawerTrigger>

        <DrawerContent className="flex h-full w-[500px] overflow-y-auto overflow-x-hidden bg-gray-50 pt-5 outline-none">
          <DrawerHeader className="px-10">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col text-left space-y-1">
                <DrawerTitle className="text-2xl font-[800] uppercase text-brand-500 leading-tight">
                  USUARIO:{' '}
                  <span className="font-[800] tracking-wide">{candidateName.toUpperCase() || 'N/A'}</span>
                </DrawerTitle>
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {user.email}
                </span>
              </div>

              <div className="flex flex-row gap-4 shrink-0 items-center">
                <Button 
                  variant="primary" color="danger" className="px-6"
                  disabled={isSubmitting}
                  onClick={() => setShowRejectUser(true)}
                >
                  Rechazar
                </Button>
                <Button 
                  variant="primary" color="success" className="px-6"
                  disabled={isSubmitting}
                  onClick={() => setShowAllowUser(true)}
                >
                  Aprobar
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <div className="w-10/12 bg-white justify-center mx-auto my-5 shadow-md border border-gray-200 rounded-lg pb-4">
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Fecha de nacimiento</h3>
              <div className="w-2/3 text-right">
                <span>{user.birthDate ? dateToLocaleDateString(user.birthDate) : 'N/A'}</span>
              </div>
            </div>
            <Separator className='w-11/12 mx-auto shadow-sm' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Correo electrónico</h3>
              <div className="w-2/3 text-right">
                <p className="leading-relaxed text-gray-800 font-semibold">{user.email ?? '-'}</p>
              </div>
            </div>
            <Separator className='w-11/12 mx-auto shadow-sm' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Dirección</h3>
              <div className="w-2/3 text-right">
                <span>{user.address ?? 'No proporcionada'}</span>
              </div>
            </div>
            <Separator className='w-11/12 mx-auto shadow-sm' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Teléfono celular</h3>
              <div className="w-2/3 text-right">
                <span>{user.cellPhone ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 mx-auto shadow-sm' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Grado de estudios</h3>
              <div className="w-2/3 text-right">
                <span className="capitalize">{user.academicLevel?.toLowerCase().replace('_', ' ') ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 mx-auto shadow-sm' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Carrera / Título</h3>
              <div className="w-2/3 text-right">
                <span>{user.degree ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 mx-auto shadow-sm' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Experiencia Laboral</h3>
              <div className="w-2/3 text-right">
                <p className="text-gray-700 italic">{user.jobExperience ?? 'Sin experiencia previa registrada'}</p>
              </div>
            </div>
            <Separator className='w-11/12 mx-auto shadow-sm' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Posición deseada</h3>
              <div className="w-2/3 text-right">
                <span className="font-medium text-uaq-brand">{user.desiredPosition ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 mx-auto shadow-sm' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3 font-bold">Fecha de registro</h3>
              <div className="w-2/3 text-right">
                <span>{user.registeredAt ? dateToLocaleDateString(user.registeredAt) : '-'}</span>
              </div>
            </div>
          </div>

          <DrawerClose 
            className="text-base font-bold hover:bg-zinc-200 border-0 text-red-500 px-4 py-3 rounded-md mx-auto mb-7 cursor-pointer" 
            onClick={() => setOpen(false)}
          >
            Cancelar
          </DrawerClose>
        </DrawerContent>
      </Drawer>

      {/* Portales para Modales de Acción */}
      {mounted && showAllowUser && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <AllowUserModal 
            open={true}
            onClose={() => setShowAllowUser(false)}
            onConfirm={handleAllowConfirm}
          />
        </div>,
        document.body
      )}

      {mounted && showRejectUser && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <RejectUserModal 
            open={true}
            userName={candidateName}
            email={user.email}
            onClose={() => setShowRejectUser(false)}
            onConfirm={handleRejectConfirm}
          />
        </div>,
        document.body
      )}
    </div>
  );
}