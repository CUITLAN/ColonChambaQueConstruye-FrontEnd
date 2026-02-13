'use client';

import React, { useState, useEffect } from 'react';
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
import { CompanyData } from '@/interfaces';
import { apiService } from '@/services/api.service';
import { useApplicantStore } from '@/app/store/authApplicantStore';
import { toast } from 'sonner';


import AllowVacancyModal from '@/components/ui/modal/AllowVacancy';
import RejectVacancyModal from '@/components/ui/modal/RejectVacancyModal';

interface DrawerLinkerCompanyProps {
  companyData: CompanyData;
  sideDrawer: 'right' | 'left';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function DrawerLinkerCompany({
  companyData,
  sideDrawer,
  open,
  onOpenChange,
  onSuccess
}: DrawerLinkerCompanyProps) {
  const { id: linkerId } = useApplicantStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const [showAllowModal, setShowAllowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (!companyData) return null;

  const { Company, CompanyAccount } = companyData;

  const handleReviewCompany = async (validation: boolean, comment?: string) => {
    if (!linkerId) {
      toast.error('Error de sesión: No se encontró el ID del Linker.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const endpoint = `/linkers/${linkerId}/companies/${Company.id}`;
      
      const body = {
        validation,
        comment: comment || null
      };

      const response = await apiService.patch(endpoint, body);

      if (!response.ok) throw new Error('Fallo al actualizar estado');

      toast.success(validation ? 'Empresa aprobada correctamente.' : 'Empresa rechazada correctamente.');
      
      setShowAllowModal(false);
      setShowRejectModal(false);
      setOpen(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al procesar la solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAllowConfirm = () => {
    handleReviewCompany(true);
  };

  const handleRejectConfirm = (data: { reason: string }) => {
    handleReviewCompany(false, data.reason);
  };

  return (
    <div className="hover:border-uaq-brand-800 group flex flex-col rounded-lg border border-zinc-300 shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
      <Drawer 
        direction={sideDrawer === "left" ? "left" : "right"} 
        open={getOpen()} 
        onOpenChange={setOpen}
      >
        <DrawerTrigger asChild>
          <Button variant="primary" color='accent' onClick={() => setOpen(true)}>
            Revisar
          </Button>
        </DrawerTrigger>

        <DrawerContent className="flex h-full w-[500px] overflow-y-auto overflow-x-hidden bg-gray-50 pt-5 outline-none">
          <DrawerHeader className="px-10">
            <div className="flex w-full items-center justify-between">
              
              <div className='flex flex-col text-left space-y-1'>
                <DrawerTitle className="text-2xl font-[800] uppercase text-brand-500 leading-tight">
                  EMPRESA:{' '}
                  <span className="font-[800] tracking-wide">{Company.tradeName?.toUpperCase()}</span>
                </DrawerTitle>
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {Company.legalName}
                </span>
              </div>

              <div className="flex flex-row gap-4 shrink-0 items-center">
                <Button 
                  className="px-6"
                  variant="primary" color="danger"
                  disabled={isSubmitting}
                  onClick={() => setShowRejectModal(true)}
                >
                  Rechazar
                </Button>
                <Button 
                  className="px-6 "
                  variant="primary" color="success"
                  disabled={isSubmitting}
                  onClick={() => setShowAllowModal(true)}
                >
                  Aprobar
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <div className="w-10/12 bg-white mx-auto my-5 shadow-sm border border-gray-200 rounded-lg pb-5">
            
            <div className="px-6 py-4 bg-gray-100 rounded-t-lg border-b">
               <h3 className="font-bold text-gray-700">Información de la Empresa</h3>
            </div>

            <div className="px-6 py-4 flex flex-col gap-2">
              <h3 className="text-sm font-bold text-gray-900">Descripción</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap text-justify leading-relaxed break-words">
                {Company.description || 'Sin descripción'}
              </p>
            </div>
            <Separator className='w-11/12 mx-auto' />

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">RFC</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {Company.rfc}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />

             <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Giro</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {Company.workSector}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />
            
            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Trabajadores</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {Company.totalWorkers}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />

            <div className="px-6 py-4 flex justify-between items-start">
              <h3 className="text-sm font-bold w-1/3 mt-1">Dirección</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right break-words">
                {Company.street} #{Company.streetNumber}, {Company.district}, {Company.municipality}, {Company.state}, {Company.zipCode}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Correo Empresa</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {Company.companyEmail}
              </div>
            </div>

            <div className="mt-6 px-6 py-4 bg-gray-100 border-y">
               <h3 className="font-bold text-gray-700">Datos del Contacto</h3>
            </div>

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Nombre</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {CompanyAccount.firstName} {CompanyAccount.lastName}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Puesto</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {CompanyAccount.jobTitle}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Teléfono</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {CompanyAccount.cellPhone}
              </div>
            </div>
            <Separator className='w-11/12 mx-auto' />

            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold w-1/3">Email Personal</h3>
              <div className="w-2/3 text-sm text-gray-600 text-right">
                {CompanyAccount.email}
              </div>
            </div>

          </div>

          <DrawerClose className='text-sm font-bold hover:bg-zinc-200 border-0 text-red-500 px-4 py-3 rounded-md mx-auto mb-7 cursor-pointer transition-colors' onClick={() => setOpen(false)}>
            Cancelar
          </DrawerClose>
        </DrawerContent>
      </Drawer>

      {/* MODALES DE ACCIÓN CON PORTAL */}
      {mounted && showAllowModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <AllowVacancyModal 
            open={true}
            onClose={() => setShowAllowModal(false)}
            onConfirm={handleAllowConfirm}
          />
        </div>,
        document.body
      )}

      {mounted && showRejectModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <RejectVacancyModal 
            open={true}
            companyName={Company.tradeName}
            roleTitle={Company.legalName}
            onClose={() => setShowRejectModal(false)}
            onConfirm={handleRejectConfirm}
          />
        </div>,
        document.body
      )}
    </div>
  );
}