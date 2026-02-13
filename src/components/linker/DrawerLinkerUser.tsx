import Image from 'next/image';
import { Balloon, Buildings, Calendar, ClockCircle, Dollar, Gps, MapPoint, User, Letter, PhoneCalling, AddCircle, InboxIn } from '@solar-icons/react';
import { Company, CompanyC, CompanyData, JobCardProps } from '@/interfaces';
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
import { workShiftLabelMap } from '@/app/linker/home/vacancies/rejected/page';
import { Separator } from '../ui/separator';
import { DataVacancies } from '../../data/testDataVacancies';
import AllowVacancyModal from '../ui/modal/AllowVacancy';
import { useState, useRef, useEffect } from 'react';
import { UserCandidate } from '@/interfaces/usercandidates';
import { dateToLocaleDateString } from '@/lib/utils';

interface DrawerLinkerUserProps {
  user: UserCandidate;
  sideDrawer: 'right' | 'left';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  logoUrl?: string;
}

export default function DrawerLinkerUser({
  user,
  sideDrawer,
}: DrawerLinkerUserProps) {

    // nombre completo seguro (first + last)
  const candidateName = (
    (user?.firstName ?? '') +
    ' ' +
    (user?.lastName ?? '')
  ).trim();


  if (!user) return null;

  return (
    //Job Card Container  
    <div className="hover:border-uaq-brand-800 group flex flex-col rounded-lg border border-zinc-300 shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
      {/* Fila 1 - Trigger del Drawer */}
      <Drawer direction={sideDrawer === "left" ? "left" : "right"}>
        <DrawerTrigger asChild>
          <Button
            variant="primary"
            color='accent'
          >
            Revisar
          </Button>
        </DrawerTrigger>

        {/* Drawer Content */}
        <DrawerContent className="flex overflow-y-auto overflow-x-hidden bg-gray-50 pt-5">
          <DrawerHeader className="px-10">
            <div className="flex w-full items-center justify-between">
              {/* TÍTULO */}
              <DrawerTitle className="text-2xl font-[800]">
                USUARIO:{' '}
                <span className="font-[800] tracking-wide">
                  {candidateName.toUpperCase() || 'N/A'}
                </span>
              </DrawerTitle>

              {/* BOTONES */}
              <div className="flex flex-row gap-4">
                <Button variant="primary" color="danger" className="px-6">
                  Rechazar
                </Button>
                <Button variant="primary" color="success" className="px-6">
                  Aprobar
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <div className="w-10/12 bg-white justify-center mx-auto my-5 my-5shadow-md border border-gray-200 rounded-lg">
            {/* RAZON SOCIAL */}
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Fecha de nacimiento</h3>
              <div className="w-2/3">
                <span>{dateToLocaleDateString(user.birthDate)}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            {/* RFC */}
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Correo electrónico</h3>
              <div className="w-2/3">
                <p className="leading-relaxed text-gray-800">
                  {user.email ?? '-'}
                </p>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            {/* Dirección */}
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Dirección</h3>
              <div className="w-2/3">
                <span>{user.address ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            {/* País de inversión */}
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Teléfono celular</h3>
              <div className="w-2/3">
                <span>{user.cellPhone ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            {/* Giro de la empresa */}
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Grado de estudios</h3>
              <div className="w-2/3">
                <span>{user.academicLevel ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            {/* Total de empleados */}
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Carrera (opcional)</h3>
              <div className="w-2/3">
                <span>{user.degree ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            {/* Correo electrónico */}
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Experiencia</h3>
              <div className="w-2/3">
                <span>{user.jobExperience ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            {/* Descripción */}
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Posición deseada</h3>
              <div className="w-2/3">
                <span>{user.desiredPosition ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            {/* Descripción */}
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Fecha de registro</h3>
              <div className="w-2/3">
                <span>{dateToLocaleDateString(user.registeredAt)}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />
          </div>

          <DrawerClose className='text-base font-bold hover:bg-zinc-200 border-0 text-uaq-danger px-4 py-3 rounded-md mx-auto mb-7'>
            Cancelar
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    </div>
  );
}