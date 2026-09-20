import { Router, Response } from 'express';
import { db, hashPassword } from '../db.js';
import { requireAuth, requireRole, generateToken, revokeToken, logActivity, AuthenticatedRequest } from '../auth.js';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const adminRouter = Router();

const partnerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'];
    const allowedExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.webp'];
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(extension));
  }
});

const partnerUploadDir = path.join(process.cwd(), 'server', 'data', 'uploads');
const partnerCategories = [
  'Hospitals', 'Clinics', 'Doctors', 'Diagnostic Centres', 'Hotels',
  'Travel Partners', 'Airlines', 'Insurance Partners', 'Visa/Immigration Partners',
  'Wellness Partners', 'Other Healthcare Partners'
];

function parseBoolean(value: unknown): number {
  return value === true || value === 'true' || value === '1' || value === 1 ? 1 : 0;
}

function makePartnerSlug(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `partner-${Date.now()}`;
}

function validWebsiteUrl(value: unknown): boolean {
  if (!value) return true;
  try {
    const url = new URL(String(value));
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

async function savePartnerLogo(file: Express.Multer.File): Promise<string> {
  fs.mkdirSync(partnerUploadDir, { recursive: true });
  const fileName = `partner-${crypto.randomUUID()}.webp`;
  const outputPath = path.join(partnerUploadDir, fileName);
  await sharp(file.buffer)
    .rotate()
    .resize({ width: 1200, height: 800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(outputPath);
  return `/uploads/${fileName}`;
}

function removePartnerLogo(logoUrl: unknown) {
  if (typeof logoUrl !== 'string' || !logoUrl.startsWith('/uploads/')) return;
  const filePath = path.join(partnerUploadDir, path.basename(logoUrl));
  if (filePath.startsWith(partnerUploadDir) && fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

// POST /api/admin/login
adminRouter.post('/login', (req: any, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        errors: { login: 'Please provide both email and password' }
      });
    }

    const passwordHash = hashPassword(password);
    const userRow = db.prepare(`
      SELECT u.id, u.name, u.email, u.role_id, u.status,
             r.slug as role_slug, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE lower(u.email) = lower(?) AND u.password_hash = ?
    `).get(email.trim(), passwordHash) as any;

    if (!userRow) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
        errors: { credentials: 'Email or password does not match active records.' }
      });
    }

    if (userRow.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Account suspended or inactive. Please contact Super Admin.',
        errors: { status: 'Account is deactivated' }
      });
    }

    const authUser = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      role_id: userRow.role_id,
      role_slug: userRow.role_slug,
      role_name: userRow.role_name
    };

    const token = generateToken(authUser);
    logActivity(authUser.id, authUser.name, 'LOGIN', 'AUTH', 'Admin user logged into CMS dashboard', req.ip);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: authUser
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Login error', errors: { server: err.message } });
  }
});

// POST /api/admin/logout
adminRouter.post('/logout', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    revokeToken(token);
  }
  if (req.user) {
    logActivity(req.user.id, req.user.name, 'LOGOUT', 'AUTH', 'Admin user logged out', req.ip);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/admin/me
adminRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: 'User session active',
    data: req.user
  });
});

