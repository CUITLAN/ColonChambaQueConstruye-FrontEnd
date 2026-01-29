import { useState, useEffect } from 'react';
import { apiService } from '@/services/api.service';

export const useCompanyForm = (company: any) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingFiscales, setIsEditingFiscales] = useState(false);
  
  const [form, setForm] = useState({
    nombreEmpresa: '',
    descripcion: '',
    sectorTrabajo: '',
    correoContacto: '',
    codigoPostal: '',
    pais: '',
    direccion: '',
    rfc: '',
    razonSocial: '',
  });

  const [errors, setErrors] = useState<{ info: Record<string, string>, fiscal: Record<string, string> }>({
    info: {},
    fiscal: {}
  });

  useEffect(() => {
    if (!company) return;

    setForm({
      nombreEmpresa: company.tradeName || '',
      descripcion: company.description || '',
      sectorTrabajo: company.workSector || '',
      correoContacto: company.companyEmail || '',
      codigoPostal: company.zipCode || '',
      pais: company.country || '',
      direccion: `${company.street || ''} ${company.streetNumber || ''}, ${company.district || ''}, ${company.municipality || ''}, ${company.state || ''}`,
      rfc: company.rfc || '',
      razonSocial: company.legalName || '',
    });
  }, [company]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors(prev => ({
      ...prev,
      info: { ...prev.info, [key]: '' },
      fiscal: { ...prev.fiscal, [key]: '' }
    }));
  };

  const validateFields = (keys: string[], type: 'info' | 'fiscal') => {
    const newErrors: Record<string, string> = {};
    keys.forEach((k) => {
      // @ts-ignore
      const val = form[k];
      if (!val || (typeof val === 'string' && !val.trim())) {
        newErrors[k] = 'No puede quedar vacío';
      }
    });
    return newErrors;
  };

  const saveData = async (type: 'info' | 'fiscal') => {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('ID de empresa no encontrado');

    const keysToValidate = type === 'info' 
      ? ['nombreEmpresa', 'descripcion', 'sectorTrabajo', 'codigoPostal', 'pais'] 
      : ['rfc', 'razonSocial'];

    const validationErrors = validateFields(keysToValidate, type);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(prev => ({ ...prev, [type]: validationErrors }));
      return false; // Falló validación
    }

    try {
      const payload = {
        tradeName: form.nombreEmpresa.trim(),
        legalName: (form.razonSocial || company.legalName || '').trim(),
        zipCode: form.codigoPostal.trim(),
        country: form.pais.trim(),
        description: form.descripcion.trim(),
        workSector: form.sectorTrabajo.trim(),
        rfc: (form.rfc || company.rfc || '').trim(),
        
        street: company.street || '',
        streetNumber: company.streetNumber || '',
        state: company.state || '',
        district: company.district || '',
        municipality: company.municipality || '',
        investmentCountry: company.investmentCountry || company.country || '',
        totalWorkers: company.totalWorkers ?? 0,
        companyEmail: company.companyEmail || '', 
      };

      console.log('Enviando PUT a /companies/', companyId, payload);
      
      const res = await apiService.put(`/companies/${companyId}`, payload);

      if (!res.ok) throw new Error('Error en la actualización');

      if (type === 'info') setIsEditingInfo(false);
      if (type === 'fiscal') setIsEditingFiscales(false);
      
      return true;

    } catch (error) {
      console.error(error);
      setErrors(prev => ({
        ...prev,
        [type]: { ...prev[type], global: 'Error al guardar los cambios.' }
      }));
      return false;
    }
  };

  return {
    form,
    errors,
    isEditingInfo,
    setIsEditingInfo,
    isEditingFiscales,
    setIsEditingFiscales,
    handleChange,
    handleSaveInfo: () => saveData('info'),
    handleSaveFiscales: () => saveData('fiscal'),
  };
};