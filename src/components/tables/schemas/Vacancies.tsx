import { ColumnDef } from '@tanstack/react-table';
import SortButton from '../ui/SortButton';
import { accentInsensitiveTextFilter, dateSameDay } from '@/validations/filtersTanStack';
import { Badge } from '@/components/ui/badge';
import { dateToLocaleDateString } from '@/lib/utils';
import React from 'react';
import RowActions from './VacanciesActions';
import { Vacancy } from '@/interfaces/vacancy';
import { VacancyRow } from '@/app/employer/home/vacancies/page';

export const createVacanciesColumns = (
  onCloseVacancy?: (vacancyId: string) => void,
): ColumnDef<VacancyRow>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortButton column={column} name="Título" />,
    filterFn: accentInsensitiveTextFilter,
  },
  {
    accessorKey: 'numberOpenings',
    header: ({ column }) => <SortButton column={column} name="Número de plazas" />,
  },
  {
    accessorKey: 'workShift',
    header: 'Tipo de jornada',
    cell: ({ getValue }) => {
      const workShift = getValue() as VacancyRow['workShift'];
      const workShiftMap: Record<VacancyRow['workShift'], string> = {
        TIEMPO_COMPLETO: 'Tiempo completo',
        MEDIO_TIEMPO: 'Medio tiempo',
        PAGO_HORA: 'Pago por hora',
        HORARIO_FLEXIBLE: 'Horario flexible',
      };
      return workShiftMap[workShift] || workShift;
    },
  },
  {
    accessorKey: 'modality',
    header: 'Modalidad',
    cell: ({ getValue }) => {
      const modality = getValue() as Vacancy['modality'];
      const modalityMap: Record<Vacancy['modality'], string> = {
        PRESENCIAL: 'Presencial',
        REMOTO: 'Remoto',
        HIBRIDO: 'Híbrido',
      };
      return modalityMap[modality] || modality;
    },
  },
  {
    accessorKey: 'dateFilter',
    cell: ({ getValue }) => dateToLocaleDateString(getValue() as string),
    header: ({ column }) => <SortButton column={column} name="Fecha de Publicación" />,
    filterFn: dateSameDay,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <SortButton column={column} name="Estado" />,
    cell: ({ getValue }) => {
      const state = getValue() as Vacancy['status'];
      const stateMap: Record<Vacancy['status'], string> = {
        APROBADA: 'APROBADA',
        REVISION: 'REVISION',
        CERRADA: 'CERRADA',
        RECHAZADA: 'RECHAZADA',
        INACTIVA: 'INACTIVA',
        ABIERTA: 'ABIERTA',
      };
      return (
        <Badge
          variant={state === 'APROBADA' ? 'success' : state === 'REVISION' ? 'warning' : 'danger'}
        >
          {stateMap[state]}
        </Badge>
      );
    },
  },
  {
    header: 'Editar',
    id: 'actions',
    cell: ({ row }) => <RowActions row={row} onCloseVacancy={onCloseVacancy} />,
  },
];
