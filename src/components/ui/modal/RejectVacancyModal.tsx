'use client';


import RejectModalTemplate, { ModalTexts } from "./RejectModalTemplate";

type RejectVacancyModalProps = {
  open?: boolean;
  onClose: () => void;
  onConfirm: (data: { reason: string }) => void;
  companyName: string;
  roleTitle?: string;
};

export const TEXTS: ModalTexts = {
    title: 'RECHAZAR SOLICITUD',
    subtitle: '',
    content: '',
    cancel: 'Cancelar',
    confirm: 'Rechazar vacante',
  };

export default function RejectVacancyModal({
  onClose,
  onConfirm,
  open = true,
  companyName,
  roleTitle,
}: RejectVacancyModalProps) {
  return (
    <RejectModalTemplate
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      texts={TEXTS}
      description="¿Por qué no se aprobó esta vacante?"
       vacancy={{
        companyName,
        roleTitle, 
      }}
    />
  );
}
