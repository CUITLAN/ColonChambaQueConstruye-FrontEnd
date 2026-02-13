'use client';

import BaseModalTemplate, { ModalTexts } from "../ConfirmModalTemplate";


export const MODAL_CONFIRM_CHANGE_TEXTS: ModalTexts = {
  title: 'Confirmar cambios',
  subtitle: 'Al hacer esto pasaras a estado de suspensión hasta ser aprobado',
  cancel: 'Cancelar',
  confirm: 'Aceptar',
};

export default function ConfirmChangeModal({
  onClose,
  onConfirm,
  open = true,
}: { onClose: () => void; onConfirm: () => void; open?: boolean }) {
  return (
    <BaseModalTemplate
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      texts={MODAL_CONFIRM_CHANGE_TEXTS}
    />
  );
}
