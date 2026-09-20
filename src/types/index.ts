export type AvailabilityStatus = 'AVAILABLE' | 'ON_REQUEST' | 'LIMITED' | 'COMING_SOON';

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'IN_REVIEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';

export interface Country {
  id: number;
  name: string;
  slug: string;
  iso_code: string;
  flag: string;
  flag_emoji?: string;
  code?: string;
  region: string;
  description: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
  sort_order: number;
}

export interface City {
  id: number;
  country_id: number;
  name: string;
  slug: string;
  region: string;
  description: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
  sort_order: number;
  country_name?: string;
  active_locations_count?: number;
}

export interface Location {
  id: number;
  country_id: number;
  city_id: number;
  title: string;
  slug: string;
  continent: string;
  region: string;
  description: string;
  hero_image: string;
  availability_status: AvailabilityStatus;
  last_verified_date: string;
  published: number;
  internal_notes?: string;
  country_name?: string;
  country_slug?: string;
  country_flag?: string;
  city_name?: string;
  city_slug?: string;
  services_count?: number;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  requirements: string;
  icon: string;
  featured: number;
  published: number;
  sort_order: number;
  is_active?: number;
  availability_status?: AvailabilityStatus;
}

export interface Partner {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
  category: string;
  description?: string;
  website_url?: string;
  display_order: number;
  is_featured: number;
  is_active: number;
  is_demo?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LocationServiceMapping {
  service_id: number;
  service_name: string;
  service_slug: string;
  mapping_id?: number;
  availability_status: AvailabilityStatus;
  description_override?: string;
  requirements_override?: string;
  is_assigned: number;
}

export interface Enquiry {
  id: number;
  reference_no: string;
  full_name: string;
  phone_whatsapp: string;
  email?: string;
  country_city?: string;
  preferred_destination?: string;
  preferred_city?: string;
  city?: string;
  country?: string;
  treatment_specialty: string;
  expected_travel_date?: string;
  brief_requirement?: string;
  selected_service_id?: number;
  selected_service_name?: string;
  document_name?: string;
  document_path?: string;
  consent: number;
  consent_agreed?: number;
  status: EnquiryStatus;
  assigned_to_user_id?: number;
  assigned_to_name?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EnquiryHistory {
  id: number;
  enquiry_id: number;
  previous_status?: string;
  new_status?: string;
  status?: string;
  admin_user_id?: number;
  admin_user_name?: string;
  changed_by_name?: string;
  note?: string;
  notes?: string;
  created_at: string;
}

export type EnquiryStatusHistory = EnquiryHistory;

export interface AdminStats {
  total_enquiries?: number;
  totalEnquiries?: number;
  new_enquiries?: number;
  newEnquiries?: number;
  in_progress_enquiries?: number;
  completed_enquiries?: number;
  total_locations?: number;
  totalLocations?: number;
  active_services?: number;
  totalServices?: number;
  verified_reviews?: number;
  totalFaqs?: number;
  totalBlogs?: number;
  recentEnquiries?: Enquiry[];
  recentActivity?: ActivityLog[];
}

export interface FAQCategory {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
}

export interface FAQ {
  id: number;
  category_id?: number;
  question: string;
  answer: string;
  sort_order: number;
  published: number;
  category_name?: string;
  category_slug?: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Blog {
  id: number;
  category_id?: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  featured_image: string;
  published_date: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_image?: string;
  category_name?: string;
  category_slug?: string;
}

export interface Testimonial {
  id: number;
  display_name: string;
  country: string;
  destination: string;
  service_id?: number;
  service_name?: string;
  testimonial: string;
  rating?: number;
  photo?: string;
  consent_status: number;
  verified: number;
  is_demo: number;
  published: number;
  date: string;
}

export interface SocialMediaItem {
  id: number;
  platform: string;
  title: string;
  url: string;
  thumbnail_url?: string;
  description?: string;
  sort_order: number;
  is_active?: number;
}

export interface GalleryItem {
  id: number;
  category_id?: number;
  title: string;
  image: string;
  caption?: string;
  source_type: string;
  category_name?: string;
  category_slug?: string;
}

export interface SiteSettings {
  site: Record<string, string>;
  contact: Record<string, string>;
  social: Array<{ platform: string; url: string }>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role_name: string;
  role_slug: string;
  role_code?: string;
  status: string;
  last_login_at?: string;
  created_at?: string;
}

export interface ActivityLog {
  id: number;
  user_id?: number;
  user_name: string;
  action: string;
  module: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  link?: string;
  is_read: number;
  created_at: string;
}
