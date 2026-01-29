'use client';

import { Button } from '@/components/ui/button';
import { FileSend } from '@solar-icons/react';

import { UploadedFile } from '@/components/common/UploadedFile';

interface CurriculumData {
  id: string;
  title: string;
  curriculumUrl: string;
}

interface CurriculumSectionProps {
  cvData: CurriculumData | null;
  isLoading: boolean;
  onUpload: () => void;
  onUpdate: ()=> void;
}

export default function CurriculumSection({ 
  cvData, 
  isLoading, 
  onUpload, 
  onUpdate

}: CurriculumSectionProps) {

  if (isLoading) {
    return (
      <div className="mt-10 h-[60px] flex items-center justify-center text-sm text-zinc-400 border border-dashed rounded-lg">
        Verificando archivos...
      </div>
    );
  }

  return (
    <div className="mt-10 flex gap-4">
      {cvData == null ? (
        <Button
          type="button"
          variant="primary" 
          color="gray" 
          className="h-[60px] flex-1 [&_svg]:!h-12 [&_svg]:!w-12 bg-white border border-dashed border-gray-300 hover:bg-gray-50 text-black shadow-none flex justify-start px-6"
          onClick={onUpload}
        >
          <div className="m-0 w-[48px] text-gray-400">
            <FileSend weight="Bold" className="h-full w-full shrink-0" />
          </div>
          <div className="pl-[20px] text-left leading-tight font-light">
            <p className="text-base font-semibold text-gray-800">Sube tu Curriculum</p>
            <p className="text-sm text-zinc-500">Sube tu CV en formato PDF</p>
          </div>
        </Button>
      ) : (
        <div className="w-full">
          <UploadedFile
            file={cvData.curriculumUrl}
            defaultFileName={cvData.title || "Curriculum.pdf"}
            action="upload"
            
          />
          
          <div className='mt-2 text-xs text-right'>
            <a 
              href={cvData.curriculumUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Abrir PDF en nueva pestaña
            </a>
          </div>

          <div className=''>
            <Button type='button' variant={"primary"} onClick={onUpdate}>
            Actualizar
          </Button>
          </div>

        </div>
      )}
    </div>
  );
}