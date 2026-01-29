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