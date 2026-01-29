import { useState, useEffect } from 'react';
import { apiService } from '@/services/api.service';

export const useAccountForm = (companyAccount: any) => {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [lastPassword, setLastPassword] = useState('');

  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    puesto: '',
    celular: '',
    telfijo: '',
    correo: '',
    contrasena: '', 
  });

  const [errors, setErrors] = useState<{ personal: Record<string, string>, access: Record<string, string> }>({
    personal: {},
    access: {}
  });

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
    setErrors({ personal: {}, access: {} });
  }, [companyAccount]);

  const handleChange = (key: string, value: string) => {
    if ((key === 'celular' || key === 'telfijo') && /\D/.test(value)) {
       setErrors(prev => ({
         ...prev,
         personal: { ...prev.personal, [key]: 'Solo se permiten números' }
       }));
       return;
    }

    setForm((prev) => ({ ...prev, [key]: value }));
    
    setErrors(prev => ({
      personal: { ...prev.personal, [key]: '' },
      access: { ...prev.access, [key]: '' }
    }));
  };

  const validatePersonalFields = () => {
    const newErrors: Record<string, string> = {};
    const keys = ['nombres', 'apellidos', 'puesto', 'celular', 'telfijo'];

    keys.forEach((k) => {
      // @ts-ignore
      const val = form[k];
      const v = typeof val === 'string' ? val.trim() : val;

      if (!v) {
        newErrors[k] = 'No puede quedar vacío';
      }

      if ((k === 'celular' || k === 'telfijo') && v && !/^\+?\d*$/.test(v)) {
        newErrors[k] = 'Debe contener solo números (opcional + al inicio)';
      }
    });

    return newErrors;
  };

  const validateAccessFields = () => {
    const newErrors: Record<string, string> = {};
    const correo = form.correo.trim();
    const newPass = form.contrasena.trim();
    const confirm = confirmPassword.trim();
    const last = lastPassword.trim();

    if (!correo) newErrors.correo = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) newErrors.correo = 'Correo inválido';

    if (!newPass) newErrors.contrasena = 'La nueva contraseña es obligatoria';
    
    if (!confirm) newErrors.confirmPassword = 'Debes repetir la nueva contraseña';
    else if (newPass && confirm && newPass !== confirm) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    if (!last) newErrors.lastPassword = 'Debes ingresar tu contraseña anterior';

    return newErrors;
  };

  const sendRequest = async (payload: any) => {
    const companyId = localStorage.getItem('companyId');
    const accountId = companyAccount?.id;

    if (!companyId || !accountId) throw new Error('Falta ID de empresa o cuenta');

    const res = await apiService.patch(`/companies/${companyId}/account/${accountId}`, payload);

    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || `Error ${res.status}`);
    }
  };

  const handleSavePersonal = async () => {
    const validationErrors = validatePersonalFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(prev => ({ ...prev, personal: validationErrors }));
      return;
    }

    try {
      const payload = {
        firstName: form.nombres.trim(),
        lastName: form.apellidos.trim(),
        jobTitle: form.puesto.trim(),
        cellPhone: form.celular.trim(),
        landlinePhone: form.telfijo.trim(),
      };
      
      await sendRequest(payload);
      setIsEditingPersonal(false);
      setErrors(prev => ({ ...prev, personal: {} }));
      console.log('Datos personales actualizados');
    } catch (err: any) {
      console.error(err);
      setErrors(prev => ({
         ...prev, 
         personal: { ...prev.personal, global: 'No se pudieron actualizar los datos.' } 
      }));
    }
  };

  const handleSaveGeneral = async () => {
    const validationErrors = validateAccessFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(prev => ({ ...prev, access: validationErrors }));
      return;
    }

    try {
      const payload = {
        firstName: form.nombres.trim(),
        lastName: form.apellidos.trim(),
        jobTitle: form.puesto.trim(),
        cellPhone: form.celular.trim(),
        landlinePhone: form.telfijo.trim(),
        lastPassword: lastPassword.trim(),
        newPassword: form.contrasena.trim(),
      };

      await sendRequest(payload);
      
      setIsEditingGeneral(false);
      setConfirmPassword('');
      setLastPassword('');
      setErrors(prev => ({ ...prev, access: {} }));
      console.log('Datos de acceso actualizados');
    } catch (err: any) {
      console.error(err);
      setErrors(prev => ({
         ...prev, 
         access: { ...prev.access, global: err.message || 'Error al actualizar contraseña.' } 
      }));
    }
  };

  return {
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
  };
};