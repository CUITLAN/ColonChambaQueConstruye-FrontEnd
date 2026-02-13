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