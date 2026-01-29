import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AltArrowLeft, 
  AltArrowRight, 
  DoubleAltArrowLeft, 
  DoubleAltArrowRight 
} from '@solar-icons/react';

interface PaginationControlProps {
  currentPage: number;   
  totalPages: number;    
  pageSize: number;      
  totalItems: number;    
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export default function PaginationControl({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: PaginationControlProps) {
  
  const handleFirst = () => onPageChange(1);
  const handlePrevious = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNext = () => onPageChange(Math.min(totalPages, currentPage + 1));
  const handleLast = () => onPageChange(totalPages);

  // Determinar si los botones deben estar deshabilitados
  const canPrevious = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row sm:gap-6 lg:gap-8">
      
      {/* Selector de Tamaño */}
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium text-gray-600">Filas por vista</p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px] bg-white">
            <SelectValue placeholder={`${pageSize}`} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Info de Página */}
      <div className="flex items-center justify-center text-sm font-medium text-gray-700">
        Página {currentPage} de {totalPages || 1} 
        {totalItems > 0 && <span className="ml-1 text-gray-400">({totalItems} registros)</span>}
      </div>

      {/* Botones de Navegación */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex bg-white"
          onClick={handleFirst}
          disabled={!canPrevious}
        >
          <span className="sr-only">Ir a la primera página</span>
          <DoubleAltArrowLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8 bg-white"
          onClick={handlePrevious}
          disabled={!canPrevious}
        >
          <span className="sr-only">Ir a la página anterior</span>
          <AltArrowLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8 bg-white"
          onClick={handleNext}
          disabled={!canNext}
        >
          <span className="sr-only">Ir a la página siguiente</span>
          <AltArrowRight />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex bg-white"
          onClick={handleLast}
          disabled={!canNext}
        >
          <span className="sr-only">Ir a la última página</span>
          <DoubleAltArrowRight />
        </Button>
      </div>
    </div>
  );
}