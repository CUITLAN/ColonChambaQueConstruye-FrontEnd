'use client';

import { useState } from 'react';
import UploadModal from '@/components/common/UploadModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string;
  token: string;
  onSuccess: () => void;
};

export default function UpdateCvModal({ open, onOpenChange, userId, token, onSuccess }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (isSaving) return;
    setError(null);
    onOpenChange(false);
  };

  const handleSave = async (files: { spanishCV: File | null }) => {
    const file = files.spanishCV;
    if (!file) return;

    setIsSaving(true);
    setError(null);

    try {
      const form = new FormData();

      
      form.append('file', file);
      const title= file.name.replace(/\.pdf$/i, '') || 'Curriculum';
      form .append('title',title)
      const res = await fetch(`/api/v1/users/${userId}/curriculum/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form, 
      });

        if (!res.ok) {
      // 👇 esto te da el error real del backend (muy útil)
      const errText = await res.text();
      throw new Error(`Upload falló (${res.status}): ${errText}`);
    }

      // opcional: si quieres usar el payload devuelto
      const result = await res.json();
      console.log('[CV UPLOAD] result:', result);

      onSuccess(); // refetch GET
      close();     // cierra modal
    } catch (e: any) {
      setError(e?.message ?? 'Error desconocido');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Actualizar Curriculum</DialogTitle>
          <DialogDescription>Sube tu nuevo CV en PDF.</DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <UploadModal onClose={close} onSave={handleSave} isSaving={isSaving} />
      </DialogContent>
    </Dialog>
  );
}
