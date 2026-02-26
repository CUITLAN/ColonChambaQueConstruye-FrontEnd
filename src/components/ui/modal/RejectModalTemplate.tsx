'use client';

import { useEffect, useCallback } from 'react';
import { Card, CardFooter, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import FormInput from '@/components/forms/FormInput';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export interface ModalTexts {
  title: string;
  subtitle?: string;
  content?: string; 
  cancel: string;
  confirm: string;
}

const schema = z.object({
  reason: z.string().min(1, 'Este campo es requerido'),
});

type SchemaFormType = z.infer<typeof schema>;

interface InfoBlock {
  name?: string;
  detail?: string;
  nameLabel?: string;  
  detailLabel?: string; 
}

interface RejectModalTemplateProps {
  open?: boolean;
  onClose: () => void;
  onConfirm: (data: SchemaFormType) => void;
  texts: ModalTexts;
  className?: string;
  description: string;
  info?: InfoBlock;    
}

export default function RejectModalTemplate({
  onClose,
  onConfirm,
  texts,
  className = '',
  description,
  info,
}: RejectModalTemplateProps) {

  const methods = useForm<SchemaFormType>({
    resolver: zodResolver(schema),
    defaultValues: { reason: '' },
    mode: 'onSubmit',
  });

  const { control, handleSubmit } = methods;

  const handleConfirm = useCallback((data: SchemaFormType) => {
    onConfirm(data);
  }, [onConfirm]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={`relative mx-auto w-full max-w-2xl shadow-md ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleConfirm)} className="mt-4 flex flex-col gap-6">
          <Tabs value="open">
            <TabsContent value="open">
              <Card className="flex flex-col bg-zinc-50 p-8 h-fit min-w-[636px]">
                <CardTitle className="text-xl font-bold uppercase tracking-tight">
                  {texts.title}
                </CardTitle>

                {info && (info.name || info.detail) && (
                  <div className="mt-6 mb-2 space-y-2 text-[15px] border-l-4 border-uaq-brand pl-4 bg-white py-3 rounded-r-lg shadow-sm">
                    {info.name && (
                      <div className="flex gap-2">
                        <span className="font-bold text-zinc-600 min-w-[140px]">
                          {info.nameLabel || "Empresa"}:
                        </span>
                        <span className="text-zinc-800">{info.name}</span>
                      </div>
                    )}
                    {info.detail && (
                      <div className="flex gap-2">
                        <span className="font-bold text-zinc-600 min-w-[140px]">
                          {info.detailLabel || "Puesto"}:
                        </span>
                        <span className="text-zinc-800">{info.detail}</span>
                      </div>
                    )}
                  </div>
                )}

                <CardContent className='p-0 mt-6'>
                  <FormInput
                    control={control}
                    label="Describa observaciones"
                    type="textarea"     
                    name="reason"
                    description={description}
                    placeholder="Escriba aquí los motivos detallados..."
                  />
                </CardContent>

                <CardFooter className="flex justify-end gap-6 !p-0 mt-8">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="text-zinc-500 hover:text-red-600 hover:bg-red-50 font-semibold" 
                    onClick={onClose}
                  >
                    {texts.cancel}
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="bg-red-500 hover:bg-red-600 text-white px-8 font-bold rounded-lg"
                  >
                    {texts.confirm}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  );
}