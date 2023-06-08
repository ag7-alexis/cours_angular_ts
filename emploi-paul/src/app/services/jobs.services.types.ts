export interface JobProfessionsResponse {
  metiers: string[];
}

export interface JobProfessionDetails {
  label: string;
  romes: string[];
  rncps: string[];
  type: string;
}

export interface JobProfessionResponse {
  labelsAndRomes: JobProfessionDetails[];
}

export interface JobOffersResponse {
  peJobs: PeJobs;
  lbaCompanies: LbaCompanies;
  matchas: Matchas;
}

export interface PeJobs {
  results: JobOffer[];
}

export interface JobOffer {
  title: string;
  ideaType: string;
  url: string;
  job: Job;
  contact: Contact;
  place: Place;
  company: Company;
  romes: Rome[];
}

export interface Job {
  id: string;
  creationDate: string;
  jobStartDate: string;
  description: string;
  contractType: string;
  contractDescription: string;
  duration: string;
}

export interface Contact {
  email: string;
  name: string;
  phone: string;
  info: string;
}

export interface Place {
  distance: number;
  fullAddress: string;
  latitude: number;
  longitude: string;
  city: string;
  address: string;
  cedex: any;
  zipCode: string;
  insee: any;
  departementNumber: string;
  region: string;
}

export interface Company {
  name: string;
  siret: string;
  size: string;
  logo: string;
  description: string;
  socialNetwork: string;
  url: string;
  id: string;
  uai: string;
  mandataire: boolean;
  headquarter: Headquarter;
}

export interface Headquarter {
  name: string;
  id: string;
  uai: string;
  type: string;
  hasConvention: string;
  place: Place;
}

export interface Rome {
  code: string;
  label: string;
}

export interface LbaCompanies {
  results: JobOffer[];
}

export interface Naf {
  code: string;
  label: string;
}

export interface Matchas {
  results: JobOffer[];
}

export interface SavedJobOffer {
  id: string | undefined;
  jobOffer: JobOffer;
  commentary: string;
  userUid: string;
}
