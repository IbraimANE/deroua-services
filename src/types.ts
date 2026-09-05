export type UserRole = 'client' | 'provider' | 'company' | 'admin';
export type Language = 'ar' | 'fr';

export type ProviderStatus = 'pending' | 'active' | 'verified' | 'rejected';
export type RequestStatus = 'Pending' | 'accepted' | 'rejected' | 'completed';
export type DirectoryCategory = 'emergency' | 'clinic' | 'lab' | 'center';

export interface Provider {
  id: string;
  userId?: string;
  businessName: string;
  category: string;
  phone: string;
  address: string;
  quartier?: string;
  latitude?: number;
  longitude?: number;
  basePrice: number;
  status: ProviderStatus;
  isOnline: boolean;
  avatar: string;
  carteVisite?: string;
  portfolio: string[];
  rating: number;
  reviewCount: number;
  workHours?: string;
  bio?: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientLocation: string;
  providerId: string;
  providerName: string;
  category: string;
  status: RequestStatus;
  createdAt: string;
  description?: string;
  rating?: number;
  reviewText?: string;
}

export interface LabTest {
  id: string;
  name: string;
  nameFr: string;
  price: number;
  duration?: string;
  category?: string;
}

export interface DirectoryItem {
  id: string;
  name: string;
  nameFr?: string;
  category: DirectoryCategory;
  phone: string;
  address: string;
  googleMapsUrl?: string;
  iconEmoji: string;
  specialty?: string;
  specialtyFr?: string;
  doctorName?: string;
  labTests?: LabTest[];
  notes?: string;
  workHours?: string;
  homeSampling?: boolean;
  email?: string;
  password?: string;
  createdAt?: string;
}
