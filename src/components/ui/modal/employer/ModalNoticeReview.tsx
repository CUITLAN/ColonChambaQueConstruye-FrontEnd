'use client';

import BaseModalTemplate, { ModalTexts } from "../ConfirmModalTemplate";


export const MODAL_NOTICE_REVIEW_TEXTS: ModalTexts = {
  title: 'Cambiar datos',
  subtitle: 'Al hacer esto se deberá de solicitar una nueva revisión y la cuenta estara en reposo hasta ser aprobada',
  cancel: 'Cancelar',
  confirm: 'Aceptar',
};

export default function ModalNoticeReview({
  onClose,
  onConfirm,
  open = true,
}: { onClose: () => void; onConfirm: () => void; open?: boolean }) {
  return (
    <BaseModalTemplate
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      texts={MODAL_NOTICE_REVIEW_TEXTS}
    />
  );
}
