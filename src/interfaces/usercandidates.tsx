export interface UserCandidate {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  address: string;
  cellPhone: string;
  academicLevel: string;
  degree?: string; // Opcional
  jobExperience: string;
  desiredPosition: string;
  registeredAt: string;
  status: 'REVISION' | 'RECHAZADO' | 'ACTIVO' | 'INACTIVO';
}

export const listAcademicLevelOptions = [
  { label: 'Preescolar', value: 'PREESCOLAR' },
  { label: 'Primaria', value: 'PRIMARIA' },
  { label: 'Secundaria', value: 'SECUNDARIA' },
  { label: 'Bachillerato General', value: 'BACHILLERATO_GENERAL' },
  { label: 'Carrera Técnica', value: 'CARRERA_TECNICA' },
  { label: 'Licenciatura', value: 'LICENCIATURA' },
  { label: 'Ingeniería', value: 'INGENIERIA' },
  { label: 'Maestría', value: 'MAESTRIA' },
  { label: 'Doctorado', value: 'DOCTORADO' },
  { label: 'Posdoctorado', value: 'POSDOCTORADO' },
];