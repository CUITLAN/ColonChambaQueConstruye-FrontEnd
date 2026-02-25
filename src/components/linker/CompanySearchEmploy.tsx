import { ColumnDef } from '@tanstack/react-table';
import { accentInsensitiveTextFilter, dateSameDay } from '@/validations/filtersTanStack';
import { dateToLocaleDateString } from '@/lib/utils';
import React from 'react';
import SortButton from '../tables/ui/SortButton';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { filterType } from '@/interfaces/table'; 
import { UserCandidate } from '@/interfaces/usercandidates';
import DrawerLinkerUser from './DrawerLinkerUser';

export const getUserLinkerColumns = (onUpdate: () => void): ColumnDef<UserCandidate>[] => [
  {
    accessorFn: (row) => row.firstName, 
    id: 'name', 
    header: ({ column }) => <SortButton column={column} name="Usuario" />,
    filterFn: accentInsensitiveTextFilter,
    cell: ({ row }) => {
      const user = row.original;
      const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-orange-500 text-white font-semibold uppercase">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{user.firstName}</span>
          </div>
        </div>
      );
    }
  },
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: 'fullName',
    header: ({ column }) => <SortButton column={column} name="Nombre Completo" />,
    filterFn: accentInsensitiveTextFilter,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <SortButton column={column} name="Correo" />,
    filterFn: accentInsensitiveTextFilter,
  },
  {
    accessorKey: 'registeredAt',
    cell: ({ getValue }) => dateToLocaleDateString(getValue() as string),
    header: ({ column }) => <SortButton column={column} name="Fecha de registro" />,
    filterFn: dateSameDay,
  },
  {
    id: 'actions',
    header: ' ',
    cell: ({ row }) => (
      <DrawerLinkerUser 
        user={row.original} 
        sideDrawer="right" 
        onSuccess={onUpdate} 
      />
    ),
  },
];

export const UserSearchFilters: filterType[] = [
  {
    value: 'academicLevel',
    name: 'Nivel Académico',
    options: [], 
  },
  {
    value: 'registeredAt',
    name: 'Fecha de registro',
    isDate: true,
  },
];