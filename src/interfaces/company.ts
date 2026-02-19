import { sector } from '../constants/companyData';
export type Company = {
  id: string;
  name: string;
  representative: string;
  emailContact: string;
  phoneContact: string;
  createdAt: string;
  status: 'REVISION' | 'APROBADA' | 'RECHAZADA';
  sector?: typeof sector[number];
};


export interface CompanyC {
  id: string;
  tradeName: string;
  legalName: string;
  zipCode: string; 
  street: string;
  state: string;
  district: string;
  streetNumber: string;
  municipality: string;
  country: string;
  investmentCountry: string;
  totalWorkers: number;
  rfc: string;
  description: string;
  companyEmail: string;
  workSector: string; 
  registeredAt: string; 
  status: 'REVISION' | 'ACTIVA' | 'INACTIVA' | 'RECHAZADA'; 
  comment: string | null;
  LinkerId: string | null; 
}

export interface CompanyAccount {
  id: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
  landlinePhone: string;
  email: string;
  jobTitle: string;
}

export interface CompanyData {
  Company: CompanyC;
  CompanyAccount: CompanyAccount;
}
