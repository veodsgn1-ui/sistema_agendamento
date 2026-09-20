export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  notes: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  whatsappSent: boolean;
  calendarSynced: boolean;
  createdAt: string;
  collaboratorId?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  color: string;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'collaborator' | 'viewer';
  avatar?: string;
  createdAt: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  companyName: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  highlighted?: boolean;
}

export type ViewMode = 'dashboard' | 'schedule' | 'appointments' | 'collaborators' | 'plans' | 'settings';
