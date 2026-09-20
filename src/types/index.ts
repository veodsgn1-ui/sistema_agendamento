export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  date: string;
  time: string;
  duration: number; // in minutes
  notes: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  whatsappSent: boolean;
  calendarSynced: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  color: string;
}

export type ViewMode = 'dashboard' | 'schedule' | 'appointments' | 'settings';
