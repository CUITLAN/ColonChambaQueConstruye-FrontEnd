'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/legacyButton';
import {
  AltArrowLeft,
  AltArrowRight,
  DoubleAltArrowLeft,
  DoubleAltArrowRight,
} from '@solar-icons/react';

import { useMemo, useState } from 'react';

import { filterType } from '@/interfaces/table';
import TableSearchBar from '@/components/ui/TableSerchBar';

const normalizeValue = (value: unknown) => {
  if (value == null) return '';
  const base = Array.isArray(value) ? value.join(' ') : String(value);
  return base.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

const normalizeDateValue = (value: unknown) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value as any);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface DataTableCSBProps<TData, TValue> extends DataTableProps<TData, TValue> {
  filters: filterType[];
  onSearchChange?: (value: string) => void;
  onFilterChange?: (columnId: string, value: any) => void;
  // Prop opcional para ocultar la paginación interna
  hidePagination?: boolean; 
}

export function DataTableCustomSearchBar<TData, TValue>({
  columns,
  data,
  filters,
  onSearchChange,
  onFilterChange,
  hidePagination = false, // Por defecto es false para no romper otras tablas
}: DataTableCSBProps<TData, TValue>) {
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const filtersMap = useMemo(() => {
    const map = new Map<string, filterType>();
    filters.forEach((filter) => {
      map.set(filter.value, filter);
    });
    return map;
  }, [filters]);

  const columnAccessors = useMemo(() => {
    return columns.reduce<Record<string, (row: TData) => unknown>>((acc, column) => {
      let columnId: string | undefined = typeof column.id === 'string' ? column.id : undefined;

      if (!columnId && 'accessorKey' in column && column.accessorKey) {
        columnId = Array.isArray(column.accessorKey)
          ? column.accessorKey.map((segment) => String(segment)).join('.')
          : String(column.accessorKey);
      }

      if (!columnId) {
        return acc;
      }

      if ('accessorFn' in column && typeof column.accessorFn === 'function') {
        acc[columnId] = (row: TData) => column.accessorFn?.(row, 0);
        return acc;
      }

      if ('accessorKey' in column && column.accessorKey) {
        const rawPath = Array.isArray(column.accessorKey)
          ? column.accessorKey.map((segment) => String(segment))
          : String(column.accessorKey).split('.');

        acc[columnId] = (row: TData) =>
          rawPath.reduce<unknown>((current: unknown, segment: string) => {
            if (current == null || typeof current !== 'object') return undefined;
            const container = current as Record<string, unknown>;
            return segment in container ? container[segment] : undefined;
          }, row as unknown);
      }

      return acc;
    }, {});
  }, [columns]);

  const filteredData = useMemo(() => {
    if (!columnFilters.length) {
      return data;
    }

    return data.filter((row) => {
      return columnFilters.every(({ id, value }) => {
        if (
          value == null ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === 'string' && value.length === 0)
        ) {
          return true;
        }

        const accessor = columnAccessors[id];
        if (!accessor) {
          return true;
        }

        const cellValue = accessor(row);

        if (id === 'name') {
          const text = typeof value === 'string' ? value : Array.isArray(value) ? value[0] : '';
          if (!text || !text.trim()) {
            return true;
          }
          return normalizeValue(cellValue).includes(normalizeValue(text));
        }

        const config = filtersMap.get(id);
        if (config?.isDate) {
          const selectedDate = Array.isArray(value) ? value[0] : value;
          if (!selectedDate) {
            return true;
          }
          return normalizeDateValue(cellValue) === normalizeDateValue(selectedDate);
        }

        const selectedValues = Array.isArray(value)
          ? value
              .map((option) => (typeof option === 'string' ? option : String(option ?? '')))
              .filter((option) => option.length > 0)
          : String(value)
              .split(/[|,]/)
              .map((option) => option.trim())
              .filter((option) => option.length > 0);

        if (selectedValues.length === 0) {
          return true;
        }

        const normalizedCell = normalizeValue(cellValue);
        return selectedValues.some((option) => normalizedCell.includes(normalizeValue(option)));
      });
    });
  }, [columnAccessors, columnFilters, data, filtersMap]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    manualFiltering: true,
  });

  return (
    <div className="flex flex-col content-end items-end space-y-4">
      {/*  Barra de búsqueda + filtros */}
      <TableSearchBar
        filters={filters}
        table={table}
        onSearch={onSearchChange}
        onFilterChange={onFilterChange}
      />

      {/* Tabla */}
      <div className="w-full overflow-hidden rounded-md border">
        <Table className="bg-white">
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-uaq-brand">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación - Se renderiza solo si hidePagination es false */}
      {!hidePagination && (
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por vista</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a la primera página</span>
              <DoubleAltArrowLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a la página anterior</span>
              <AltArrowLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a la página siguiente</span>
              <AltArrowRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a la última página</span>
              <DoubleAltArrowRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}