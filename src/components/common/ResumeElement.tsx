//TODO: Changing styles to appeal to figma design
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CloseSquare, Pen2, Upload } from '@solar-icons/react';

interface ResumeElementProps {
  displayName: string;
  file?: File | string;
  action?: 'upload' | 'edit' | 'none';
  onView?: () => void;
  onRemove?: () => void;
}

export function ResumeElement({
  displayName,
  file,
  action = 'none',
  onView,
  onRemove,
}: ResumeElementProps) {
  return (
    <div className="flex w-full h-[60px] items-center justify-center bg-zinc-100 text-zinc-800 hover:bg-zinc-200 rounded-md">
      {/* Sección izquierda - Información del archivo */}
      <div
        className="flex w-[95%] items-center justify-center text-left gap-[8px]"
        onClick={onView}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onView?.()}
      >
        <div className="shrink-0">
          <Image
            src="/FileIcon.svg"
            alt="FileIcon"
            width={40}
            height={40}
            className="transition-opacity group-hover:opacity-90 items-center"
          />
        </div>
        <div className="items-center gap-2">
          <span className="truncate font-medium">{displayName}</span>
          <div className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {/* Fecha y hora de subida */}
            {file && (
              <span className="shrink-0">
                {new Date().toLocaleDateString('es-MX', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
                <span className="mx-1"></span>
                {new Date().toLocaleTimeString('es-MX', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
        </div>
        
      </div>
      {action !== 'none' && (
        <div className="flex shrink-0 items-center gap-1 px-2">
          
        </div>
      )}
    </div>
  );
}
