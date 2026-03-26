'use client';

import React, { useState, useEffect } from 'react';
import TitleSection from '@/components/common/TitleSection';
import { ConfigRow } from '@/components/settings/ConfigRow';
import { UserCircle } from '@solar-icons/react';
import { Button } from '@/components/ui/button';
import { useEmployerProfile } from '../layout';
import { apiService } from '@/services/api.service';
import { useRouter } from 'next/navigation';

import Alerts from '@/components/ui/Alerts';
import ConfirmChangePasswordModal from '@/components/ui/modal/ConfirmChangePasswordModal';

const DEFAULT_ERROR_MESSAGE = 'Este campo es requerido';

const PASSWORD_RULES = [
  { regex: /.{8,}/, message: 'Mínimo 8 caracteres' },
  { regex: /[A-Z]/, message: 'Requiere mayúscula' },
  { regex: /[a-z]/, message: 'Requiere minúscula' },
  { regex: /[0-9]/, message: 'Requiere número' },
] as const;

function validatePasswordLikeRegister(value: string): string | null {
  for (const rule of PASSWORD_RULES) {
    if (!rule.regex.test(value)) return rule.message;
  }
  return null;
}

export default function Page() {
  const router = useRouter();
  const { companyAccount, loading, error } = useEmployerProfile();

  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    puesto: '',
    celular: '',
    telfijo: '',
    correo: '',
    contrasena: '',
  });

  const [personalErrors, setPersonalErrors] = useState<Record<string, string>>({});
  const [accessErrors, setAccessErrors] = useState<Record<string, string>>({});

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lastPassword, setLastPassword] = useState('');

  const [alert, setAlert] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isPatchingPassword, setIsPatchingPassword] = useState(false);

  const sectionConfig = {
    profile: {
      title: 'DATOS DE ACCESO',
      icon: <UserCircle size={24} weight="Bold" />,
      description: 'Consulte la información de sus datos de acceso',
    },
  };

  const ReadOnlyRow = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex w-full items-center justify-between px-6 py-4 border-b border-zinc-100 min-h-[60px]">
      <span className="text-zinc-900 font-medium shrink-0">{label}</span>
      <span className="text-zinc-600 text-sm text-right flex-1 pl-8 break-words">
        {value || '-'}
      </span>
    </div>
  );

  useEffect(() => {
    if (!companyAccount) return;

    setForm({
      nombres: companyAccount.firstName || '',
      apellidos: companyAccount.lastName || '',
      puesto: companyAccount.jobTitle || '',
      celular: companyAccount.cellPhone || '',
      telfijo: companyAccount.landlinePhone || '',
      correo: companyAccount.email || '',
      contrasena: '',
    });
    setConfirmPassword('');
    setLastPassword('');
    setPersonalErrors({});
    setAccessErrors({});
    setAlert(null);
    setOpenConfirmModal(false);
    setIsPatchingPassword(false);
  }, [companyAccount]);

  const handleChange = (key: string, value: string) => {
    if ((key === 'celular' || key === 'telfijo') && /\D/.test(value)) {
      setPersonalErrors((e) => ({
        ...e,
        [key]: 'Solo se permiten números',
      }));
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
    setPersonalErrors((e) => ({ ...e, [key]: '' }));
    setAccessErrors((e) => ({ ...e, [key]: '' }));
  };

  const validatePersonalFields = () => {
    const errors: Record<string, string> = {};
    const keys: (keyof typeof form)[] = [
      'nombres',
      'apellidos',
      'puesto',
      'celular',
      'telfijo',
    ];

    keys.forEach((k) => {
      const raw = form[k];
      const v = typeof raw === 'string' ? raw.trim() : raw;

      if (!v || (typeof v === 'string' && v === '')) {
        errors[k] = 'No puede quedar vacío';
      }

      if (
        (k === 'celular' || k === 'telfijo') &&
        typeof v === 'string' &&
        !/^\+?\d*$/.test(v)
      ) {
        errors[k] = 'Debe contener solo números y un "+" inicial';
      }
    });

    return errors;
  };

  const validateAccessFields = () => {
    const errors: Record<string, string> = {};

    const correo = form.correo.trim();
    const newPass = form.contrasena.trim();
    const confirm = confirmPassword.trim();
    const last = lastPassword.trim();

    if (!correo) {
      errors.correo = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      errors.correo = 'Correo inválido';
    }

    if (!last) errors.lastPassword = DEFAULT_ERROR_MESSAGE;

    if (!newPass) {
      errors.contrasena = DEFAULT_ERROR_MESSAGE;
    } else {
      const msg = validatePasswordLikeRegister(newPass);
      if (msg) errors.contrasena = msg;
    }

    if (!confirm) {
      errors.confirmPassword = DEFAULT_ERROR_MESSAGE;
    } else {
      const msg = validatePasswordLikeRegister(confirm);
      if (msg) errors.confirmPassword = msg;
    }

    if (!errors.contrasena && !errors.confirmPassword && newPass !== confirm) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!errors.contrasena && last && newPass && newPass === last) {
      errors.contrasena = 'La nueva contraseña no puede ser igual a la anterior';
    }

    return errors;
  };

  const patchAccount = async (payload: any) => {
    const companyId = localStorage.getItem('companyId');
    const accountId = companyAccount?.id;

    if (!companyId || !accountId) {
      console.error('Falta companyId o accountId');
      throw new Error('No se encontró companyId o accountId');
    }

    const res = await apiService.patch(
      `/companies/${companyId}/account/${accountId}`,
      payload,
    );

    if (!res) {
      throw new Error('Sin respuesta del servidor');
    }

    if (!res.ok) {
      let errText = `Error ${res.status}`;
      try {
        const errJson = await res.json();
        console.error('Error PATCH', errJson);
        errText = errJson.message || errText;
      } catch {
      }
      throw new Error(errText);
    }
  };

  const clearCompanySession = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('companyId');
      localStorage.removeItem('accountId');
    } catch {
    }
  };

  const handleSavePersonal = async () => {
    const errors = validatePersonalFields();
    if (Object.keys(errors).length > 0) {
      setPersonalErrors(errors);
      return;
    }

    const payload = {
      firstName: form.nombres.trim(),
      lastName: form.apellidos.trim(),
      jobTitle: form.puesto.trim(),
      cellPhone: form.celular.trim(),
      landlinePhone: form.telfijo.trim(),
    };

    try {
      await patchAccount(payload);
      console.log('Datos personales actualizados ');

      setForm((prev) => ({
        ...prev,
        nombres: prev.nombres.trim(),
        apellidos: prev.apellidos.trim(),
        puesto: prev.puesto.trim(),
        celular: prev.celular.trim(),
        telfijo: prev.telfijo.trim(),
      }));
      setPersonalErrors({});
      setIsEditingPersonal(false);
    } catch (err: any) {
      console.error(err);
      setPersonalErrors((prev) => ({
        ...prev,
        global: 'No se pudieron actualizar los datos personales.',
      }));
    }
  };

  const handleSaveGeneral = async () => {
    setAlert(null);

    const errors = validateAccessFields();
    if (Object.keys(errors).length > 0) {
      setAccessErrors(errors);
      return;
    }

    setAccessErrors({});
    setOpenConfirmModal(true);
  };

  const handleConfirmChangePassword = async () => {
    const payload = {
      firstName: form.nombres.trim(),
      lastName: form.apellidos.trim(),
      jobTitle: form.puesto.trim(),
      cellPhone: form.celular.trim(),
      landlinePhone: form.telfijo.trim(),
      lastPassword: lastPassword.trim(),
      newPassword: form.contrasena.trim(),
    };

    try {
      setIsPatchingPassword(true);
      await patchAccount(payload);

      clearCompanySession();
      router.replace('/login/company');
    } catch (err: any) {
      console.error(err);

      setAlert({
        type: 'error',
        message: 'Datos incorrectos, inténtalo nuevamente.',
      });

      setIsEditingGeneral(true);
    } finally {
      setIsPatchingPassword(false);
      setOpenConfirmModal(false);
    }
  };

  if (loading) {
    return (
      <div className="mr-20 space-y-6 p-4 md:p-6">
        <p>Cargando datos de acceso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mr-20 space-y-6 p-4 md:p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!companyAccount) {
    return (
      <div className="mr-20 space-y-6 p-4 md:p-6">
        <p>No se encontró información del contacto de la empresa.</p>
      </div>
    );
  }

  return (
    <div className="mr-20 space-y-6 p-4 md:p-6">
      <TitleSection sections={sectionConfig} currentSection="profile" />

    

      <div className="rounded-lg border border-zinc-300 shadow-sm">
        <ConfigRow
          title="Información general"
          valueinput=""
          isTitle={true}
          isEditable={true}
          editInput={false}
          onEditClick={() => setIsEditingPersonal(!isEditingPersonal)}
        />

        <div className="w-full">
          {isEditingPersonal ? (
            <div className="px-6">
              <ConfigRow
                title="Nombres"
                valueinput={form.nombres}
                isTitle={false}
                isEditable={true}
                editInput={true}
                onValueChange={(v) => handleChange('nombres', v)}
                externalError={personalErrors.nombres}
              />
            </div>
          ) : (
            <ReadOnlyRow label="Nombres" value={form.nombres} />
          )}
        </div>

        <div className="w-full">
          {isEditingPersonal ? (
            <div className="px-6">
              <ConfigRow
                title="Apellidos"
                valueinput={form.apellidos}
                isTitle={false}
                isEditable={true}
                editInput={true}
                onValueChange={(v) => handleChange('apellidos', v)}
                externalError={personalErrors.apellidos}
              />
            </div>
          ) : (
            <ReadOnlyRow label="Apellidos" value={form.apellidos} />
          )}
        </div>

        <div className="w-full">
          {isEditingPersonal ? (
            <div className="px-6">
              <ConfigRow
                title="Puesto"
                valueinput={form.puesto}
                isTitle={false}
                isEditable={true}
                editInput={true}
                onValueChange={(v) => handleChange('puesto', v)}
                externalError={personalErrors.puesto}
              />
            </div>
          ) : (
            <ReadOnlyRow label="Puesto" value={form.puesto} />
          )}
        </div>

        <div className="w-full">
          {isEditingPersonal ? (
            <div className="px-6">
              <ConfigRow
                title="Celular"
                valueinput={form.celular}
                isTitle={false}
                isEditable={true}
                editInput={true}
                onValueChange={(v) => handleChange('celular', v)}
                externalError={personalErrors.celular}
              />
            </div>
          ) : (
            <ReadOnlyRow label="Celular" value={form.celular} />
          )}
        </div>

        <div className="w-full">
          {isEditingPersonal ? (
            <div className="px-6">
              <ConfigRow
                title="Teléfono fijo"
                valueinput={form.telfijo}
                isTitle={false}
                isEditable={true}
                editInput={true}
                onValueChange={(v) => handleChange('telfijo', v)}
                externalError={personalErrors.telfijo}
              />
            </div>
          ) : (
            <ReadOnlyRow label="Teléfono fijo" value={form.telfijo} />
          )}
        </div>

        {personalErrors.global && (
          <p className="px-6 pb-2 text-sm text-red-600">{personalErrors.global}</p>
        )}

        {isEditingPersonal && (
          <div className="flex justify-end px-6 pb-4 pt-2">
            <Button variant="primary" onClick={handleSavePersonal}>
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-zinc-300 shadow-sm mt-6 bg-white">
        <ConfigRow
          title="Información de acceso"
          valueinput=""
          isTitle={true}
          isEditable={true}
          editInput={false}
          onEditClick={() => {
            setAlert(null);
            setAccessErrors({});
            setConfirmPassword('');
            setLastPassword('');
            setForm((p) => ({ ...p, contrasena: '' }));
            setIsEditingGeneral((s) => !s);
          }}
        />

        <ConfigRow
          title="Correo electrónico"
          valueinput={form.correo}
          placeholder="ejemplo@correo.com"
          isEditable={false}
          editInput={false}
          externalError={accessErrors.correo}
        />

        <ConfigRow
          title="Nueva contraseña"
          inputType="password"
          valueinput={form.contrasena}
          isEditable={isEditingGeneral}
          editInput={isEditingGeneral}
          onValueChange={(v) => handleChange('contrasena', v)}
          externalError={accessErrors.contrasena}
        />

        {isEditingGeneral && (
          <>
            <div className="px-6">
              <ConfigRow
                title="Repite contraseña"
                valueinput={confirmPassword}
                placeholder="Repite tu nueva contraseña"
                isEditable={true}
                editInput={true}
                onValueChange={(v) => setConfirmPassword(v)}
                inputType="password"
                externalError={accessErrors.confirmPassword}
              />
            </div>

            <div className="px-6">
              <ConfigRow
                title="Última contraseña"
                valueinput={lastPassword}
                placeholder="Tu contraseña anterior"
                isEditable={true}
                editInput={true}
                onValueChange={(v) => setLastPassword(v)}
                inputType="password"
                externalError={accessErrors.lastPassword}
              />
            </div>
          </>
        )}

        {accessErrors.global && (
          <p className="px-6 pb-2 text-sm text-red-600">{accessErrors.global}</p>
        )}

        {isEditingGeneral && (
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 px-6 pb-4 pt-2">
            <Button variant="primary" onClick={handleSaveGeneral}>
              Guardar Cambios
            </Button>
          </div>
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