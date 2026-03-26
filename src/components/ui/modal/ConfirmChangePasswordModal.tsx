'use client';

import BaseModalTemplate, { ModalTexts } from './ConfirmModalTemplate';

type ConfirmChangePasswordModalProps = {
  open?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const TEXTS: ModalTexts = {
  title: 'CAMBIAR CONTRASEÑA',
  subtitle: '¿Estás seguro que quieres cambiar la contraseña?',
  cancel: 'Cancelar',
  confirm: 'Aceptar',
};

export default function ConfirmChangePasswordModal({
  open = true,
  onClose,
  onConfirm,
}: ConfirmChangePasswordModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop (oscurecer pantalla) */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Contenido del modal */}
      <div className="relative z-10">
        <BaseModalTemplate
          open={open}
          onClose={onClose}
          onConfirm={onConfirm}
          texts={TEXTS}
        />
      </div>
    </div>
  );
}
