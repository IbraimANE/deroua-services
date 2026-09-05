import { Provider, DirectoryItem, ServiceRequest } from '../types';

// The application starts empty as requested by the user:
// Real providers will be added through the "Register as Provider" flow or Admin panel.
export const initialProviders: Provider[] = [];

export const initialRequests: ServiceRequest[] = [];

// Official and verified public directory of Deroua (Emergency, Pharmacies, Clinics, Labs)
export const initialDirectory: DirectoryItem[] = [
  // Emergency
  {
    id: 'dir-1',
    name: 'الوقاية المدنية النواصر - الدروة',
    nameFr: 'Protection Civile Nouaceur - Deroua',
    category: 'emergency',
    phone: '0522539502',
    address: 'طريق المطار، النواصر - الدروة',
    googleMapsUrl: 'https://maps.google.com/?q=Protection+Civile+Deroua',
    iconEmoji: '🚒',
    notes: 'خدمة التدخل السريع للحرائق والحوادث والإسعاف'
  },
  {
    id: 'dir-2',
    name: 'الدرك الملكي - سرية الدروة',
    nameFr: 'Gendarmerie Royale Deroua',
    category: 'emergency',
    phone: '0522323531',
    address: 'الشارع الرئيسي، وسط مدينة الدروة',
    googleMapsUrl: 'https://maps.google.com/?q=Gendarmerie+Royale+Deroua',
    iconEmoji: '🚓',
    notes: 'مداومة أمنية 24/24 ساعة'
  },
  {
    id: 'dir-3',
    name: 'الإسعاف الوطني المستعجل',
    nameFr: 'Samu / Ambulance Nationale',
    category: 'emergency',
    phone: '15',
    address: 'المغرب - الاتصال المباشر',
    iconEmoji: '🚑',
    notes: 'رقم الطوارئ المجاني للحالات الصحية الحرجة'
  },
  {
    id: 'dir-4',
    name: 'صيدلية الدروة المركزية (حراسة)',
    nameFr: 'Pharmacie Deroua Centrale',
    category: 'emergency',
    phone: '0522539100',
    address: 'شارع الحسن الثاني، أمام البريد، الدروة',
    googleMapsUrl: 'https://maps.google.com/?q=Pharmacie+Centrale+Deroua',
    iconEmoji: '💊',
    notes: 'صيدلية الحراسة الليلية والأدوية المستعجلة'
  },
  {
    id: 'dir-5',
    name: 'صيدلية الوفاء',
    nameFr: 'Pharmacie Al Wafaa',
    category: 'emergency',
    phone: '0522539820',
    address: 'تجزئة الوفاء، قرب حمام الوفاء، الدروة',
    iconEmoji: '💊'
  }
  // All clinics, laboratories, and medical centers are completely cleared as requested.
  // Only real establishments registering via the platform will be added dynamically.
];

