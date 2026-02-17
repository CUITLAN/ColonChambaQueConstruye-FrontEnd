'use client';

import { useEffect, useCallback } from 'react';
import { Card, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';

export interface ModalTexts {
  title: string;
  subtitle: string;
  cancel: string;
  confirm: string;
}

interface BaseModalTemplateProps {
  open?: boolean;               
  onClose: () => void;
  onConfirm: () => void;
  texts: ModalTexts;
  className?: string;
}

export default function BaseModalTemplate({
  onClose,
  onConfirm,
  texts,
  className = '',
}: BaseModalTemplateProps) {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm, texts.title]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = (e as any).keyCode;

      // Escape → cerrar modal
      if (e.key === 'Escape' || e.key === 'Esc' || code === 27) {
        e.preventDefault();
        onClose();
        return;
      }

      // Enter → confirmar acción
      if (e.key === 'Enter' || code === 13) {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose, handleConfirm]);

  return (
    <div
      className={`relative mx-auto w-full max-w-lg ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <Tabs value="open">
        <TabsContent value="open">
          <Card className="flex flex-col bg-zinc-50 p-8">
            <CardTitle>{texts.title}</CardTitle>

            <CardDescription className="my-4 text-card-foreground">
              {texts.subtitle}
            </CardDescription>

            <CardFooter className="flex justify-end gap-10 !p-0">
              <Button variant="ghost" className="text-uaq-danger" onClick={onClose}>
                {texts.cancel}
              </Button>
              <Button variant="ghost" className="text-success" onClick={handleConfirm}>
                {texts.confirm}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
