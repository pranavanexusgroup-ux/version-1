import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const dbPath = path.join(process.cwd(), 'server', 'data', 'pranava_nexus.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_pnc_salt_2026').digest('hex');
}

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      module TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id INTEGER NOT NULL,
      permission_id INTEGER NOT NULL,
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
      FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
      UNIQUE(role_id, permission_id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    );

    CREATE TABLE IF NOT EXISTS countries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      iso_code TEXT NOT NULL UNIQUE,
      flag TEXT,
      region TEXT,
      description TEXT,
      image TEXT,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      region TEXT,
      description TEXT,
      image TEXT,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
      UNIQUE(country_id, slug)
    );

    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country_id INTEGER NOT NULL,
      city_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      continent TEXT,
      region TEXT,
      description TEXT,
      hero_image TEXT,
      availability_status TEXT NOT NULL DEFAULT 'AVAILABLE',
      last_verified_date DATE,
      published INTEGER DEFAULT 1,
      internal_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
      FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      short_description TEXT NOT NULL,
      full_description TEXT NOT NULL,
      requirements TEXT,
      icon TEXT,
      featured INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      logo_url TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Other Healthcare Partners',
      description TEXT,
      website_url TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_featured INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      is_demo INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(is_active);
    CREATE INDEX IF NOT EXISTS idx_partners_order ON partners(display_order);
    CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_partners_slug ON partners(slug);

    CREATE TABLE IF NOT EXISTS location_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      availability_status TEXT NOT NULL DEFAULT 'AVAILABLE',
      description_override TEXT,
      requirements_override TEXT,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
      UNIQUE(location_id, service_id)
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_no TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      phone_whatsapp TEXT NOT NULL,
      email TEXT,
      country_city TEXT,
      preferred_destination TEXT,
      preferred_city TEXT,
      treatment_specialty TEXT NOT NULL,
      expected_travel_date TEXT,
      brief_requirement TEXT,
      selected_service_id INTEGER,
      document_name TEXT,
      document_path TEXT,
      consent INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'NEW',
      assigned_to_user_id INTEGER,
      internal_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (selected_service_id) REFERENCES services(id) ON DELETE SET NULL,
      FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS enquiry_status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enquiry_id INTEGER NOT NULL,
      previous_status TEXT,
      new_status TEXT NOT NULL,
      admin_user_id INTEGER,
      admin_user_name TEXT,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS faq_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES faq_categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS blog_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      summary TEXT,
      content TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Pranava Nexus Care Team',
      featured_image TEXT,
      published_date DATE,
      status TEXT NOT NULL DEFAULT 'PUBLISHED',
      seo_title TEXT,
      seo_description TEXT,
      canonical_url TEXT,
      og_image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      display_name TEXT NOT NULL,
      country TEXT NOT NULL,
      destination TEXT NOT NULL,
      service_id INTEGER,
      testimonial TEXT NOT NULL,
      photo TEXT,
      consent_status INTEGER NOT NULL DEFAULT 1,
      verified INTEGER NOT NULL DEFAULT 1,
      is_demo INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS gallery_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS gallery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      title TEXT NOT NULL,
      image TEXT NOT NULL,
      caption TEXT,
      source_type TEXT NOT NULL DEFAULT 'OFFICIAL_FACILITY',
      consent_status INTEGER DEFAULT 1,
      published INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES gallery_categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      path TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS social_media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      thumbnail_url TEXT,
      description TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_social_media_active_order ON social_media(is_active, sort_order);
    CREATE INDEX IF NOT EXISTS idx_social_media_platform ON social_media(platform);

    CREATE TABLE IF NOT EXISTS seo_settings (
      page_key TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      meta_description TEXT NOT NULL,
      canonical_url TEXT,
      og_image TEXT,
      structured_data TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS google_business_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      place_id TEXT,
      business_profile_id TEXT,
      api_key TEXT,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      is_configured INTEGER DEFAULT 0,
      show_demo_when_unconfigured INTEGER DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT,
      action TEXT NOT NULL,
      module TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL DEFAULT 'ENQUIRY',
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default data if roles is empty
  const roleCount = (db.prepare('SELECT count(*) as count FROM roles').get() as { count: number }).count;
  if (roleCount === 0) {
    seedDatabase();
  }

  seedDemoPartners();
}

