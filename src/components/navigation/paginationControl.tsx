'use client';

import React from 'react';
import { Button } from '@/components/ui/legacyButton'; // O el path correcto de tus botones
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

  const canPrevious = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-end space-x-6 lg:space-x-8 py-2">
      {/* Selector de Filas por Vista */}
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Filas por vista</p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
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

      {/* Indicador de Página */}
      <div className="flex w-[120px] items-center justify-center text-sm font-medium">
        Página {currentPage} de {totalPages || 1}
      </div>

      {/* Botones de Navegación */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          onClick={handleFirst}
          disabled={!canPrevious}
        >
          <span className="sr-only">Ir a la primera página</span>
          <DoubleAltArrowLeft size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={handlePrevious}
          disabled={!canPrevious}
        >
          <span className="sr-only">Ir a la página anterior</span>
          <AltArrowLeft size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={handleNext}
          disabled={!canNext}
        >
          <span className="sr-only">Ir a la página siguiente</span>
          <AltArrowRight size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          onClick={handleLast}
          disabled={!canNext}
        >
          <span className="sr-only">Ir a la última página</span>
          <DoubleAltArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}