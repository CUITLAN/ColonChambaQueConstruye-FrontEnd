import { ColumnDef } from '@tanstack/react-table';
import { accentInsensitiveTextFilter, dateSameDay } from '@/validations/filtersTanStack';
import { dateToLocaleDateString } from '@/lib/utils';
import React from 'react';
import SortButton from '../tables/ui/SortButton';
import { filterType } from '@/interfaces/table';
import { listAreasOptionsConstants, listWorkingHoursOptionsConstants } from '@/constants';
import DrawerLinkerVacancies from '../DrawerVacante/DrawerLinkerVacancies';
import { CompanyData, JobCardProps } from '@/interfaces';
import DrawerLinkerCompany from './DrawerLinkerCompanie';
import { Avatar, AvatarFallback } from '../ui/avatar';

// --- COLUMNAS DE VACANTES ---
export const vacanciesLinkerColumns: ColumnDef<JobCardProps>[] = [
  {
    id: 'name',
    accessorFn: (row) => row.title ?? '',
    header: ({ column }) => <SortButton column={column} name="Puesto" />,
    cell: ({ row }) => (row.original.title ?? ''),
    filterFn: accentInsensitiveTextFilter,
  },
  {
    accessorKey: 'company',
    header: ({ column }) => <SortButton column={column} name="Empresa" />,
    filterFn: accentInsensitiveTextFilter,
  },
   {
    accessorKey: 'sector',
    header: ({ column }) => <SortButton column={column} name="Sector" />,
    filterFn: accentInsensitiveTextFilter,
  },
  {
    accessorKey: 'schedule',
    cell: ({ getValue }) => {
      const raw = getValue<string>();
      const map: Record<string, string> = {
        TIEMPO_COMPLETO: 'Tiempo Completo',
        MEDIO_TIEMPO: 'Medio Tiempo',
        HORARIO_FLEXIBLE: 'Horario Flexible',
        PAGO_HORA: 'Pago por hora',
        PRACTICAS: 'Prácticas',
      };
      return map[raw] ?? raw;
    },
    header: ({ column }) => (
      <SortButton column={column} name="Tipo de jornada" />
    ),
    filterFn: accentInsensitiveTextFilter,
  },
  {
    accessorKey: 'createdAt',
    cell: ({ getValue }) => dateToLocaleDateString(getValue() as string),
    header: ({ column }) => <SortButton column={column} name="Fecha de solicitud" />,
    filterFn: dateSameDay,
  },
  {
    header: ' ',
    id: 'actions',
    cell: ({ row }) => {
      // CORRECCIÓN AQUÍ:
      // Solo pasamos 'job' y 'sideDrawer'. 
      // Eliminamos 'company' y 'logoUrl' porque el componente ya no las pide.
      return (
        <DrawerLinkerVacancies 
            job={row.original} 
            sideDrawer='right' 
            open={false} 
        />
      );
    },
  },
];

// --- FILTROS VACANTES ---
export const filtersLinkerVacancies: filterType[] = [
  {
    value: 'sector',
    name: 'Sector',
    options: listAreasOptionsConstants
  },
  {
    value: 'createdAt',
    name: 'Fecha de registro',
    isDate: true,
  },
  {
    value: 'schedule',
    name: 'Tipo de jornada',
    options:  listWorkingHoursOptionsConstants
  }
]

// --- COLUMNAS DE EMPRESAS (COMPANIES) ---
export const companiesLinkerColumns: ColumnDef<CompanyData>[] = [
  {
    id: 'name',
    accessorFn: (row) => row.Company.tradeName ?? '', 
    header: ({ column }) => <SortButton column={column} name="Nombre de la empresa" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-uaq-terniary text-white font-semibold">
              {row.original.Company.tradeName
                .split(' ')
                .map((word) => word.charAt(0))}
            </AvatarFallback>
          </Avatar>
        {row.original.Company.tradeName}
      </div>
    ),
  },
  {
    accessorKey: 'workSector',
    accessorFn: (row) => row.Company.workSector ?? '',
    header: ({ column }) => <SortButton column={column} name="Giro de la empresa" />,
  },
  {
    accessorKey: 'registeredAt',
    accessorFn: (row) => row.Company.registeredAt ?? '',
    cell: ({ getValue }) => dateToLocaleDateString(getValue() as string),
    header: ({ column }) => <SortButton column={column} name="Fecha de registro" />,
  },
  {
    id: 'actions',
    header: ' ',
    cell: ({ row }) => {
      return (
        <DrawerLinkerCompany 
          company={row.original as CompanyData} 
          sideDrawer='right' 
          open={false} 
          logoUrl={''} 
        />
      );
    }
  }
];

// --- FILTROS EMPRESAS ---
export const filtersLinkerCompanies: filterType[] = [
  {
    value: 'workSector',
    name: 'Giro de la empresa',
    options: listAreasOptionsConstants
  },
  {
    value: 'registeredAt',
    name: 'Fecha de registro',
    isDate: true,
  }
]