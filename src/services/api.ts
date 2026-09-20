import {
  Country,
  City,
  Location,
  Service,
  Enquiry,
  EnquiryHistory,
  FAQ,
  FAQCategory,
  Blog,
  BlogCategory,
  Testimonial,
  GalleryItem,
  SiteSettings,
  User,
  ActivityLog,
  NotificationItem,
  LocationServiceMapping,
  SocialMediaItem
  ,Partner
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('pnc_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // ---------------- PUBLIC API ----------------
  async getPartners(): Promise<Partner[]> {
    const res = await fetch(`${API_BASE}/partners`);
    const json = await res.json();
    return json.data || [];
  },

  async getSocialMedia(): Promise<SocialMediaItem[]> {
    const res = await fetch(`${API_BASE}/social-media`);
    const json = await res.json();
    return json.data || [];
  },

  async search(query: string): Promise<Array<{ type: string; slug: string; name: string; description?: string }>> {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    const json = await res.json();
    return json.data || [];
  },

  async getCountries(): Promise<Country[]> {
    const res = await fetch(`${API_BASE}/countries`);
    const json = await res.json();
    return json.data || [];
  },

  async getCitiesByCountry(countryId: number): Promise<City[]> {
    const res = await fetch(`${API_BASE}/countries/${countryId}/cities`);
    const json = await res.json();
    return json.data || [];
  },

  async getLocations(): Promise<Location[]> {
    const res = await fetch(`${API_BASE}/locations`);
    const json = await res.json();
    return json.data || [];
  },

  async getLocationById(id: string | number): Promise<Location | null> {
    const res = await fetch(`${API_BASE}/locations/${id}`);
    const json = await res.json();
    return json.data || null;
  },

  async getLocationByCountryCity(country: string, city: string): Promise<Location | null> {
    const res = await fetch(`${API_BASE}/locations/${encodeURIComponent(country)}/${encodeURIComponent(city)}`);
    const json = await res.json();
    return json.data || null;
  },

  async getLocationServices(locationId: string | number): Promise<Service[]> {
    const res = await fetch(`${API_BASE}/locations/${locationId}/services`);
    const json = await res.json();
    return json.data || [];
  },

  async getServices(): Promise<Service[]> {
    const res = await fetch(`${API_BASE}/services`);
    const json = await res.json();
    return json.data || [];
  },

  async getServiceBySlug(slug: string): Promise<Service | null> {
    const res = await fetch(`${API_BASE}/services/${slug}`);
    const json = await res.json();
    return json.data || null;
  },

  async getFaqs(): Promise<{ faqs: FAQ[]; categories: FAQCategory[] }> {
    const res = await fetch(`${API_BASE}/faqs`);
    const json = await res.json();
    return json.data || { faqs: [], categories: [] };
  },

  async getBlogs(): Promise<{ blogs: Blog[]; categories: BlogCategory[] }> {
    const res = await fetch(`${API_BASE}/blogs`);
    const json = await res.json();
    return json.data || { blogs: [], categories: [] };
  },

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const res = await fetch(`${API_BASE}/blogs/${slug}`);
    const json = await res.json();
    return json.data || null;
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch(`${API_BASE}/testimonials`);
    const json = await res.json();
    return json.data || [];
  },

  async getGallery(): Promise<{ items: GalleryItem[]; categories: any[] }> {
    const res = await fetch(`${API_BASE}/gallery`);
    const json = await res.json();
    return json.data || { items: [], categories: [] };
  },

  async getSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    const json = await res.json();
    return json.data || { site: {}, contact: {}, social: [] };
  },

  async getGoogleReviews(): Promise<any> {
    const res = await fetch(`${API_BASE}/google-reviews`);
    const json = await res.json();
    return json.data || {};
  },

  async submitEnquiry(data: {
    fullName: string;
    phoneWhatsApp: string;
    email?: string;
    countryCity?: string;
    preferredDestination?: string;
    preferredCity?: string;
    treatmentSpecialty: string;
    expectedTravelDate?: string;
    briefRequirement?: string;
    selectedServiceId?: number;
    consent: boolean;
  }): Promise<{ success: boolean; message: string; data?: any; errors?: Record<string, string> }> {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // ---------------- ADMIN API ----------------
  async getAdminPartners(filters: { search?: string; category?: string; status?: string } = {}): Promise<Partner[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const res = await fetch(`${API_BASE}/admin/partners?${params.toString()}`, { headers: { ...getAuthHeader() } });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load partners');
    return json.data || [];
  },

  async getAdminSocialMedia(): Promise<SocialMediaItem[]> {
    const res = await fetch(`${API_BASE}/admin/social-media`, { headers: { ...getAuthHeader() } });
    const json = await res.json();
    return json.data || [];
  },

  async saveAdminSocialMedia(item: Partial<SocialMediaItem>): Promise<any> {
    const method = item.id ? 'PUT' : 'POST';
    const url = item.id ? `${API_BASE}/admin/social-media/${item.id}` : `${API_BASE}/admin/social-media`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(item) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to save social media');
    return json;
  },

  async deleteAdminSocialMedia(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/social-media/${id}`, { method: 'DELETE', headers: { ...getAuthHeader() } });
    return res.json();
  },

  async saveAdminPartner(partner: Partial<Partner>, logo?: File): Promise<any> {
    const form = new FormData();
    Object.entries(partner).forEach(([key, value]) => {
      if (value !== undefined && value !== null) form.append(key, String(value));
    });
    if (logo) form.append('logo', logo);
    const method = partner.id ? 'PUT' : 'POST';
    const url = partner.id ? `${API_BASE}/admin/partners/${partner.id}` : `${API_BASE}/admin/partners`;
    const res = await fetch(url, { method, headers: { ...getAuthHeader() }, body: form });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to save partner');
    return json;
  },

  async updateAdminPartnerStatus(id: number, is_active: number): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/partners/${id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ is_active })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update partner status');
    return json;
  },

  async deleteAdminPartner(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/partners/${id}`, { method: 'DELETE', headers: { ...getAuthHeader() } });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete partner');
    return json;
  },

  async reorderAdminPartners(items: Array<{ id: number; display_order: number }>): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/partners/reorder`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ items })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to reorder partners');
    return json;
  },

  async adminLogin(credentials: { email: string; password: string }): Promise<{ success: boolean; message: string; data?: { token: string; user: User }; errors?: any }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  async adminLogout(): Promise<void> {
    await fetch(`${API_BASE}/admin/logout`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    localStorage.removeItem('pnc_admin_token');
  },

  async getAdminMe(): Promise<User | null> {
    const res = await fetch(`${API_BASE}/admin/me`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  },

  async getAdminStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getAuthHeader() }
    });
    const json = await res.json();
    return json.data;
  },

  async getAdminEnquiries(status?: string, search?: string): Promise<Enquiry[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/admin/enquiries?${params.toString()}`, {
      headers: { ...getAuthHeader() }
    });
    const json = await res.json();
    return json.data || [];
  },

  async getAdminEnquiryById(id: number): Promise<{ enquiry: Enquiry; history: EnquiryHistory[] }> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
      headers: { ...getAuthHeader() }
    });
    const json = await res.json();
    return json.data;
  },

  async updateEnquiryStatus(id: number, status: string, note?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, note })
    });
    return res.json();
  },

  async updateEnquiryNotes(id: number, internalNotes: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ internalNotes })
    });
    return res.json();
  },

  // Admin Location & Service CMS
  async getAdminCountries(): Promise<Country[]> {
    const res = await fetch(`${API_BASE}/admin/countries`, { headers: { ...getAuthHeader() } });
    const json = await res.json();
    return json.data || [];
  },

  async saveCountry(country: Partial<Country>): Promise<any> {
    const method = country.id ? 'PUT' : 'POST';
    const url = country.id ? `${API_BASE}/admin/countries/${country.id}` : `${API_BASE}/admin/countries`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(country)
    });
    return res.json();
  },

  async getAdminCities(): Promise<City[]> {
    const res = await fetch(`${API_BASE}/admin/cities`, { headers: { ...getAuthHeader() } });
    const json = await res.json();
    return json.data || [];
  },

  async saveCity(city: Partial<City>): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(city)
    });
    return res.json();
  },

  async getAdminLocations(): Promise<Location[]> {
    const res = await fetch(`${API_BASE}/admin/locations`, { headers: { ...getAuthHeader() } });
    const json = await res.json();
    return json.data || [];
  },

  async saveLocation(location: Partial<Location>): Promise<any> {
    const method = location.id ? 'PUT' : 'POST';
    const url = location.id ? `${API_BASE}/admin/locations/${location.id}` : `${API_BASE}/admin/locations`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(location)
    });
    return res.json();
  },

  async getLocationServiceMappings(locationId: number): Promise<LocationServiceMapping[]> {
    const res = await fetch(`${API_BASE}/admin/locations/${locationId}/services`, {
      headers: { ...getAuthHeader() }
    });
    const json = await res.json();
    return json.data || [];
  },

  async saveLocationServiceMapping(payload: {
    location_id: number;
    service_id: number;
    availability_status: string;
    description_override?: string;
    published: boolean;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/location-services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getAdminServices(): Promise<Service[]> {
    const res = await fetch(`${API_BASE}/admin/services`, { headers: { ...getAuthHeader() } });
    const json = await res.json();
    return json.data || [];
  },

  async saveService(service: Partial<Service>): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/services/${service.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(service)
    });
    return res.json();
  },

  // Admin FAQs & Content
  async getAdminFaqs(): Promise<FAQ[]> {
    const res = await fetch(`${API_BASE}/admin/faqs`, { headers: { ...getAuthHeader() } });
    const json = await res.json();
    return json.data || [];
  },

  async saveFaq(faq: Partial<FAQ>): Promise<any> {
    const method = faq.id ? 'PUT' : 'POST';
    const url = faq.id ? `${API_BASE}/admin/faqs/${faq.id}` : `${API_BASE}/admin/faqs`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(faq)
    });
    return res.json();
  },

  async deleteFaq(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/faqs/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAdminBlogs(): Promise<Blog[]> {
    const res = await fetch(`${API_BASE}/admin/blogs`, { headers: { ...getAuthHeader() } });
    const json = await res.json();
    return json.data || [];
  },

  async saveBlog(blog: Partial<Blog>): Promise<any> {
    const method = blog.id ? 'PUT' : 'POST';
    const url = blog.id ? `${API_BASE}/admin/blogs/${blog.id}` : `${API_BASE}/admin/blogs`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(blog)
    });
    return res.json();
  },

  async getAdminTestimonials(): Promise<Testimonial[]> {
    const res = await fetch(`${API_BASE}/admin/testimonials`, { headers: { ...getAuthHeader() } });
    const json = await res.json();
    return json.data || [];
  },

  async saveTestimonial(testimonial: Partial<Testimonial>): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/testimonials/${testimonial.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(testimonial)
    });
    return res.json();
  },

  // Admin Settings
  async getAdminSettings(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/settings`, { headers: { ...getAuthHeader() } });
    const json = await res.json();
    return json.data;
  },

  async saveAdminSettings(payload: { site?: any; contact?: any; google?: any }): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/users`, { headers: { ...getAuthHeader() } });
    const json = await res.json();
    return json.data || [];
  },

  async getAdminLogs(): Promise<ActivityLog[]> {
    const res = await fetch(`${API_BASE}/admin/activity-logs`, { headers: { ...getAuthHeader() } });
    const json = await res.json();
    return json.data || [];
  },

  async getAdminNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/admin/notifications`, { headers: { ...getAuthHeader() } });
    const json = await res.json();
    return json.data || [];
  },

  // Direct Admin Action Aliases
  async getAdminEnquiryDetail(id: number): Promise<{ enquiry: Enquiry; history: EnquiryHistory[] }> {
    return this.getAdminEnquiryById(id);
  },

  async createAdminLocation(location: any): Promise<any> {
    return this.saveLocation(location);
  },

  async updateAdminLocation(id: number, location: any): Promise<any> {
    return this.saveLocation({ id, ...location });
  },

  async deleteAdminLocation(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/locations/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async updateAdminService(id: number, service: any): Promise<any> {
    return this.saveService({ id, ...service });
  },

  async createAdminFaq(faq: any): Promise<any> {
    return this.saveFaq(faq);
  },

  async updateAdminFaq(id: number, faq: any): Promise<any> {
    return this.saveFaq({ id, ...faq });
  },

  async deleteAdminFaq(id: number): Promise<any> {
    return this.deleteFaq(id);
  },

  async createAdminBlog(blog: any): Promise<any> {
    return this.saveBlog(blog);
  },

  async updateAdminBlog(id: number, blog: any): Promise<any> {
    return this.saveBlog({ id, ...blog });
  },

  async deleteAdminBlog(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/blogs/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async createAdminTestimonial(testimonial: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(testimonial)
    });
    return res.json();
  },

  async updateAdminTestimonial(id: number, testimonial: any): Promise<any> {
    return this.saveTestimonial({ id, ...testimonial });
  },

  async deleteAdminTestimonial(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async updateAdminSettings(settings: any): Promise<any> {
    return this.saveAdminSettings(settings);
  },

  async syncGoogleReviews(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/sync-google-reviews`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAdminActivityLogs(): Promise<ActivityLog[]> {
    return this.getAdminLogs();
  }
};
