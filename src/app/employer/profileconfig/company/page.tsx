'use client';

import React from 'react';
import TitleSection from '@/components/common/TitleSection';
import { ConfigRow } from '@/components/settings/ConfigRow';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { sector as sectorOptions } from '@/constants/companyData';
import { Buildings } from '@solar-icons/react';
import { Button } from '@/components/ui/button';
import { useEmployerProfile } from '../layout';
import { useCompanyForm } from '@/components/forms/hooks/useCompanyForm';
import ModalNoticeReview from '@/components/ui/modal/employer/ModalNoticeReview';
import ConfirmChangeModal from '@/components/ui/modal/employer/ConfirmChangeModal';

export default function CompanyPage() {
  const [showConfirmModalFiscales, setShowConfirmModalFiscales] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
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

  const [showModal, setShowModal] = React.useState(false);
  const [showModalFiscales, setShowModalFiscales] = React.useState(false);

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleEditFiscalesClick = () => {
    setShowModalFiscales(true);
  };

  const handleModalClose = (confirmEdit = false) => {
    setShowModal(false);
    if (confirmEdit) {
      setIsEditingInfo(true);
    }
  };

  const handleModalFiscalesClose = (confirmEdit = false) => {
    setShowModalFiscales(false);
    if (confirmEdit) {
      setIsEditingFiscales(true);
    }
  };

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
    <div className="mr-20 space-y-6 p-4 md:p-6 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 h-screen flex items-center justify-center bg-black/50">
          <ModalNoticeReview
            open={showModal}
            onClose={() => handleModalClose(false)}
            onConfirm={() => handleModalClose(true)}
          />
        </div>
      )}
      {showModalFiscales && (
        <div className="fixed inset-0 z-50 h-screen flex items-center justify-center bg-black/50">
          <ModalNoticeReview
            open={showModalFiscales}
            onClose={() => handleModalFiscalesClose(false)}
            onConfirm={() => handleModalFiscalesClose(true)}
          />
        </div>
      )}
      <TitleSection sections={sectionConfig} currentSection="profile" />

      <div className="rounded-lg border border-zinc-300 shadow-sm bg-white">
        <ConfigRow
          title="Información de la empresa"
          valueinput=""
          isTitle={true}
          isEditable={!isEditingInfo}
          editInput={false}
          onEditClick={handleEditClick}
        />

        <div className="w-full">
          {isEditingInfo ? (
            <div className="px-2">
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
            <div className="px-2">
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
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center min-w-0">
                  <p className="min-w-[150px] py-3">Sector de trabajo</p>
                  <div className="flex-1">
                    <Select
                      value={form.sectorTrabajo || ''}
                      onValueChange={(v) => handleChange('sectorTrabajo', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un sector" />
                      </SelectTrigger>
                      <SelectContent className='max-h-60 overflow-y-auto'>
                        {sectorOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.info.sectorTrabajo && (
                      <p className="mt-1 text-sm text-red-600">{errors.info.sectorTrabajo}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ReadOnlyBlockRow label="Sector de trabajo" value={form.sectorTrabajo} />
          )}
        </div>

        <div className=''>
          <ReadOnlyBlockRow label="Correo electrónico" value={form.correoContacto} />
        </div>

        <div className="w-full">
          {isEditingInfo ? (
            <div className="px-2">
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
            <div className="px-2">
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
            <div className="px-2">
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


        {showConfirmModal && (
          <div className="fixed inset-0 z-50 h-screen flex items-center justify-center bg-black/50">
            <ConfirmChangeModal
              open={showConfirmModal}
              onClose={() => setShowConfirmModal(false)}
              onConfirm={() => {
                setShowConfirmModal(false);
                handleSaveInfo();
              }}
            />
          </div>
        )}
      </div>

      <div className="rounded-lg border border-zinc-300 shadow-sm mt-6 bg-white">
        <ConfigRow
          title="Datos fiscales"
          valueinput=""
          isTitle={true}
          isEditable={!isEditingFiscales}
          editInput={false}
          onEditClick={handleEditFiscalesClick}
        />

        <div className="w-full">
          {isEditingFiscales ? (
            <div className="px-2">
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
            <div className="px-2">
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

    </div>
    {(isEditingInfo || isEditingFiscales) && (
      <div className="flex justify-end px-6 py-8">
        <Button variant="primary" onClick={() => setShowConfirmModal(true)}>
          Guardar Cambios
        </Button>
      </div>
    )}

    {showConfirmModal && (
      <div className="fixed inset-0 z-50 h-screen flex items-center justify-center bg-black/50">
        <ConfirmChangeModal
          open={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            if (isEditingInfo) handleSaveInfo();
            if (isEditingFiscales) handleSaveFiscales();
          }}
        />
      </div>
    )}

        {showConfirmModalFiscales && (
          <div className="fixed inset-0 z-50 h-screen flex items-center justify-center bg-black/50">
            <ConfirmChangeModal
              open={showConfirmModalFiscales}
              onClose={() => setShowConfirmModalFiscales(false)}
              onConfirm={() => {
                setShowConfirmModalFiscales(false);
                handleSaveFiscales();
              }}
            />
          </div>
        )}
      </div>
);}