// GET /api/admin/stats - Real database counts
adminRouter.get('/stats', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalEnquiries = (db.prepare('SELECT count(*) as c FROM enquiries').get() as any).c;
    const newEnquiries = (db.prepare("SELECT count(*) as c FROM enquiries WHERE status = 'NEW'").get() as any).c;
    const inProgressEnquiries = (db.prepare("SELECT count(*) as c FROM enquiries WHERE status IN ('CONTACTED', 'IN_REVIEW', 'IN_PROGRESS')").get() as any).c;
    const completedEnquiries = (db.prepare("SELECT count(*) as c FROM enquiries WHERE status = 'COMPLETED'").get() as any).c;
    const totalLocations = (db.prepare('SELECT count(*) as c FROM locations WHERE published = 1').get() as any).c;
    const totalServices = (db.prepare('SELECT count(*) as c FROM services WHERE published = 1').get() as any).c;
    const totalBlogs = (db.prepare('SELECT count(*) as c FROM blogs').get() as any).c;
    const totalFaqs = (db.prepare('SELECT count(*) as c FROM faqs').get() as any).c;

    const recentEnquiries = db.prepare(`
      SELECT id, reference_no, full_name, phone_whatsapp, preferred_destination, treatment_specialty, status, created_at
      FROM enquiries
      ORDER BY id DESC
      LIMIT 5
    `).all();

    const recentLogs = db.prepare(`
      SELECT id, user_name, action, module, details, created_at
      FROM admin_activity_logs
      ORDER BY id DESC
      LIMIT 8
    `).all();

    res.json({
      success: true,
      message: 'Dashboard statistics calculated',
      data: {
        counts: {
          totalEnquiries,
          newEnquiries,
          inProgressEnquiries,
          completedEnquiries,
          totalLocations,
          totalServices,
          totalBlogs,
          totalFaqs
        },
        recentEnquiries,
        recentLogs
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to compute dashboard stats', errors: { db: err.message } });
  }
});

// ---------------------- ENQUIRIES CRUD ----------------------

// GET /api/admin/enquiries
adminRouter.get('/enquiries', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    let query = `
      SELECT e.*, s.name as selected_service_name, u.name as assigned_to_name
      FROM enquiries e
      LEFT JOIN services s ON e.selected_service_id = s.id
      LEFT JOIN users u ON e.assigned_to_user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'ALL') {
      query += ` AND e.status = ?`;
      params.push(status);
    }

    if (search && typeof search === 'string') {
      query += ` AND (e.reference_no LIKE ? OR e.full_name LIKE ? OR e.treatment_specialty LIKE ? OR e.phone_whatsapp LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    query += ` ORDER BY e.id DESC`;

    const enquiries = db.prepare(query).all(...params);

    res.json({
      success: true,
      message: 'Enquiries retrieved',
      data: enquiries,
      meta: { total: enquiries.length }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve enquiries', errors: { db: err.message } });
  }
});

// GET /api/admin/enquiries/:id
adminRouter.get('/enquiries/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const enquiry = db.prepare(`
      SELECT e.*, s.name as selected_service_name, u.name as assigned_to_name
      FROM enquiries e
      LEFT JOIN services s ON e.selected_service_id = s.id
      LEFT JOIN users u ON e.assigned_to_user_id = u.id
      WHERE e.id = ?
    `).get(id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found' });
    }

    const history = db.prepare(`
      SELECT * FROM enquiry_status_history WHERE enquiry_id = ? ORDER BY created_at ASC
    `).all(id);

    res.json({
      success: true,
      message: 'Enquiry details loaded',
      data: { enquiry, history }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load enquiry', errors: { db: err.message } });
  }
});

// PUT /api/admin/enquiries/:id/status
adminRouter.put('/enquiries/:id/status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { status, note } = req.body;

    const allowed = ['NEW', 'CONTACTED', 'IN_REVIEW', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const current = db.prepare('SELECT id, reference_no, status FROM enquiries WHERE id = ?').get(id) as any;
    if (!current) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found' });
    }

    const prevStatus = current.status;
    db.prepare('UPDATE enquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);

    db.prepare(`
      INSERT INTO enquiry_status_history (enquiry_id, previous_status, new_status, admin_user_id, admin_user_name, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, prevStatus, status, req.user!.id, req.user!.name, note || `Status transitioned from ${prevStatus} to ${status}`);

    logActivity(req.user!.id, req.user!.name, 'UPDATE_STATUS', 'ENQUIRIES', `Updated enquiry ${current.reference_no} status to ${status}`, req.ip);

    res.json({
      success: true,
      message: `Enquiry status successfully updated to ${status}`,
      data: { previousStatus: prevStatus, newStatus: status }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update status', errors: { db: err.message } });
  }
});

// PUT /api/admin/enquiries/:id/notes
adminRouter.put('/enquiries/:id/notes', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { internalNotes } = req.body;

    db.prepare('UPDATE enquiries SET internal_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(internalNotes || '', id);
    logActivity(req.user!.id, req.user!.name, 'UPDATE_NOTES', 'ENQUIRIES', `Updated internal notes on enquiry #${id}`, req.ip);

    res.json({ success: true, message: 'Internal notes saved' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update notes', errors: { db: err.message } });
  }
});

// ---------------------- COUNTRIES & CITIES CRUD ----------------------

// GET /api/admin/countries
adminRouter.get('/countries', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const countries = db.prepare(`
      SELECT c.*, (SELECT count(*) FROM cities WHERE country_id = c.id) as cities_count
      FROM countries c
      ORDER BY c.sort_order ASC, c.name ASC
    `).all();
    res.json({ success: true, data: countries });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/countries
adminRouter.post('/countries', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, slug, iso_code, flag, region, description, image, status, sort_order } = req.body;
    if (!name || !slug || !iso_code) {
      return res.status(400).json({ success: false, message: 'Name, slug, and ISO code are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO countries (name, slug, iso_code, flag, region, description, image, status, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, slug, iso_code, flag || '🌐', region || '', description || '', image || '', status || 'ACTIVE', Number(sort_order) || 0);

    logActivity(req.user!.id, req.user!.name, 'CREATE', 'COUNTRIES', `Created country: ${name}`, req.ip);
    res.status(201).json({ success: true, message: 'Country created', data: { id: result.lastInsertRowid } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/countries/:id
adminRouter.put('/countries/:id', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { name, slug, iso_code, flag, region, description, image, status, sort_order } = req.body;

    db.prepare(`
      UPDATE countries SET name = ?, slug = ?, iso_code = ?, flag = ?, region = ?,
                           description = ?, image = ?, status = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, slug, iso_code, flag, region, description, image, status, sort_order, id);

    logActivity(req.user!.id, req.user!.name, 'UPDATE', 'COUNTRIES', `Updated country #${id} (${name})`, req.ip);
    res.json({ success: true, message: 'Country updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/cities
adminRouter.get('/cities', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const cities = db.prepare(`
      SELECT ci.*, c.name as country_name
      FROM cities ci
      JOIN countries c ON ci.country_id = c.id
      ORDER BY ci.sort_order ASC, ci.name ASC
    `).all();
    res.json({ success: true, data: cities });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/cities
adminRouter.post('/cities', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { country_id, name, slug, region, description, image, status, sort_order } = req.body;
    if (!country_id || !name || !slug) {
      return res.status(400).json({ success: false, message: 'Country, name, and slug are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO cities (country_id, name, slug, region, description, image, status, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const resId = stmt.run(country_id, name, slug, region || '', description || '', image || '', status || 'ACTIVE', Number(sort_order) || 0);

    logActivity(req.user!.id, req.user!.name, 'CREATE', 'CITIES', `Created city: ${name}`, req.ip);
    res.status(201).json({ success: true, message: 'City created', data: { id: resId.lastInsertRowid } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------- LOCATIONS & AVAILABILITY ENGINE CRUD ----------------------

// GET /api/admin/locations
adminRouter.get('/locations', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const locations = db.prepare(`
      SELECT l.*, c.name as country_name, ci.name as city_name,
             (SELECT count(*) FROM location_services WHERE location_id = l.id) as services_count
      FROM locations l
      JOIN countries c ON l.country_id = c.id
      JOIN cities ci ON l.city_id = ci.id
      ORDER BY l.id ASC
    `).all();
    res.json({ success: true, data: locations });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/locations
adminRouter.post('/locations', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { country_id, city_id, city_name, city_slug, title, slug, continent, region, description, hero_image, availability_status, last_verified_date, published, internal_notes } = req.body;
    let resolvedCityId = city_id;
    if (!resolvedCityId && city_name && city_slug) {
      const existingCity = db.prepare('SELECT id FROM cities WHERE country_id = ? AND slug = ?').get(country_id, city_slug) as any;
      if (existingCity) resolvedCityId = existingCity.id;
      else {
        const cityResult = db.prepare(`INSERT INTO cities (country_id, name, slug, region, description, status, sort_order) VALUES (?, ?, ?, ?, ?, 'ACTIVE', 0)`).run(country_id, city_name.trim(), city_slug.trim(), region || '', description || '');
        resolvedCityId = Number(cityResult.lastInsertRowid);
      }
    }
    if (!country_id || !resolvedCityId || !(title || city_name)) return res.status(422).json({ success: false, message: 'Country and hub city are required.' });
    const hubTitle = title || `${city_name} Medical Travel Coordination`;
    const hubSlug = slug || city_slug;

    const stmt = db.prepare(`
      INSERT INTO locations (country_id, city_id, title, slug, continent, region, description, hero_image, availability_status, last_verified_date, published, internal_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      country_id, resolvedCityId, hubTitle, hubSlug, continent || 'Asia', region || '',
      description || '', hero_image || '', availability_status || 'AVAILABLE',
      last_verified_date || new Date().toISOString().split('T')[0],
      published === false ? 0 : 1, internal_notes || ''
    );

    logActivity(req.user!.id, req.user!.name, 'CREATE', 'LOCATIONS', `Created location: ${title}`, req.ip);
    res.status(201).json({ success: true, message: 'Location created', data: { id: result.lastInsertRowid } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/locations/:id
adminRouter.put('/locations/:id', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const current = db.prepare('SELECT title, slug, published FROM locations WHERE id = ?').get(id) as any;
    if (!current) return res.status(404).json({ success: false, message: 'Healthcare hub not found.' });
    const { title, slug, availability_status, last_verified_date, published, description, hero_image, internal_notes } = req.body;

    db.prepare(`
      UPDATE locations SET title = ?, slug = ?, availability_status = ?, last_verified_date = ?,
                           published = ?, description = ?, hero_image = ?, internal_notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title || current.title, slug || current.slug, availability_status, last_verified_date || new Date().toISOString().split('T')[0], published === undefined ? current.published : (published ? 1 : 0), description || '', hero_image || '', internal_notes || '', id);

    logActivity(req.user!.id, req.user!.name, 'UPDATE', 'LOCATIONS', `Updated location #${id} availability to ${availability_status}`, req.ip);
    res.json({ success: true, message: 'Location updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.delete('/locations/:id', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM locations WHERE id = ?').run(req.params.id);
    if (Number(result.changes) === 0) return res.status(404).json({ success: false, message: 'Healthcare hub not found.' });
    res.json({ success: true, message: 'Healthcare hub deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete healthcare hub.', errors: { db: err.message } });
  }
});

// GET /api/admin/locations/:id/services
adminRouter.get('/locations/:id/services', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const services = db.prepare(`
      SELECT s.id as service_id, s.name as service_name, s.slug as service_slug,
             ls.id as mapping_id, ls.availability_status, ls.description_override,
             ls.requirements_override, ls.published as is_assigned
      FROM services s
      LEFT JOIN location_services ls ON ls.service_id = s.id AND ls.location_id = ?
      ORDER BY s.sort_order ASC
    `).all(id);

    res.json({ success: true, data: services });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/location-services
adminRouter.post('/location-services', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { location_id, service_id, availability_status, description_override, published } = req.body;

    // Check if exists
    const existing = db.prepare('SELECT id FROM location_services WHERE location_id = ? AND service_id = ?').get(location_id, service_id) as any;
    if (existing) {
      db.prepare(`
        UPDATE location_services SET availability_status = ?, description_override = ?, published = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(availability_status || 'AVAILABLE', description_override || null, published ? 1 : 0, existing.id);
    } else {
      db.prepare(`
        INSERT INTO location_services (location_id, service_id, availability_status, description_override, published)
        VALUES (?, ?, ?, ?, ?)
      `).run(location_id, service_id, availability_status || 'AVAILABLE', description_override || null, published ? 1 : 0);
    }

    logActivity(req.user!.id, req.user!.name, 'UPDATE_LOCATION_SERVICE', 'LOCATIONS', `Updated service #${service_id} mapping for location #${location_id}`, req.ip);
    res.json({ success: true, message: 'Location-service mapping saved' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------- SERVICES CRUD ----------------------

// GET /api/admin/services
adminRouter.get('/services', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const services = db.prepare('SELECT * FROM services ORDER BY sort_order ASC, id ASC').all();
    res.json({ success: true, data: services });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/services/:id
adminRouter.put('/services/:id', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { name, short_description, full_description, requirements, icon, featured, published, sort_order } = req.body;

    db.prepare(`
      UPDATE services SET name = ?, short_description = ?, full_description = ?, requirements = ?,
                          icon = ?, featured = ?, published = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, short_description, full_description, requirements, icon, featured ? 1 : 0, published ? 1 : 0, sort_order, id);

    logActivity(req.user!.id, req.user!.name, 'UPDATE', 'SERVICES', `Updated approved service: ${name}`, req.ip);
    res.json({ success: true, message: 'Service updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------- FAQS CRUD ----------------------

// GET /api/admin/faqs
adminRouter.get('/faqs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const faqs = db.prepare(`
      SELECT f.*, c.name as category_name
      FROM faqs f
      LEFT JOIN faq_categories c ON f.category_id = c.id
      ORDER BY f.sort_order ASC, f.id ASC
    `).all();
    res.json({ success: true, data: faqs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/faqs
adminRouter.post('/faqs', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category_id, question, answer, sort_order, published } = req.body;
    const stmt = db.prepare(`
      INSERT INTO faqs (category_id, question, answer, sort_order, published)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(category_id || 1, question, answer, sort_order || 0, published ? 1 : 0);
    res.status(201).json({ success: true, message: 'FAQ created', data: { id: result.lastInsertRowid } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/faqs/:id
adminRouter.put('/faqs/:id', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { category_id, question, answer, sort_order, published } = req.body;
    db.prepare(`
      UPDATE faqs SET category_id = ?, question = ?, answer = ?, sort_order = ?, published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(category_id, question, answer, sort_order, published ? 1 : 0, id);
    res.json({ success: true, message: 'FAQ updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/faqs/:id
adminRouter.delete('/faqs/:id', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    db.prepare('DELETE FROM faqs WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------- BLOGS CRUD ----------------------

// GET /api/admin/blogs
adminRouter.get('/blogs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const blogs = db.prepare(`
      SELECT b.*, c.name as category_name
      FROM blogs b
      LEFT JOIN blog_categories c ON b.category_id = c.id
      ORDER BY b.id DESC
    `).all();
    res.json({ success: true, data: blogs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/blogs
adminRouter.post('/blogs', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category_id, title, slug, summary, content, author, featured_image, published_date, status, seo_title, seo_description } = req.body;
    const stmt = db.prepare(`
      INSERT INTO blogs (category_id, title, slug, summary, content, author, featured_image, published_date, status, seo_title, seo_description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      category_id || 1, title, slug, summary || '', content,
      author || req.user!.name, featured_image || '',
      published_date || new Date().toISOString().split('T')[0],
      status || 'PUBLISHED', seo_title || title, seo_description || summary || ''
    );
    res.status(201).json({ success: true, message: 'Blog guide published', data: { id: result.lastInsertRowid } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/blogs/:id
adminRouter.put('/blogs/:id', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { category_id, title, slug, summary, content, author, featured_image, status, seo_title, seo_description } = req.body;
    db.prepare(`
      UPDATE blogs SET category_id = ?, title = ?, slug = ?, summary = ?, content = ?,
                       author = ?, featured_image = ?, status = ?, seo_title = ?, seo_description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(category_id, title, slug, summary, content, author, featured_image, status, seo_title, seo_description, id);
    res.json({ success: true, message: 'Blog updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------- TESTIMONIALS / PATIENT STORIES CRUD ----------------------

// GET /api/admin/testimonials
adminRouter.get('/testimonials', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY id DESC').all();
    res.json({ success: true, data: testimonials });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/testimonials - new stories remain hidden until explicitly approved
adminRouter.post('/testimonials', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { display_name, country, destination, testimonial, rating, is_demo, verified, consent_status, published } = req.body;
    if (!display_name?.trim() || !country?.trim() || !destination?.trim() || !testimonial?.trim()) {
      return res.status(422).json({ success: false, message: 'Patient name, country, destination, and testimonial are required.' });
    }
    const result = db.prepare(`
      INSERT INTO testimonials (display_name, country, destination, testimonial, consent_status, verified, is_demo, published, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, date('now'))
    `).run(
      display_name.trim(), country.trim(), destination.trim(), testimonial.trim(), consent_status ? 1 : 0,
      verified ? 1 : 0, is_demo ? 1 : 0, published ? 1 : 0
    );
    logActivity(req.user!.id, req.user!.name, 'CREATE', 'TESTIMONIALS', `Created patient story: ${display_name}`, req.ip);
    res.status(201).json({ success: true, message: 'Patient story created', data: { id: result.lastInsertRowid } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create patient story', errors: { server: err.message } });
  }
});

// PUT /api/admin/testimonials/:id
adminRouter.put('/testimonials/:id', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { display_name, country, destination, testimonial, consent_status, verified, is_demo, published } = req.body;
    db.prepare(`
      UPDATE testimonials SET display_name = ?, country = ?, destination = ?, testimonial = ?,
                              consent_status = ?, verified = ?, is_demo = ?, published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(display_name, country, destination, testimonial, consent_status ? 1 : 0, verified ? 1 : 0, is_demo ? 1 : 0, published ? 1 : 0, id);
    res.json({ success: true, message: 'Testimonial updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------- SETTINGS & GOOGLE REVIEWS CRUD ----------------------

// GET /api/admin/settings
adminRouter.get('/settings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const siteSettings = db.prepare('SELECT * FROM site_settings').all();
    const contactSettings = db.prepare('SELECT * FROM contact_settings').all();
    const googleSettings = db.prepare('SELECT * FROM google_business_settings WHERE id = 1').get();

    res.json({
      success: true,
      data: { siteSettings, contactSettings, googleSettings }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/settings
adminRouter.put('/settings', requireAuth, requireRole(['super-admin', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { site, contact, google } = req.body;

    if (site && typeof site === 'object') {
      const updateSite = db.prepare('INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
      for (const [k, v] of Object.entries(site)) {
        updateSite.run(k, String(v));
      }
    }

    if (contact && typeof contact === 'object') {
      const updateContact = db.prepare('INSERT OR REPLACE INTO contact_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
      for (const [k, v] of Object.entries(contact)) {
        updateContact.run(k, String(v));
      }
    }

    if (google && typeof google === 'object') {
      db.prepare(`
        UPDATE google_business_settings
        SET place_id = ?, business_profile_id = ?, rating = ?, review_count = ?, is_configured = ?, show_demo_when_unconfigured = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `).run(
        google.place_id || '', google.business_profile_id || '',
        google.rating || 4.9, google.review_count || 28,
        google.is_configured ? 1 : 0, google.show_demo_when_unconfigured ? 1 : 0
      );
    }

    logActivity(req.user!.id, req.user!.name, 'UPDATE', 'SETTINGS', 'Updated site, contact, and Google business integration settings', req.ip);
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------- USERS & ROLES ----------------------

// GET /api/admin/users
adminRouter.get('/users', requireAuth, requireRole(['super-admin']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.prepare(`
      SELECT u.id, u.name, u.email, u.role_id, u.status, u.created_at,
             r.name as role_name, r.slug as role_slug
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.id ASC
    `).all();
    res.json({ success: true, data: users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/roles
adminRouter.get('/roles', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const roles = db.prepare('SELECT * FROM roles ORDER BY id ASC').all();
    res.json({ success: true, data: roles });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/activity-logs
adminRouter.get('/activity-logs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = db.prepare('SELECT * FROM admin_activity_logs ORDER BY id DESC LIMIT 100').all();
    res.json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/notifications
adminRouter.get('/notifications', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const notifs = db.prepare('SELECT * FROM notifications ORDER BY id DESC LIMIT 20').all();
    res.json({ success: true, data: notifs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------- SOCIAL MEDIA CMS ----------------------
adminRouter.get('/social-media', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const media = db.prepare('SELECT * FROM social_media ORDER BY sort_order ASC, id DESC').all();
    res.json({ success: true, data: media });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.post('/social-media', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { platform, title, url, thumbnail_url, description, sort_order, is_active } = req.body;
    const allowedPlatforms = ['Facebook', 'YouTube', 'Instagram', 'LinkedIn', 'Other'];
    if (!allowedPlatforms.includes(platform) || !title?.trim() || !url?.trim()) return res.status(422).json({ success: false, message: 'Platform, title and URL are required.' });
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return res.status(422).json({ success: false, message: 'URL must use HTTP or HTTPS.' });
    const result = db.prepare(`INSERT INTO social_media (platform, title, url, thumbnail_url, description, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
      platform, title.trim(), url.trim(), thumbnail_url?.trim() || null, description?.trim() || null, Math.max(0, Number(sort_order) || 0), is_active === false || is_active === '0' ? 0 : 1
    );
    const item = db.prepare('SELECT * FROM social_media WHERE id = ?').get(Number(result.lastInsertRowid));
    logActivity(req.user!.id, req.user!.name, 'CREATE', 'SOCIAL_MEDIA', `Added ${platform} media: ${title}`, req.ip);
    res.status(201).json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to add social media', errors: { server: err.message } });
  }
});

adminRouter.put('/social-media/:id', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { platform, title, url, thumbnail_url, description, sort_order, is_active } = req.body;
    const parsed = new URL(url);
    if (!title?.trim() || !['http:', 'https:'].includes(parsed.protocol)) return res.status(422).json({ success: false, message: 'Valid title and HTTP/HTTPS URL are required.' });
    db.prepare(`UPDATE social_media SET platform = ?, title = ?, url = ?, thumbnail_url = ?, description = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(
      platform, title.trim(), url.trim(), thumbnail_url?.trim() || null, description?.trim() || null, Math.max(0, Number(sort_order) || 0), is_active ? 1 : 0, req.params.id
    );
    res.json({ success: true, message: 'Social media updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update social media', errors: { server: err.message } });
  }
});

adminRouter.delete('/social-media/:id', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    db.prepare('DELETE FROM social_media WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Social media removed' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------- PARTNERS CMS ----------------------

adminRouter.get('/partners', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, category, status, sort = 'display_order', direction = 'asc' } = req.query;
    const allowedSorts: Record<string, string> = {
      display_order: 'display_order', name: 'name', category: 'category', created_at: 'created_at'
    };
    const orderColumn = allowedSorts[String(sort)] || 'display_order';
    const orderDirection = String(direction).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    let query = 'SELECT * FROM partners WHERE 1 = 1';
    const params: string[] = [];

    if (search && typeof search === 'string') {
      query += ' AND (name LIKE ? OR slug LIKE ? OR description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }
    if (category && category !== 'ALL') {
      query += ' AND category = ?';
      params.push(String(category));
    }
    if (status === 'ACTIVE' || status === 'INACTIVE') {
      query += ' AND is_active = ?';
      params.push(status === 'ACTIVE' ? '1' : '0');
    }
    query += ` ORDER BY ${orderColumn} ${orderDirection}, id ASC`;

    const partners = db.prepare(query).all(...params);
    res.json({ success: true, message: 'Partners retrieved', data: partners, meta: { total: partners.length, categories: partnerCategories } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve partners', errors: { db: err.message } });
  }
});

adminRouter.get('/partners/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, data: partner });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve partner', errors: { db: err.message } });
  }
});

adminRouter.post('/partners', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), partnerUpload.single('logo'), async (req: AuthenticatedRequest, res: Response) => {
  let logoUrl = '';
  try {
    const { name, category, description, website_url, display_order, is_featured, is_active } = req.body;
    if (!name || String(name).trim().length < 2 || String(name).trim().length > 180) {
      return res.status(422).json({ success: false, message: 'Partner name is required and must be 2-180 characters.' });
    }
    if (!req.file) return res.status(422).json({ success: false, message: 'A partner logo is required.' });
    if (!partnerCategories.includes(String(category || 'Other Healthcare Partners'))) {
      return res.status(422).json({ success: false, message: 'Invalid partner category.' });
    }
    if (!validWebsiteUrl(website_url)) return res.status(422).json({ success: false, message: 'Website URL must be a valid HTTP or HTTPS URL.' });

    logoUrl = await savePartnerLogo(req.file);
    const baseSlug = makePartnerSlug(String(name));
    const slug = `${baseSlug}-${Date.now().toString(36)}`;
    const result = db.prepare(`
      INSERT INTO partners (name, slug, logo_url, category, description, website_url, display_order, is_featured, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      String(name).trim(), slug, logoUrl, String(category || 'Other Healthcare Partners'),
      String(description || '').trim(), website_url ? String(website_url).trim() : null,
      Math.max(0, Number(display_order) || 0), parseBoolean(is_featured), parseBoolean(is_active ?? true)
    );
    const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(Number(result.lastInsertRowid));
    logActivity(req.user!.id, req.user!.name, 'CREATE', 'PARTNERS', `Created partner: ${name}`, req.ip);
    res.status(201).json({ success: true, message: 'Partner created', data: partner });
  } catch (err: any) {
    if (logoUrl) removePartnerLogo(logoUrl);
    res.status(500).json({ success: false, message: 'Failed to create partner', errors: { server: err.message } });
  }
});

adminRouter.put('/partners/:id', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), partnerUpload.single('logo'), async (req: AuthenticatedRequest, res: Response) => {
  let newLogoUrl = '';
  try {
    const current = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id) as any;
    if (!current) return res.status(404).json({ success: false, message: 'Partner not found' });
    const { name, category, description, website_url, display_order, is_featured, is_active } = req.body;
    if (!name || String(name).trim().length < 2 || String(name).trim().length > 180) return res.status(422).json({ success: false, message: 'Partner name is required and must be 2-180 characters.' });
    if (!partnerCategories.includes(String(category || current.category))) return res.status(422).json({ success: false, message: 'Invalid partner category.' });
    if (!validWebsiteUrl(website_url)) return res.status(422).json({ success: false, message: 'Website URL must be a valid HTTP or HTTPS URL.' });
    if (req.file) newLogoUrl = await savePartnerLogo(req.file);

    db.prepare(`
      UPDATE partners SET name = ?, category = ?, description = ?, website_url = ?, display_order = ?,
        is_featured = ?, is_active = ?, logo_url = COALESCE(?, logo_url), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      String(name).trim(), String(category || current.category), String(description || '').trim(),
      website_url ? String(website_url).trim() : null, Math.max(0, Number(display_order) || 0),
      parseBoolean(is_featured), parseBoolean(is_active), newLogoUrl || null, req.params.id
    );
    if (newLogoUrl) removePartnerLogo(current.logo_url);
    const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
    logActivity(req.user!.id, req.user!.name, 'UPDATE', 'PARTNERS', `Updated partner #${req.params.id}`, req.ip);
    res.json({ success: true, message: 'Partner updated', data: partner });
  } catch (err: any) {
    if (newLogoUrl) removePartnerLogo(newLogoUrl);
    res.status(500).json({ success: false, message: 'Failed to update partner', errors: { server: err.message } });
  }
});

adminRouter.delete('/partners/:id', requireAuth, requireRole(['super-admin', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const current = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id) as any;
    if (!current) return res.status(404).json({ success: false, message: 'Partner not found' });
    db.prepare('DELETE FROM partners WHERE id = ?').run(req.params.id);
    removePartnerLogo(current.logo_url);
    logActivity(req.user!.id, req.user!.name, 'DELETE', 'PARTNERS', `Deleted partner #${req.params.id}`, req.ip);
    res.json({ success: true, message: 'Partner deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete partner', errors: { server: err.message } });
  }
});

adminRouter.patch('/partners/:id/status', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { is_active } = req.body;
    db.prepare('UPDATE partners SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(parseBoolean(is_active), req.params.id);
    if ((db.prepare('SELECT changes() as count').get() as any).count === 0) return res.status(404).json({ success: false, message: 'Partner not found' });
    logActivity(req.user!.id, req.user!.name, 'STATUS', 'PARTNERS', `Changed partner #${req.params.id} status`, req.ip);
    res.json({ success: true, message: 'Partner status updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update partner status', errors: { server: err.message } });
  }
});

adminRouter.patch('/partners/reorder', requireAuth, requireRole(['super-admin', 'admin', 'content-manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    const update = db.prepare('UPDATE partners SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    db.exec('BEGIN');
    for (const item of items) {
      if (Number.isInteger(Number(item.id)) && Number.isInteger(Number(item.display_order))) update.run(Number(item.display_order), Number(item.id));
    }
    db.exec('COMMIT');
    logActivity(req.user!.id, req.user!.name, 'REORDER', 'PARTNERS', 'Reordered partner display sequence', req.ip);
    res.json({ success: true, message: 'Partner order updated' });
  } catch (err: any) {
    try { db.exec('ROLLBACK'); } catch { /* transaction already closed */ }
    res.status(500).json({ success: false, message: 'Failed to reorder partners', errors: { server: err.message } });
  }
});
