'use client';

// Se corrige la ruta de importación utilizando el alias del proyecto
import RejectModalTemplate, { ModalTexts } from "@/components/ui/modal/RejectModalTemplate";

type RejectUserModalProps = {
  open?: boolean;
  onClose: () => void;
  onConfirm: (data: { reason: string }) => void;
  userName: string;
  email?: string;
};

export const TEXTS: ModalTexts = {
  title: 'RECHAZAR CUENTA DE USUARIO',
  subtitle: 'Al rechazar la cuenta, el usuario no podrá postularse a vacantes internas hasta corregir su información.',
  content: '',
  cancel: 'Cancelar',
  confirm: 'Rechazar cuenta',
};

export default function RejectUserModal({
  onClose,
  onConfirm,
  open = true,
  userName,
  email,
}: RejectUserModalProps) {
  return (
    <RejectModalTemplate
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      texts={TEXTS}
      description="¿Por qué no se aprobó la cuenta de este usuario? Por favor, especifica el motivo (ej. documentos ilegibles, información falsa, etc.)"
      vacancy={{
        companyName: userName,
        roleTitle: email || 'Sin correo asociado', 
      }}
    />
  );
}