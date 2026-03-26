'use client';
import { useState, useEffect } from 'react';
import TitleSection from '@/components/common/TitleSection';
import { ConfigRow } from '@/components/settings/ConfigRow';
import { UserCircle } from '@solar-icons/react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/app/store/useUserInfoStore';
import { useApplicantStore } from '@/app/store/authApplicantStore';
import { useRouter } from 'next/navigation';

import Alerts from '@/components/ui/Alerts';
import ConfirmChangePasswordModal from '@/components/ui/modal/ConfirmChangePasswordModal';

const DEFAULT_ERROR_MESSAGE = 'Este campo es requerido';

// ✅ mismas reglas que applicantSchema (register)
const PASSWORD_RULES = [
  { regex: /.{8,}/, message: 'Mínimo 8 caracteres' },
  { regex: /[A-Z]/, message: 'Requiere mayúscula' },
  { regex: /[a-z]/, message: 'Requiere minúscula' },
  { regex: /[0-9]/, message: 'Requiere número' },
];

function validatePasswordLikeRegister(value: string): string | null {
  for (const rule of PASSWORD_RULES) {
    if (!rule.regex.test(value)) return rule.message;
  }
  return null;
}

export default function Profile() {
  const router = useRouter();
  const { user, updateLocalUser } = useUserStore();

  // store auth applicant
  const { token, id: userId, clearAuth } = useApplicantStore() as any;

  // Perfil
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    fechaNacimiento: '',
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Acceso / Password (Paso 3)
  const [isEditingAccess, setIsEditingAccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lastPassword, setLastPassword] = useState(''); // UI only (tarea)
  const [accessErrors, setAccessErrors] = useState<Record<string, string>>({});
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isPatchingPassword, setIsPatchingPassword] = useState(false);

  // Alert
  const [alert, setAlert] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      nombre: user.firstName || '',
      apellido: user.lastName || '',
      direccion: user.address || '',
      fechaNacimiento: user.birthDate || '',
    });
  }, [user]);

  const sectionConfig = {
    profile: {
      icon: <UserCircle size={24} weight="Bold" />,
      title: 'INFORMACIÓN DE CONTACTO',
      description: 'Consulte y actualice su información personal',
    },
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setProfileErrors((e) => ({ ...e, [key]: '' }));
  };

  const validateProfileFields = () => {
    const errors: Record<string, string> = {};
    const requiredFields = ['nombre', 'apellido', 'direccion', 'fechaNacimiento'];

    requiredFields.forEach((k) => {
      const v = (form as any)[k];
      if (!v || (typeof v === 'string' && v.trim() === '')) {
        errors[k] = 'No puede quedar vacío';
      }
    });

    return errors;
  };

  // ✅ Validación de passwords (Paso 3) igual que register
  const validateAccessFields = () => {
    const errors: Record<string, string> = {};

    const newPass = newPassword.trim();
    const confirm = confirmPassword.trim();
    const last = lastPassword.trim();

    // La tarea pide la anterior (aunque no se mande al backend)
    if (!last) errors.lastPassword = 'Debes ingresar tu contraseña anterior';

    // new password (mismas reglas que register)
    if (!newPass) {
      errors.newPassword = DEFAULT_ERROR_MESSAGE;
    } else {
      const msg = validatePasswordLikeRegister(newPass);
      if (msg) errors.newPassword = msg;
    }

    // confirm password (mismas reglas que register)
    if (!confirm) {
      errors.confirmPassword = DEFAULT_ERROR_MESSAGE;
    } else {
      const msg = validatePasswordLikeRegister(confirm);
      if (msg) errors.confirmPassword = msg;
    }

    // coincide (igual que refine del schema)
    if (!errors.newPassword && !errors.confirmPassword && newPass !== confirm) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // recomendado: evitar que sea igual a la anterior (si tu tarea lo pide)
    if (!errors.newPassword && last && newPass && newPass === last) {
      errors.newPassword = 'La nueva contraseña no puede ser igual a la anterior';
    }

    return errors;
  };

  // PATCH perfil
  const handleSave = async () => {
    const errors = validateProfileFields();
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      setIsEditing(true);
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        firstName: form.nombre.trim(),
        lastName: form.apellido.trim(),
        address: form.direccion.trim(),
        birthDate: form.fechaNacimiento,
      };

      const response = await fetch(`/api/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Error al actualizar el perfil');

      await response.json().catch(() => null);

      updateLocalUser({
        firstName: payload.firstName,
        lastName: payload.lastName,
        address: payload.address,
        birthDate: payload.birthDate,
      });

      setProfileErrors({});
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Hubo un problema al guardar los cambios. Intente nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        nombre: user.firstName || '',
        apellido: user.lastName || '',
        direccion: user.address || '',
        fechaNacimiento: user.birthDate || '',
      });
    }
    setProfileErrors({});
    setIsEditing(false);
  };

  // Guardar en acceso -> abre modal
  const handleSaveAccess = () => {
    setAlert(null);

    const errors = validateAccessFields();
    if (Object.keys(errors).length > 0) {
      setAccessErrors(errors);
      return;
    }

    setAccessErrors({});
    setOpenConfirmModal(true);
  };

  // Confirmar modal -> PATCH password (Swagger: solo "password")
  const handleConfirmChangePassword = async () => {
    try {
      setIsPatchingPassword(true);
      setAlert(null);

      const response = await fetch(`/api/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: newPassword.trim(),
        }),
      });

      if (response.status === 200 || response.status === 201) {
        if (typeof clearAuth === 'function') clearAuth();
        router.replace('/login/applicant');
        return;
      }

      let msg = 'Datos incorrectos, inténtalo nuevamente.';
      try {
        const err = await response.json();
        if (err?.message) {
          msg = Array.isArray(err.message) ? err.message.join(' ') : String(err.message);
        }
      } catch {}

      setAlert({ type: 'error', message: msg });
    } catch (error) {
      console.error('Error changing password:', error);
      setAlert({ type: 'error', message: 'Datos incorrectos, inténtalo nuevamente.' });
    } finally {
      setIsPatchingPassword(false);
      setOpenConfirmModal(false);
    }
  };

  const handleCancelAccess = () => {
    setAlert(null);
    setAccessErrors({});
    setNewPassword('');
    setConfirmPassword('');
    setLastPassword('');
    setIsEditingAccess(false);
  };

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        <div className="animate-pulse">Cargando información...</div>
      </div>
    );
  }

  return (
    <div className="mr-20 space-y-6 p-4 md:p-6">
      <TitleSection sections={sectionConfig} currentSection="profile" />

      {alert && (
        <div className="px-1">
          <Alerts type={alert.type} message={alert.message} />
        </div>
      )}

      {/* PERFIL */}
      <div className="rounded-lg border border-zinc-300 shadow-sm">
        <ConfigRow
          title="Perfil"
          valueinput=""
          isTitle={true}
          placeholder=""
          isEditable={true}
          editInput={false}
          onEditClick={() => {
            if (isEditing) handleCancel();
            else setIsEditing(true);
          }}
        />

        <div className="px-6">
          <ConfigRow
            title="Nombre"
            valueinput={form.nombre}
            placeholder="Contenido"
            isEditable={isEditing}
            editInput={isEditing}
            onValueChange={(v) => handleChange('nombre', v)}
            externalError={profileErrors.nombre}
          />
        </div>

        <div className="px-6">
          <ConfigRow
            title="Apellido"
            valueinput={form.apellido}
            placeholder="Contenido"
            isEditable={isEditing}
            editInput={isEditing}
            onValueChange={(v) => handleChange('apellido', v)}
            externalError={profileErrors.apellido}
          />
        </div>

        <div className="px-6">
          <ConfigRow
            title="Dirección"
            valueinput={form.direccion}
            placeholder="Contenido"
            isEditable={isEditing}
            editInput={isEditing}
            onValueChange={(v) => handleChange('direccion', v)}
            externalError={profileErrors.direccion}
          />
        </div>

        <div className="px-6">
          <ConfigRow
            title="Fecha de nacimiento"
            valueinput={form.fechaNacimiento}
            placeholder="Contenido"
            isEditable={isEditing}
            editInput={false}
            onValueChange={(v) => handleChange('fechaNacimiento', v)}
            externalError={profileErrors.fechaNacimiento}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 px-6 py-4">
            <Button variant="primary" onClick={handleCancel} disabled={isSaving}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        )}
      </div>

      {/* ACCESO */}
      <div className="rounded-lg border border-zinc-300 shadow-sm">
        <ConfigRow
          title="Información de acceso"
          valueinput=""
          isTitle={true}
          placeholder=""
          isEditable={true}
          editInput={false}
          onEditClick={() => {
            setAlert(null);
            setAccessErrors({});
            setNewPassword('');
            setConfirmPassword('');
            setLastPassword('');
            setIsEditingAccess((s) => !s);
          }}
        />

        <div className="px-6">
          <ConfigRow
            title="Nueva contraseña"
            inputType="password"
            valueinput={newPassword}
            placeholder="Nueva contraseña"
            isEditable={isEditingAccess}
            editInput={isEditingAccess}
            onValueChange={(v) => setNewPassword(v)}
            externalError={accessErrors.newPassword}
          />
        </div>

        {isEditingAccess && (
          <>
            <div className="px-6">
              <ConfigRow
                title="Repite contraseña"
                inputType="password"
                valueinput={confirmPassword}
                placeholder="Repite la nueva contraseña"
                isEditable={true}
                editInput={true}
                onValueChange={(v) => setConfirmPassword(v)}
                externalError={accessErrors.confirmPassword}
              />
            </div>

            <div className="px-6">
              <ConfigRow
                title="Última contraseña"
                inputType="password"
                valueinput={lastPassword}
                placeholder="Tu contraseña anterior"
                isEditable={true}
                editInput={true}
                onValueChange={(v) => setLastPassword(v)}
                externalError={accessErrors.lastPassword}
              />
            </div>

            <div className="flex justify-end gap-3 px-6 py-4">
              <Button variant="primary" onClick={handleCancelAccess} disabled={isPatchingPassword}>
                Cancelar
              </Button>

              <Button variant="primary" onClick={handleSaveAccess} disabled={isPatchingPassword}>
                {isPatchingPassword ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </>
        )}
      </div>

      <ConfirmChangePasswordModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={handleConfirmChangePassword}
      />
    </div>
  );
}
