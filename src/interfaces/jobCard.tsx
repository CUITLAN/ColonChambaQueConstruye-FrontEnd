export interface BackendVacancyItem {
  Vacancy: {
    id: string;
    name: string;
    location: string;
    description: string;
    salary: {
      coin: string;
      min: number;
      max: number;
    };
    numberOpenings: number;
    workShift: string;
    modality: string;
    createdAt: string;
    status: string; 
    companyStatus: string;
    additionalInformation?: string;
    benefits?: string;
    businessSector?: string;     
    requiredDegree?: string;      
    experience?: string;          
    gender?: string | null;       
    ageRange?: [number, number];  
  };
  Company: {
    id: string;
    tradeName: string;
    legalName: string;
    email?: string;
    phone?: string;
  };
}

export interface BackendVacancyResponse {
  statusCode: number;
  message: string;
  data: {
    vacancies: BackendVacancyItem[];
    total: number;
  };
}

export type VacancyStatus = 'ABIERTA' | 'APROBADA' | 'CERRADA' | 'INACTIVA' | 'RECHAZADA' | 'REVISION';

export interface CompanyDetails {
  legalName?: string;
  rfc?: string;
  street?: string;
  streetNumber?: string;
  district?: string;
  municipality?: string;
  workSector?: string;
  companyEmail?: string;
  cellPhone?: string;
  landlinePhone?: string;
}

{/**Checar esta interfaz */}
export interface JobCardProps {
  id: string;
  status: VacancyStatus;
  title: string;
  company: string;
  location: string;
  description: string;
  salaryRange: string;
  schedule: string;
  modality: string;
  logoUrl?: string;
  information?: string;
  createdAt: string;
  sector: string;
  
  numberOfPositions: number;
  BenefitsSection: string;
  degree: string;
  AdditionalInformation?: string;
  gender: string;
  ageRange: {
    min: number;
    max: number;
  };
  RequiredExperience?: string;
  
  cellPhone: string;
  email: string;

  companyDetails?: CompanyDetails;
}

export interface VacancyDetailResponse {
  Vacancy: {
    id: string;
    name: string;
    businessSector: string;
    modality: string;
    location: string;
    numberOpenings: number;
    description: string;
    experience: string;
    gender: string | null;
    ageRange: [number, number];
    requiredDegree: string;
    salary: {
      coin: string;
      min: number;
      max: number;
    };
    benefits: string;
    workingDay: string[];
    workShift: string;
    workSchedule: [string, string];
    additionalInformation: string;
    status: string;
    companyStatus: string;
    checkedAt: string;
    CompanyId: string;
  };
  CompanyAccount: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    landlinePhone: string;
    cellPhone: string;
  };
  Company: {
    id: string;
    legalName: string;
    tradeName: string;
  };
}
