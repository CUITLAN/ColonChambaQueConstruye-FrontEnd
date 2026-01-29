'use client';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { UploadFile } from './UploadFile';
import { UploadedFile } from './UploadedFile';

interface UploadModalProps {
  onClose: () => void;
  onSave: (files: { spanishCV: File | null}) => void;
  isSaving?:boolean
}

export type Language = 'spanish';

export const COMMON_TEXTS = {
  dropText: 'Arrastra y suelta tu curriculum aquí ó',
  buttonText: 'Selecciona un archivo',
  cancel: 'Cancelar',
  continue: 'Continuar',
};

export const LANGUAGE_SPECIFIC_TEXTS = {
  spanish: {
    tabTitle: 'CV Español',
    fileName: 'CV_ESP.pdf',
  },
};

export default function UploadModal({ onClose, onSave }: UploadModalProps) {
  const [spanishCV, setSpanishCV] = useState<File | null>(null);
  const [tabValue, setTabValue] = useState<Language>('spanish');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const onDropSpanish = useCallback((acceptedFiles: File[]) => {
    setSpanishCV(acceptedFiles[0]);
  }, []);

  const handleContinue = () => {
    onSave({ spanishCV });
    onClose();
  };

  const canContinue = !!spanishCV ;


  const handleRemove = (language: Language) => {
    setSpanishCV(null);
  };

  const handleFileChange = (language: Language, newFile: File) => {
    setSpanishCV(newFile);
  };

  const getTexts = (language: Language) => ({
    ...COMMON_TEXTS,
    ...LANGUAGE_SPECIFIC_TEXTS[language],
  });

  const renderTabContent = (language: Language) => {
    const hasFile = spanishCV;
    const file = spanishCV;
    const texts = getTexts(language);

    return (
      <TabsContent value={language}>
        <Card
          className={`flex flex-col bg-zinc-50 pt-10 ${hasFile ? 'min-h-[300px]' : 'min-h-[500px]'}`}
        >

          <CardContent className="flex flex-1 flex-col items-center justify-center py-4">
            {!hasFile ? (
              <UploadFile
                language={language}
                onDrop={onDropSpanish}
                dropText={texts.dropText}
                buttonText={texts.buttonText}
              />
            ) : (
              <UploadedFile
                file={file || new File([], texts.fileName)}
                defaultFileName={texts.fileName}
                action="upload"
                onView={() => file && window.open(URL.createObjectURL(file), '_blank')}
                onRemove={() => handleRemove(language)}
              />
            )}
          </CardContent>

          <CardFooter className="flex justify-center gap-90 pb-3">
            <Button variant="ghost" onClick={onClose}>
              {texts.cancel}
            </Button>
            <Button onClick={handleContinue} disabled={!canContinue}>
              {COMMON_TEXTS.continue}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    );
  };

  return (
    <div
      className="relative mx-auto w-full max-w-2xl shadow-md"
      onClick={(e) => e.stopPropagation()}
    >
      <Tabs value={tabValue} onValueChange={(val) => setTabValue(val as Language)}>
        {renderTabContent('spanish')}
      </Tabs>
    </div>
  );
}
