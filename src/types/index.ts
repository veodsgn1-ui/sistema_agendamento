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
  anamnesisData?: Record<string, string>;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  color: string;
  description?: string;
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

export interface AnamnesisField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface PublicPageConfig {
  enabled: boolean;
  slug: string;
  companyName: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  aboutText: string;
  address: string;
  phone: string;
  services: PublicService[];
  anamnesisEnabled: boolean;
  anamnesisTitle: string;
  anamnesisFields: AnamnesisField[];
  businessHours: BusinessHours;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

export interface PublicService {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  enabled: boolean;
}

export interface BusinessHours {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  highlighted?: boolean;
}

export type ViewMode = 'dashboard' | 'schedule' | 'appointments' | 'collaborators' | 'plans' | 'settings' | 'public-page';