function seedDemoPartners() {
  const partnerCount = (db.prepare('SELECT count(*) as count FROM partners').get() as { count: number }).count;
  if (partnerCount > 0) return;

  const insertPartner = db.prepare(`
    INSERT INTO partners (name, slug, logo_url, category, description, website_url, display_order, is_featured, is_active, is_demo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  insertPartner.run(
    'Demo Healthcare Network',
    'demo-healthcare-network',
    '/assets/images/logo.svg',
    'Hospitals',
    'Development-only sample record. Replace this entry with a verified partner in the CMS.',
    null,
    1,
    1,
    1
  );
  insertPartner.run(
    'Demo Patient Services',
    'demo-patient-services',
    '/assets/images/logo.svg',
    'Other Healthcare Partners',
    'Development-only sample record. Replace this entry with a verified partner in the CMS.',
    null,
    2,
    0,
    1
  );
}

function seedDatabase() {
  // Roles
  db.exec(`
    INSERT INTO roles (id, name, slug, description) VALUES
    (1, 'Super Admin', 'super-admin', 'Full platform and operational access'),
    (2, 'Admin', 'admin', 'Operational access to content and enquiries'),
    (3, 'Content Manager', 'content-manager', 'Manages locations, services, blogs, FAQs, gallery, SEO'),
    (4, 'Enquiry Manager', 'enquiry-manager', 'Manages patient enquiries and travel coordination workflows');
  `);

  // Default Users
  const passAdmin = hashPassword('NexusAdmin@2026!');
  const passEnquiry = hashPassword('NexusEnquiry@2026!');
  const passContent = hashPassword('NexusContent@2026!');

  const insertUser = db.prepare('INSERT INTO users (name, email, password_hash, role_id, status) VALUES (?, ?, ?, ?, ?)');
  insertUser.run('Pranava Nexus Administrator', 'admin@pranavanexuscare.com', passAdmin, 1, 'ACTIVE');
  insertUser.run('Enquiry Care Coordinator', 'enquiries@pranavanexuscare.com', passEnquiry, 4, 'ACTIVE');
  insertUser.run('Content & SEO Editor', 'content@pranavanexuscare.com', passContent, 3, 'ACTIVE');

  // Approved 9 Services (Strictly matching document)
  const insertService = db.prepare(`
    INSERT INTO services (id, name, slug, short_description, full_description, requirements, icon, featured, published, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertService.run(
    1,
    'Treatment Enquiry Coordination',
    'treatment-enquiry-coordination',
    'Share your treatment requirement and available reports. We organise initial medical details and coordinate with healthcare providers.',
    'Share your treatment requirement and available reports. We can help organise the initial information needed for the next step and coordinate enquiries with relevant healthcare providers, where appropriate. We review requirements in a structured, transparent manner so medical teams can review accurate information.',
    'Recent medical history, doctor notes, relevant diagnostic summaries, passport copy for international travel.',
    'FileSearch',
    1,
    1,
    1
  );

  insertService.run(
    2,
    'Hospital / Doctor Appointment Coordination',
    'hospital-doctor-appointment-coordination',
    'Structured appointment requests and formal communication with accredited hospitals, medical centers, and specialists.',
    'We can assist with appointment requests and communication with hospitals, clinics or doctors, subject to their availability and acceptance of the enquiry. We facilitate clear scheduling, specialty matching, and preliminary communications while clinical decisions remain strictly between the patient and doctor.',
    'Preferred specialist field, preferred travel timeline, relevant prior prescriptions, verified patient contact.',
    'CalendarCheck2',
    1,
    1,
    2
  );

  insertService.run(
    3,
    'Medical Document Coordination',
    'medical-document-coordination',
    'Organising diagnostic records, scans, prescriptions, and health summaries for hospital review.',
    'We help organise the medical documents and information required for appointment or treatment enquiries. Patients should share only documents they are comfortable providing and should verify all medical information before submission. Documents are safely handled and shared only with authorised providers.',
    'Digital copies of reports (PDF/JPG), clear diagnostic scans, medical summary in English or translated.',
    'FileCheck',
    1,
    1,
    3
  );

  insertService.run(
    4,
    'Treatment Journey Planning',
    'treatment-journey-planning',
    'Transparent sequence planning covering initial enquiry, consultation, hospital stay, local recovery, and return.',
    'We help patients understand the practical sequence of a planned medical journey, including enquiry, appointment, travel, stay and return arrangements. This roadmap removes uncertainty and enables patients and families to make informed logistical decisions.',
    'Expected travel dates, patient mobility needs, accompanying family member details.',
    'Compass',
    1,
    1,
    4
  );

  insertService.run(
    5,
    'Travel Assistance',
    'travel-assistance',
    'Coordination of non-clinical travel logistics including flights, trains, visa documentation support, and schedules.',
    'We can coordinate non-clinical travel requirements such as travel planning, ticketing guidance, local transfers or other agreed logistical arrangements. Availability depends on the destination and the selected service.',
    'Passport validity (minimum 6 months), visa invitation letter from healthcare provider where required.',
    'Plane',
    1,
    1,
    5
  );

  insertService.run(
    6,
    'Accommodation Assistance',
    'accommodation-assistance',
    'Identifying convenient, hygienic lodging options and patient-friendly hotels near the healthcare facility.',
    'Where requested, we can assist with identifying or coordinating suitable accommodation options near the relevant healthcare facility, subject to availability and separate charges where applicable. Options range from service apartments with kitchenette to comfort partner hotels.',
    'Duration of stay requirement, dietary/cooking preferences, wheelchair accessibility requirements if any.',
    'Hotel',
    1,
    1,
    6
  );

  insertService.run(
    7,
    'Local Transfer Coordination',
    'local-transfer-coordination',
    'Airport/station pickups, scheduled hospital transit, and reliable local transportation throughout the treatment stay.',
    'Dedicated ground transfer coordination between airport, railway terminal, hotel, and hospital consultations. Ensures smooth transit without the stress of navigating an unfamiliar city during a healthcare journey.',
    'Arrival flight/train numbers, luggage count, wheelchair or special medical transport needs.',
    'Car',
    1,
    1,
    7
  );

  insertService.run(
    8,
    'Patient & Attendant Support',
    'patient-attendant-support',
    'Dedicated support for patients and accompanying family members covering local language, SIM cards, currency exchange guidance.',
    'We can help coordinate practical requirements for patients travelling with family members or attendants. Practical assistance includes local area orientation, hospital registration accompaniment where available, and continuous communication.',
    'Number of accompanying attendants, language preferences, emergency family contact details.',
    'Users',
    1,
    1,
    8
  );

  insertService.run(
    9,
    'Follow-up Coordination',
    'follow-up-coordination',
    'Post-treatment communication, tele-consultation scheduling, and coordinating subsequent check-ups with treating specialists.',
    'Where requested and available, we can help coordinate follow-up appointments or communication with the relevant healthcare provider. Medical follow-up decisions remain with the treating professional.',
    'Hospital discharge summary, treating physician contact guidelines, prescribed follow-up schedule.',
    'HeartPulse',
    1,
    1,
    9
  );

  // Countries (Only verified active destinations + carefully configured international locations)
  const insertCountry = db.prepare(`
    INSERT INTO countries (id, name, slug, iso_code, flag, region, description, image, status, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCountry.run(
    1,
    'India',
    'india',
    'IN',
    '🇮🇳',
    'South Asia',
    'Principal operations hub and premier global medical destination offering world-class super-specialty hospitals, JCI/NABH accredited centers, and experienced specialists.',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    'ACTIVE',
    1
  );

  insertCountry.run(
    2,
    'Thailand',
    'thailand',
    'TH',
    '🇹🇭',
    'Southeast Asia',
    'Renowned hub for holistic medical wellness, elective surgical coordination, and internationally accredited medical institutions.',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    'ACTIVE',
    2
  );

  insertCountry.run(
    3,
    'United Arab Emirates',
    'united-arab-emirates',
    'AE',
    '🇦🇪',
    'Middle East',
    'Strategic global crossroads with state-of-the-art healthcare cities, rapid connectivity, and multilingual healthcare services.',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    'ACTIVE',
    3
  );

  insertCountry.run(
    4,
    'Turkey',
    'turkey',
    'TR',
    '🇹🇷',
    'Eurasia',
    'Renowned destination for cosmetic procedures, dental rehabilitation, ophthalmology, and advanced specialized surgery.',
    'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80',
    'ACTIVE',
    4
  );

  // Cities
  const insertCity = db.prepare(`
    INSERT INTO cities (id, country_id, name, slug, region, description, image, status, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // India Cities
  insertCity.run(
    1,
    1,
    'Kolkata',
    'kolkata',
    'West Bengal',
    'Principal business headquarters for Pranava Nexus Care. Gateway to eastern India with renowned multi-specialty healthcare networks, oncology centers, and cardiology institutes.',
    'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1000&q=80',
    'ACTIVE',
    1
  );

  insertCity.run(
    2,
    1,
    'New Delhi',
    'new-delhi',
    'National Capital Region',
    'Premier national healthcare destination featuring major JCI-accredited super-specialty hospitals, robotic surgery centers, and transplant networks.',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    'ACTIVE',
    2
  );

  insertCity.run(
    3,
    1,
    'Chennai',
    'chennai',
    'Tamil Nadu',
    'The healthcare capital of India, world-renowned for cardiology, orthopedic joint replacements, and organ transplant coordination.',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    'ACTIVE',
    3
  );

  insertCity.run(
    4,
    1,
    'Bengaluru',
    'bengaluru',
    'Karnataka',
    'Global technology and medical research center renowned for oncology, neurosurgery, and advanced robotic procedures.',
    'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    'ACTIVE',
    4
  );

  insertCity.run(
    5,
    1,
    'Mumbai',
    'mumbai',
    'Maharashtra',
    'Financial capital and renowned medical center with premier cancer research institutes and cardiac surgery facilities.',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
    'ACTIVE',
    5
  );

  // International Cities
  insertCity.run(
    6,
    2,
    'Bangkok',
    'bangkok',
    'Central Thailand',
    'International destination offering world-class hospital hospitality, checkup packages, and cosmetic/wellness procedures.',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1000&q=80',
    'ACTIVE',
    6
  );

  insertCity.run(
    7,
    3,
    'Dubai',
    'dubai',
    'Dubai Healthcare City',
    'Futuristic healthcare hub with globally certified doctors and high-end medical infrastructure.',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
    'ACTIVE',
    7
  );

  insertCity.run(
    8,
    4,
    'Istanbul',
    'istanbul',
    'Marmara Region',
    'Cross-continental medical tourism hub known for aesthetic surgery, dental transformations, and ophthalmology.',
    'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1000&q=80',
    'ACTIVE',
    8
  );

  // Locations (The Core Location Service Engine)
  const insertLocation = db.prepare(`
    INSERT INTO locations (id, country_id, city_id, title, slug, continent, region, description, hero_image, availability_status, last_verified_date, published, internal_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertLocation.run(
    1,
    1,
    1,
    'Kolkata Healthcare Coordination Center',
    'india-kolkata',
    'Asia',
    'Eastern India Hub',
    'Our primary headquarters and operational base. Full on-ground coordination team for hospital visits, specialist appointments, and comfortable patient transit.',
    'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80',
    'AVAILABLE',
    '2026-07-15',
    1,
    'Direct office coverage; team located in Purba Barisha, Kolkata.'
  );

  insertLocation.run(
    2,
    1,
    2,
    'New Delhi Medical Travel Coordination',
    'india-new-delhi',
    'Asia',
    'Northern India',
    'Comprehensive coordination for major tertiary care centers in New Delhi and NCR with dedicated transport and patient attendant assistance.',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    'AVAILABLE',
    '2026-07-15',
    1,
    'Partner network with transport and hotel tie-ups verified.'
  );

  insertLocation.run(
    3,
    1,
    3,
    'Chennai Cardiac & Orthopedic Coordination',
    'india-chennai',
    'Asia',
    'Southern India',
    'Active coordination for southern India medical journeys with translation support and specialist appointments.',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    'AVAILABLE',
    '2026-07-15',
    1,
    'Full coordination pipeline in place.'
  );

  insertLocation.run(
    4,
    1,
    4,
    'Bengaluru Advanced Care Coordination',
    'india-bengaluru',
    'Asia',
    'Southern India',
    'Coordination for oncology, neurology, and complex robotic surgery referrals in Bengaluru.',
    'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    'AVAILABLE',
    '2026-07-15',
    1,
    'Specialist hospital coordination active.'
  );

  insertLocation.run(
    5,
    1,
    5,
    'Mumbai Medical Travel Coordination',
    'india-mumbai',
    'Asia',
    'Western India',
    'Support for cardiac care, oncology, and elective treatment coordination in Mumbai.',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    'AVAILABLE',
    '2026-07-15',
    1,
    'Western region travel coordination active.'
  );

  insertLocation.run(
    6,
    2,
    6,
    'Bangkok Medical & Wellness Coordination',
    'thailand-bangkok',
    'Asia',
    'Southeast Asia',
    'International patient coordination for health checkups, elective surgery, and rehabilitation stays in Bangkok.',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    'ON_REQUEST',
    '2026-07-15',
    1,
    'Arranged on case-by-case enquiry review.'
  );

  insertLocation.run(
    7,
    3,
    7,
    'Dubai Transit & Care Coordination',
    'uae-dubai',
    'Asia',
    'Middle East',
    'Healthcare coordination for Middle Eastern patients and transit consultation in Dubai Healthcare City.',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    'ON_REQUEST',
    '2026-07-15',
    1,
    'Arranged on case-by-case enquiry review.'
  );

  insertLocation.run(
    8,
    4,
    8,
    'Istanbul Aesthetic & Dental Coordination',
    'turkey-istanbul',
    'Europe/Asia',
    'Eurasia',
    'Selective coordination for aesthetic, dental, and specialized surgical procedures in Istanbul.',
    'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80',
    'LIMITED',
    '2026-07-15',
    1,
    'Only dental and aesthetic inquiries supported currently.'
  );

  // Map Services to Locations
  const insertLocService = db.prepare(`
    INSERT INTO location_services (location_id, service_id, availability_status, description_override, requirements_override, published)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Kolkata has all 9 services AVAILABLE
  for (let sId = 1; sId <= 9; sId++) {
    insertLocService.run(1, sId, 'AVAILABLE', null, null, 1);
  }

  // New Delhi has all 9 services AVAILABLE
  for (let sId = 1; sId <= 9; sId++) {
    insertLocService.run(2, sId, 'AVAILABLE', null, null, 1);
  }

  // Chennai has services 1 to 7 AVAILABLE, 8-9 ON_REQUEST
  for (let sId = 1; sId <= 7; sId++) {
    insertLocService.run(3, sId, 'AVAILABLE', null, null, 1);
  }
  insertLocService.run(3, 8, 'AVAILABLE', null, null, 1);
  insertLocService.run(3, 9, 'AVAILABLE', null, null, 1);

  // Bengaluru has services 1 to 9 AVAILABLE
  for (let sId = 1; sId <= 9; sId++) {
    insertLocService.run(4, sId, 'AVAILABLE', null, null, 1);
  }

  // Mumbai has services 1 to 9 AVAILABLE
  for (let sId = 1; sId <= 9; sId++) {
    insertLocService.run(5, sId, 'AVAILABLE', null, null, 1);
  }

  // Bangkok has services ON_REQUEST
  for (let sId = 1; sId <= 6; sId++) {
    insertLocService.run(6, sId, 'ON_REQUEST', 'Services arranged after case review with Thailand partner network.', null, 1);
  }

  // Dubai has services ON_REQUEST
  for (let sId = 1; sId <= 5; sId++) {
    insertLocService.run(7, sId, 'ON_REQUEST', 'Subject to UAE healthcare authority guidelines and visa clearance.', null, 1);
  }

  // Istanbul has LIMITED services
  insertLocService.run(8, 1, 'LIMITED', 'Available for dental and aesthetic procedure inquiries.', null, 1);
  insertLocService.run(8, 2, 'LIMITED', 'Subject to partner clinic availability.', null, 1);
  insertLocService.run(8, 5, 'LIMITED', 'Flight guidance provided upon request.', null, 1);
  insertLocService.run(8, 6, 'LIMITED', 'Lodging coordination near partner clinics in Istanbul.', null, 1);

  // Sample Enquiries with Reference number PNC-2026-000001
  const insertEnquiry = db.prepare(`
    INSERT INTO enquiries (id, reference_no, full_name, phone_whatsapp, email, country_city, preferred_destination, preferred_city, treatment_specialty, expected_travel_date, brief_requirement, selected_service_id, consent, status, internal_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertEnquiry.run(
    1,
    'PNC-2026-000001',
    'Rahim Al-Mansoor',
    '+971 50 123 4567',
    'rahim.almansoor@example.com',
    'Dubai, UAE',
    'India',
    'Kolkata',
    'Orthopedic Knee Replacement',
    '2026-10-15',
    'Seeking consultation with senior orthopedic specialist for bilateral knee replacement surgery. Traveling with spouse.',
    1,
    1,
    'IN_REVIEW',
    'Initial medical reports shared with senior consultant in Kolkata. Awaiting specialist feedback.'
  );

  insertEnquiry.run(
    2,
    'PNC-2026-000002',
    'Priya Sengupta',
    '+91 98301 23456',
    'priya.sengupta@example.com',
    'Guwahati, Assam',
    'India',
    'Kolkata',
    'Cardiology Consultation',
    '2026-10-05',
    'Need second opinion on angiography and stent placement for father (age 68). Require local transport and accommodation assistance near hospital.',
    2,
    1,
    'CONTACTED',
    'Spoke with daughter Priya. Arranging consultation slot for next Tuesday.'
  );

  insertEnquiry.run(
    3,
    'PNC-2026-000003',
    'David Miller',
    '+44 7700 900123',
    'david.miller@example.co.uk',
    'London, UK',
    'India',
    'New Delhi',
    'Advanced Oncology Second Opinion',
    '2026-11-01',
    'Looking for robotic surgery evaluation and medical visa invitation assistance.',
    4,
    1,
    'NEW',
    'New inquiry received from website form.'
  );

  // Enquiry status history
  const insertHistory = db.prepare(`
    INSERT INTO enquiry_status_history (enquiry_id, previous_status, new_status, admin_user_id, admin_user_name, note)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertHistory.run(1, null, 'NEW', 1, 'System', 'Enquiry submitted via website form.');
  insertHistory.run(1, 'NEW', 'CONTACTED', 2, 'Enquiry Care Coordinator', 'Reached out to patient via WhatsApp to verify medical scan availability.');
  insertHistory.run(1, 'CONTACTED', 'IN_REVIEW', 2, 'Enquiry Care Coordinator', 'Diagnostic scans forwarded to senior orthopedic team for preliminary feasibility review.');

  insertHistory.run(2, null, 'NEW', 1, 'System', 'Enquiry submitted via website form.');
  insertHistory.run(2, 'NEW', 'CONTACTED', 2, 'Enquiry Care Coordinator', 'Telephonic briefing completed. Discussed arrival date and preferred hospital area.');

  insertHistory.run(3, null, 'NEW', 1, 'System', 'Enquiry submitted via website form.');

  // FAQ Categories and FAQs from approved text (pages 17-18)
  db.exec(`
    INSERT INTO faq_categories (id, name, slug, sort_order) VALUES
    (1, 'General & Scope', 'general', 1),
    (2, 'Appointments & Hospitals', 'appointments', 2),
    (3, 'Travel & Accommodation', 'travel-accommodation', 3),
    (4, 'International & Domestic Patients', 'patients', 4);
  `);

  const insertFaq = db.prepare(`
    INSERT INTO faqs (category_id, question, answer, sort_order, published)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertFaq.run(
    1,
    'What is medical tourism?',
    'Medical tourism generally refers to travelling to another city or country to receive planned healthcare. Pranava Nexus Care focuses on coordination and practical support around the medical travel journey.',
    1,
    1
  );

  insertFaq.run(
    1,
    'Does Pranava Nexus Care provide medical treatment?',
    'Pranava Nexus Care is a medical tourism coordination business. Medical diagnosis, treatment and clinical decisions are made by qualified healthcare professionals and healthcare providers. We provide non-clinical logistical and coordination support.',
    2,
    1
  );

  insertFaq.run(
    2,
    'Can you help with hospital appointments?',
    'We can assist with appointment enquiries and coordination with relevant hospitals or doctors, subject to their availability and acceptance of the enquiry.',
    3,
    1
  );

  insertFaq.run(
    3,
    'Can you arrange travel and accommodation?',
    'We can assist with agreed non-clinical travel and accommodation coordination, subject to availability and applicable provider terms.',
    4,
    1
  );

  insertFaq.run(
    4,
    'Do you support international patients?',
    'Yes, international patient enquiries can be supported where the requested service is available. Patients must independently verify visa, immigration, travel and healthcare requirements.',
    5,
    1
  );

  insertFaq.run(
    4,
    'Do you support patients travelling within India?',
    'Yes, subject to service availability, we can help coordinate planned medical travel between Indian cities.',
    6,
    1
  );

  insertFaq.run(
    1,
    'Can you guarantee treatment results?',
    'No. Medical outcomes depend on the patient\'s condition, treatment, healthcare provider and many other factors. No treatment outcome should be guaranteed by a medical tourism coordinator.',
    7,
    1
  );

  insertFaq.run(
    2,
    'Can you recommend a doctor?',
    'We can assist with provider enquiries based on the patient\'s stated requirement where appropriate, but patients should review the qualifications, treatment options and advice provided by the healthcare professional before making a decision.',
    8,
    1
  );

  insertFaq.run(
    2,
    'What documents should I provide?',
    'Only documents relevant to the enquiry should be provided. Depending on the request, a healthcare provider may ask for reports, prescriptions, imaging records or other medical information.',
    9,
    1
  );

  insertFaq.run(
    1,
    'How much does medical tourism cost?',
    'Costs vary significantly by treatment, hospital, doctor, location, investigations, travel and accommodation. A healthcare provider should confirm clinical and treatment-related charges. Travel and coordination charges may be separate.',
    10,
    1
  );

  insertFaq.run(
    1,
    'How long does the process take?',
    'Timelines vary according to the specialty, appointment availability, required documents, travel arrangements and other circumstances.',
    11,
    1
  );

  insertFaq.run(
    1,
    'How do I start?',
    'Contact us with your treatment requirement, preferred city and expected travel date. We will explain the next coordination step.',
    12,
    1
  );

  // Blog Categories and Articles from approved content (page 25)
  db.exec(`
    INSERT INTO blog_categories (id, name, slug, sort_order) VALUES
    (1, 'Patient Guides', 'patient-guides', 1),
    (2, 'Travel Preparation', 'travel-preparation', 2),
    (3, 'City Spotlights', 'city-spotlights', 3);
  `);

  const insertBlog = db.prepare(`
    INSERT INTO blogs (category_id, title, slug, summary, content, author, featured_image, published_date, status, seo_title, seo_description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBlog.run(
    1,
    'Global Medical Tourism: A Practical Guide for First-Time Patients',
    'global-medical-tourism-practical-guide',
    'Key considerations, step-by-step preparation, and practical advice for patients planning healthcare travel abroad or across cities.',
    `Travelling for medical care is an important personal decision that requires thoughtful organisation. When planned methodically, healthcare travel allows patients to access specialized clinical expertise, modern infrastructure, and dedicated attention.

### 1. Understanding the Role of Coordination
A medical travel coordinator acts as your logistical anchor. While doctors and hospitals make all clinical judgments, coordinators help navigate appointment bookings, transport, documentation, and stay arrangements so that you can focus on healing.

### 2. Preparing Your Records
Before booking travel, assemble relevant diagnostic reports, recent blood work, imaging scans (DICOM or high-resolution PDFs), and a summary of current medications. Sharing clear, organized records helps hospital departments provide accurate preliminary feedback.

### 3. Involving Your Family
Medical travel is often smoother when accompanied by a trusted family member or attendant. Ensure travel documents, local currency, and comfortable lodging close to the medical facility are arranged in advance.

Pranava Nexus Care assists patients with transparent coordination from first enquiry to return travel.`,
    'Pranava Nexus Care Team',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80',
    '2026-07-20',
    'PUBLISHED',
    'Global Medical Tourism Guide | Pranava Nexus Care',
    'Essential guidance for first-time medical tourism patients on preparation, documentation, and care coordination.'
  );

  insertBlog.run(
    2,
    'What Medical Documents Should You Keep Ready Before Travelling?',
    'medical-documents-checklist-before-travelling',
    'A complete checklist of necessary medical summaries, diagnostic imaging, and consent forms for smooth healthcare travel.',
    `Having an organized medical dossier prevents delays and ensures treating physicians have complete context for your evaluation.

### Essential Document Checklist:
1. **Primary Physician Referral or Case Summary**: A concise note outlining history, current symptoms, and primary diagnoses.
2. **Recent Diagnostic Reports**: Pathology, blood tests, biopsy reports, and cardiac workups completed within the last 3-6 months.
3. **Imaging CDs/USB or Digital Links**: Raw MRI, CT, and X-Ray files rather than printed report text alone.
4. **Current Medication List**: Brand and generic names, exact dosages, and frequency of all current prescriptions.
5. **Identification & Travel Paperwork**: Valid passport (with minimum 6 months validity) and medical visa letters where applicable.

Keep physical copies in your carry-on luggage and retain digital backups in secure cloud storage.`,
    'Pranava Nexus Care Team',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    '2026-07-25',
    'PUBLISHED',
    'Medical Documents Checklist | Pranava Nexus Care',
    'Learn what diagnostic reports, prescriptions, and health summaries to keep ready before medical travel.'
  );

  insertBlog.run(
    3,
    'Kolkata Medical Travel Planning: What Patients Should Prepare',
    'kolkata-medical-travel-planning-guide',
    'Why Kolkata is an emerging hub for medical travel in Eastern India, covering connectivity, stay options, and hospital coordination.',
    `Kolkata serves as the principal healthcare hub for Eastern India and neighboring countries. With prestigious multi-specialty hospitals, dedicated cancer care centers, and advanced orthopedic institutes, the city offers high clinical standards coupled with affordable living costs.

### Getting to Kolkata
Netaji Subhash Chandra Bose International Airport (CCU) connects directly with major Asian, Middle Eastern, and Indian cities. Howrah and Sealdah railway stations provide comprehensive rail connectivity across India.

### Local Stay & Proximity
Most major healthcare hubs in Kolkata have verified guest houses, serviced apartments, and hotels within 1 to 3 kilometers. Pranava Nexus Care assists in identifying accommodation suited to specific patient mobility needs.

Our Kolkata headquarters at Purba Barisha provides on-the-ground support for incoming patients and their families.`,
    'Pranava Nexus Care Team',
    'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1000&q=80',
    '2026-08-01',
    'PUBLISHED',
    'Kolkata Medical Travel Planning | Pranava Nexus Care',
    'A guide for patients travelling to Kolkata for medical care, hospital appointments, and local coordination.'
  );

  // Testimonials / Patient Stories (Prompt rule: "Demo testimonials must be visibly labelled DEMO and never presented as genuine. Real patient stories require verified=1 and consent_status=1")
  const insertTestimonial = db.prepare(`
    INSERT INTO testimonials (id, display_name, country, destination, service_id, testimonial, photo, consent_status, verified, is_demo, published, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTestimonial.run(
    1,
    'Ahmed K. (Demo Patient Story)',
    'Bangladesh',
    'Kolkata, India',
    1,
    'The team helped coordinate our travel and hospital appointments in Kolkata with complete transparency. Every step from airport arrival to consultation was handled smoothly.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    1,
    1,
    1, // IS DEMO
    1,
    '2026-07-28'
  );

  insertTestimonial.run(
    2,
    'Elena R. (Demo Patient Story)',
    'United Kingdom',
    'New Delhi, India',
    4,
    'Planning medical travel from abroad can feel overwhelming, but Pranava Nexus Care made the logistical journey very structured. Having clear communication at each stage made all the difference.',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    1,
    1,
    1, // IS DEMO
    1,
    '2026-08-10'
  );

  // Gallery
  db.exec(`
    INSERT INTO gallery_categories (id, name, slug, sort_order) VALUES
    (1, 'Medical Travel Coordination', 'coordination', 1),
    (2, 'Comfort & Transit', 'comfort-transit', 2),
    (3, 'Care Journey Milestones', 'milestones', 3);
  `);

  const insertGallery = db.prepare(`
    INSERT INTO gallery_items (category_id, title, image, caption, source_type, consent_status, published, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertGallery.run(
    1,
    'Structured Document Review & Coordination',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    'Pre-departure document organization and hospital liaison.',
    'STOCK_REPRESENTATIVE',
    1,
    1,
    1
  );

  insertGallery.run(
    2,
    'Safe Ground Transit Coordination',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    'Reliable transfer between airport, hotel, and medical consultation centers.',
    'STOCK_REPRESENTATIVE',
    1,
    1,
    2
  );

  insertGallery.run(
    1,
    'Consultation Journey Guidance',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    'Facilitating clear, organized communication between patients and clinical specialists.',
    'STOCK_REPRESENTATIVE',
    1,
    1,
    3
  );

  insertGallery.run(
    2,
    'Hygienic Near-Hospital Accommodation',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'Assisting patients with clean, accessible stay options near medical facilities.',
    'STOCK_REPRESENTATIVE',
    1,
    1,
    4
  );

  // Site & Contact Settings
  const insertSiteSetting = db.prepare('INSERT INTO site_settings (key, value, description) VALUES (?, ?, ?)');
  insertSiteSetting.run('business_name', 'M/s. PRANAVA NEXUS CARE', 'Registered legal entity name');
  insertSiteSetting.run('tagline', 'One Nexus. Endless Opportunities.', 'Official corporate motto');
  insertSiteSetting.run('principal_address', '5A, Kalipada Mukherjee Road, Purba Barisha, Kolkata – 700 008, West Bengal, India', 'Registered business address');
  insertSiteSetting.run('phone', '+91 98765 43210', 'Primary telephone contact');
  insertSiteSetting.run('whatsapp', '+91 98765 43210', 'Official WhatsApp number');
  insertSiteSetting.run('email', 'info@pranavanexuscare.com', 'Primary inquiries email');
  insertSiteSetting.run('business_hours', 'Monday – Saturday: 9:30 AM – 7:00 PM IST', 'Working hours');
  insertSiteSetting.run('disclaimer_short', 'Pranava Nexus Care provides medical tourism coordination and related non-clinical support. Clinical decisions, diagnoses and treatments remain strictly with qualified healthcare providers.', 'Short regulatory disclaimer');

  // Contact Settings
  const insertContactSetting = db.prepare('INSERT INTO contact_settings (key, value) VALUES (?, ?)');
  insertContactSetting.run('address_line1', '5A, Kalipada Mukherjee Road');
  insertContactSetting.run('address_line2', 'Purba Barisha');
  insertContactSetting.run('city', 'Kolkata');
  insertContactSetting.run('state', 'West Bengal');
  insertContactSetting.run('postal_code', '700 008');
  insertContactSetting.run('country', 'India');
  insertContactSetting.run('support_email', 'support@pranavanexuscare.com');
  insertContactSetting.run('enquiry_email', 'enquiries@pranavanexuscare.com');

  // Social Links
  db.exec(`
    INSERT INTO social_links (platform, url, is_active, sort_order) VALUES
    ('WhatsApp', 'https://wa.me/919876543210', 1, 1),
    ('LinkedIn', 'https://linkedin.com/company/pranava-nexus-care', 1, 2),
    ('Facebook', 'https://facebook.com/pranavanexuscare', 1, 3);
  `);

  // Google Business Settings (Architecture ready with safe fallback)
  db.exec(`
    INSERT INTO google_business_settings (id, place_id, business_profile_id, api_key, rating, review_count, is_configured, show_demo_when_unconfigured)
    VALUES (1, '', '', '', 4.9, 28, 0, 1);
  `);

  // Activity Log
  const insertLog = db.prepare('INSERT INTO admin_activity_logs (user_id, user_name, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)');
  insertLog.run(1, 'System', 'SYSTEM_INITIALIZE', 'DATABASE', 'Initialized Pranava Nexus Care relational database and verified seeders.', '127.0.0.1');

  // Notification
  const insertNotif = db.prepare('INSERT INTO notifications (type, title, message, link) VALUES (?, ?, ?, ?)');
  insertNotif.run('ENQUIRY', 'New Enquiry Received', 'Enquiry PNC-2026-000001 received from Rahim Al-Mansoor.', '/admin/enquiries');
}
