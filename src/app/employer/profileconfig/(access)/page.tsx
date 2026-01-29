'use client';

import React from 'react';
import TitleSection from '@/components/common/TitleSection';
import { ConfigRow } from '@/components/settings/ConfigRow';
import { UserCircle } from '@solar-icons/react';
import { Button } from '@/components/ui/button';
import { useEmployerProfile } from '../layout';
import { useAccountForm } from '@/components/forms/hooks/useCompanyData';

export default function Page() {
  const { companyAccount, loading, error } = useEmployerProfile();

  const {
    form,
    errors,
    isEditingPersonal,
    setIsEditingPersonal,
    isEditingGeneral,
    setIsEditingGeneral,
    confirmPassword,
    setConfirmPassword,
    lastPassword,
    setLastPassword,
    handleChange,
    handleSavePersonal,
    handleSaveGeneral
  } = useAccountForm(companyAccount);

  const ReadOnlyRow = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex w-full items-center justify-between px-6 py-4 border-b border-zinc-100 min-h-[60px]">
      <span className="text-zinc-900 font-medium shrink-0">{label}</span>
      <span className="text-zinc-600 text-sm text-right flex-1 pl-8 break-words">
        {value || '-'}
      </span>
    </div>
  );

  const sectionConfig = {
    profile: {
      title: 'DATOS DE ACCESO',
      icon: <UserCircle size={24} weight="Bold" />,
      description: 'Consulte la información de sus datos de acceso',
    },
  };

  if (loading) return <div className="p-6">Cargando datos...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!companyAccount) return <div className="p-6">No se encontró información.</div>;

  return (
    <div className="mr-20 space-y-6 p-4 md:p-6">
      <TitleSection sections={sectionConfig} currentSection="profile" />

      
      <div className="rounded-lg border border-zinc-300 shadow-sm bg-white">
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
                    externalError={errors.personal.nombres}
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
                    externalError={errors.personal.apellidos}
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
                    externalError={errors.personal.puesto}
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
                    externalError={errors.personal.celular}
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
                    externalError={errors.personal.telfijo}
                    />
                </div>
            ) : (
                <ReadOnlyRow label="Teléfono fijo" value={form.telfijo} />
            )}
        </div>

        {errors.personal.global && (
          <p className="px-6 pb-2 text-sm text-red-600">{errors.personal.global}</p>
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
            setIsEditingGeneral(!isEditingGeneral);
          }}
        />

        <ReadOnlyRow label="Correo electrónico" value={form.correo} />

        <div className="px-6">
          <ConfigRow
            title="Contraseña"
            inputType="password"
            valueinput={form.contrasena}
            isEditable={isEditingGeneral}
            editInput={isEditingGeneral}
            placeholder={isEditingGeneral ? "" : "********"} 
            onValueChange={(v) => handleChange('contrasena', v)}
            externalError={errors.access.contrasena}
          />
        </div>

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
                externalError={errors.access.confirmPassword}
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
                externalError={errors.access.lastPassword}
                />
            </div>
          </>
        )}

        {errors.access.global && (
          <p className="px-6 pb-2 text-sm text-red-600">{errors.access.global}</p>
        )}

        {isEditingGeneral && (
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 px-6 pb-4 pt-2">
            <Button variant="primary" onClick={handleSaveGeneral}>
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}