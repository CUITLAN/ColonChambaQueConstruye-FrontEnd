'use client';

import React from 'react';
import TitleSection from '@/components/common/TitleSection';
import { ConfigRow } from '@/components/settings/ConfigRow';
import { Buildings } from '@solar-icons/react';
import { Button } from '@/components/ui/button';
import { useEmployerProfile } from '../layout';
import { useCompanyForm } from '@/components/forms/hooks/useCompanyForm';

export default function CompanyPage() {
  const { company, loading, error: contextError } = useEmployerProfile();
  
  const {
    form,
    errors,
    isEditingInfo,
    setIsEditingInfo,
    isEditingFiscales,
    setIsEditingFiscales,
    handleChange,
    handleSaveInfo,
    handleSaveFiscales
  } = useCompanyForm(company);

  const ReadOnlyBlockRow = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex flex-col w-full px-6 py-4 border-b border-zinc-100">
      <span className="text-zinc-900 font-medium mb-2">{label}</span>
      <span className="text-zinc-600 text-sm whitespace-pre-wrap break-words w-full leading-relaxed">
        {value || '-'}
      </span>
    </div>
  );

  const sectionConfig = {
    profile: {
      icon: <Buildings size={24} weight="Bold" />,
      title: 'INFORMACIÓN EMPRESARIAL',
      description: 'Consulte y actualice la información de su empresa',
    },
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (contextError) return <div className="p-6 text-red-600">{contextError}</div>;
  if (!company) return <div className="p-6">No se encontró información.</div>;

  return (
    <div className="mr-20 space-y-6 p-4 md:p-6">
      <TitleSection sections={sectionConfig} currentSection="profile" />

      <div className="rounded-lg border border-zinc-300 shadow-sm bg-white">
        <ConfigRow
          title="Información de la empresa"
          valueinput=""
          isTitle={true}
          isEditable={true}
          editInput={false}
          onEditClick={() => setIsEditingInfo(!isEditingInfo)}
        />

        <div className="w-full">
          {isEditingInfo ? (
            <div className="px-6">
                <ConfigRow
                title="Nombre"
                valueinput={form.nombreEmpresa}
                isTitle={false}
                isEditable={true}
                editInput={true}
                onValueChange={(v) => handleChange('nombreEmpresa', v)}
                externalError={errors.info.nombreEmpresa}
                />
            </div>
          ) : (
            <ReadOnlyBlockRow label="Nombre" value={form.nombreEmpresa} />
          )}
        </div>

        <div className="w-full">
          {isEditingInfo ? (
            <div className="px-6">
                <ConfigRow
                title="Descripción"
                valueinput={form.descripcion}
                isTitle={false}
                isEditable={true}
                editInput={true}
                onValueChange={(v) => handleChange('descripcion', v)}
                externalError={errors.info.descripcion}
                />
            </div>
          ) : (
             <ReadOnlyBlockRow label="Descripción" value={form.descripcion} />
          )}
        </div>

        <div className="w-full">
            {isEditingInfo ? (
                <div className="px-6">
                    <ConfigRow
                    title="Sector de trabajo"
                    valueinput={form.sectorTrabajo}
                    isTitle={false}
                    isEditable={true}
                    editInput={true}
                    onValueChange={(v) => handleChange('sectorTrabajo', v)}
                    externalError={errors.info.sectorTrabajo}
                    />
                </div>
            ) : (
                <ReadOnlyBlockRow label="Sector de trabajo" value={form.sectorTrabajo} />
            )}
        </div>

        <ReadOnlyBlockRow label="Correo electrónico" value={form.correoContacto} />

        <div className="w-full">
            {isEditingInfo ? (
                <div className="px-6">
                    <ConfigRow
                    title="Código postal"
                    valueinput={form.codigoPostal}
                    isTitle={false}
                    isEditable={true}
                    editInput={true}
                    onValueChange={(v) => handleChange('codigoPostal', v)}
                    externalError={errors.info.codigoPostal}
                    />
                </div>
            ) : (
                <ReadOnlyBlockRow label="Código postal" value={form.codigoPostal} />
            )}
        </div>

        <div className="w-full">
            {isEditingInfo ? (
                <div className="px-6">
                    <ConfigRow
                    title="País"
                    valueinput={form.pais}
                    isTitle={false}
                    isEditable={true}
                    editInput={true}
                    onValueChange={(v) => handleChange('pais', v)}
                    externalError={errors.info.pais}
                    />
                </div>
            ) : (
                <ReadOnlyBlockRow label="País" value={form.pais} />
            )}
        </div>

        <div className="w-full">
            {isEditingInfo ? (
                <div className="px-6">
                    <ConfigRow
                    title="Dirección"
                    valueinput={form.direccion}
                    isTitle={false}
                    isEditable={true}
                    editInput={true}
                    onValueChange={(v) => handleChange('direccion', v)}
                    externalError={errors.info.direccion}
                    />
                </div>
            ) : (
                <ReadOnlyBlockRow label="Dirección" value={form.direccion} />
            )}
        </div>

        {errors.info.global && (
          <p className="px-6 py-2 text-sm text-red-600">{errors.info.global}</p>
        )}

        {isEditingInfo && (
          <div className="flex justify-end px-6 py-4">
            <Button variant="primary" onClick={handleSaveInfo}>
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-zinc-300 shadow-sm mt-6 bg-white">
        <ConfigRow
          title="Datos fiscales"
          valueinput=""
          isTitle={true}
          isEditable={true}
          editInput={false}
          onEditClick={() => setIsEditingFiscales(!isEditingFiscales)}
        />

        <div className="w-full">
            {isEditingFiscales ? (
                <div className="px-6">
                    <ConfigRow
                    title="RFC"
                    valueinput={form.rfc}
                    isTitle={false}
                    isEditable={true}
                    editInput={true}
                    onValueChange={(v) => handleChange('rfc', v)}
                    externalError={errors.fiscal.rfc}
                    />
                </div>
            ) : (
                <ReadOnlyBlockRow label="RFC" value={form.rfc} />
            )}
        </div>

        <div className="w-full">
            {isEditingFiscales ? (
                <div className="px-6">
                    <ConfigRow
                    title="Razón Social"
                    valueinput={form.razonSocial}
                    isTitle={false}
                    isEditable={true}
                    editInput={true}
                    onValueChange={(v) => handleChange('razonSocial', v)}
                    externalError={errors.fiscal.razonSocial}
                    />
                </div>
            ) : (
                <ReadOnlyBlockRow label="Razón Social" value={form.razonSocial} />
            )}
        </div>

        {errors.fiscal.global && (
          <p className="px-6 py-2 text-sm text-red-600">{errors.fiscal.global}</p>
        )}

        {isEditingFiscales && (
          <div className="flex justify-end px-6 py-4">
            <Button variant="primary" onClick={handleSaveFiscales}>
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}