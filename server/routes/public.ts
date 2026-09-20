import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const publicRouter = Router();

// GET /api/search?q= - public search across approved site content
publicRouter.get('/search', (req: Request, res: Response) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (query.length < 2) {
      return res.json({ success: true, message: 'Enter at least two characters to search', data: [] });
    }

    const term = `%${query.slice(0, 80)}%`;
    const results = [
      ...db.prepare(`SELECT 'blog' as type, slug, title as name, summary as description FROM blogs WHERE status = 'PUBLISHED' AND (title LIKE ? OR summary LIKE ? OR content LIKE ?) LIMIT 12`).all(term, term, term),
      ...db.prepare(`SELECT 'service' as type, slug, name, short_description as description FROM services WHERE published = 1 AND (name LIKE ? OR short_description LIKE ? OR full_description LIKE ?) LIMIT 12`).all(term, term, term),
      ...db.prepare(`SELECT 'destination' as type, slug, title as name, description FROM locations WHERE published = 1 AND (title LIKE ? OR description LIKE ? OR region LIKE ?) LIMIT 12`).all(term, term, term),
      ...db.prepare(`SELECT 'faq' as type, lower(replace(question, ' ', '-')) as slug, question as name, answer as description FROM faqs WHERE published = 1 AND (question LIKE ? OR answer LIKE ?) LIMIT 12`).all(term, term),
      ...db.prepare(`SELECT 'partner' as type, slug, name, description FROM partners WHERE is_active = 1 AND (name LIKE ? OR description LIKE ? OR category LIKE ?) LIMIT 12`).all(term, term, term)
    ];

    res.json({ success: true, message: 'Search results retrieved', data: results.slice(0, 40), meta: { total: Math.min(results.length, 40), query } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Search failed', errors: { db: err.message } });
  }
});

// GET /api/partners - only active, administrator-approved partners are public
publicRouter.get('/partners', (req: Request, res: Response) => {
  try {
    const partners = db.prepare(`
      SELECT id, name, slug, logo_url, category, description, website_url,
             display_order, is_featured, is_demo
      FROM partners
      WHERE is_active = 1
      ORDER BY display_order ASC, name ASC
    `).all();

    res.json({
      success: true,
      message: 'Active partners retrieved successfully',
      data: partners,
      meta: { total: partners.length }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve partners', errors: { db: err.message } });
  }
});

// GET /api/social-media - approved Facebook, YouTube and other media links
publicRouter.get('/social-media', (req: Request, res: Response) => {
  try {
    const media = db.prepare(`
      SELECT id, platform, title, url, thumbnail_url, description, sort_order
      FROM social_media
      WHERE is_active = 1
      ORDER BY sort_order ASC, id DESC
    `).all();
    res.json({ success: true, message: 'Social media content retrieved', data: media });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve social media', errors: { db: err.message } });
  }
});

// GET /api/countries
publicRouter.get('/countries', (req: Request, res: Response) => {
  try {
    const countries = db.prepare(`
      SELECT id, name, slug, iso_code, flag, region, description, image, status, sort_order
      FROM countries
      WHERE status = 'ACTIVE'
      ORDER BY sort_order ASC, name ASC
    `).all();

    res.json({
      success: true,
      message: 'Countries retrieved successfully',
      data: countries,
      meta: { total: countries.length }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve countries', errors: { db: err.message } });
  }
});

// GET /api/countries/:id/cities
publicRouter.get('/countries/:id/cities', (req: Request, res: Response) => {
  try {
    const countryId = req.params.id;
    const cities = db.prepare(`
      SELECT c.id, c.country_id, c.name, c.slug, c.region, c.description, c.image, c.status, c.sort_order,
             (SELECT count(*) FROM locations l WHERE l.city_id = c.id AND l.published = 1) as active_locations_count
      FROM cities c
      WHERE c.country_id = ? AND c.status = 'ACTIVE'
      ORDER BY c.sort_order ASC, c.name ASC
    `).all(countryId);

    res.json({
      success: true,
      message: 'Cities retrieved successfully',
      data: cities,
      meta: { total: cities.length }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve cities', errors: { db: err.message } });
  }
});

// GET /api/locations
publicRouter.get('/locations', (req: Request, res: Response) => {
  try {
    const locations = db.prepare(`
      SELECT l.id, l.country_id, l.city_id, l.title, l.slug, l.continent, l.region,
             l.description, l.hero_image, l.availability_status, l.last_verified_date,
             c.name as country_name, c.slug as country_slug, c.flag as country_flag,
             ci.name as city_name, ci.slug as city_slug,
             (SELECT count(*) FROM location_services ls WHERE ls.location_id = l.id AND ls.published = 1) as services_count
      FROM locations l
      JOIN countries c ON l.country_id = c.id
      JOIN cities ci ON l.city_id = ci.id
      WHERE l.published = 1
      ORDER BY l.id ASC
    `).all();

    res.json({
      success: true,
      message: 'Active destinations retrieved successfully',
      data: locations,
      meta: { total: locations.length }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve locations', errors: { db: err.message } });
  }
});

// GET /api/locations/:id
publicRouter.get('/locations/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const location = db.prepare(`
      SELECT l.id, l.country_id, l.city_id, l.title, l.slug, l.continent, l.region,
             l.description, l.hero_image, l.availability_status, l.last_verified_date,
             c.name as country_name, c.slug as country_slug, c.flag as country_flag,
             ci.name as city_name, ci.slug as city_slug
      FROM locations l
      JOIN countries c ON l.country_id = c.id
      JOIN cities ci ON l.city_id = ci.id
      WHERE (l.id = ? OR l.slug = ?) AND l.published = 1
    `).get(id, id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Destination location not found or currently unverified.'
      });
    }

    res.json({
      success: true,
      message: 'Location details retrieved successfully',
      data: location
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve location', errors: { db: err.message } });
  }
});

// GET /api/locations/:country/:city
publicRouter.get('/locations/:country/:city', (req: Request, res: Response) => {
  try {
    const { country, city } = req.params;
    const location = db.prepare(`
      SELECT l.id, l.country_id, l.city_id, l.title, l.slug, l.continent, l.region,
             l.description, l.hero_image, l.availability_status, l.last_verified_date,
             c.name as country_name, c.slug as country_slug, c.flag as country_flag,
             ci.name as city_name, ci.slug as city_slug
      FROM locations l
      JOIN countries c ON l.country_id = c.id
      JOIN cities ci ON l.city_id = ci.id
      WHERE (c.slug = ? OR lower(c.name) = lower(?))
        AND (ci.slug = ? OR lower(ci.name) = lower(?))
        AND l.published = 1
    `).get(country, country, city, city);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'This destination is not currently listed as an active service location. You may still submit an enquiry and our team can review whether support can be arranged for your requirement.'
      });
    }

    res.json({
      success: true,
      message: 'Destination found',
      data: location
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error querying location', errors: { db: err.message } });
  }
});

// GET /api/locations/:id/services
publicRouter.get('/locations/:id/services', (req: Request, res: Response) => {
  try {
    const locationId = req.params.id;
    const services = db.prepare(`
      SELECT s.id, s.name, s.slug, s.icon, s.featured,
             COALESCE(ls.description_override, s.short_description) as short_description,
             s.full_description,
             COALESCE(ls.requirements_override, s.requirements) as requirements,
             ls.availability_status
      FROM location_services ls
      JOIN services s ON ls.service_id = s.id
      WHERE (ls.location_id = ? OR ls.location_id = (SELECT id FROM locations WHERE slug = ?))
        AND ls.published = 1
        AND s.published = 1
      ORDER BY s.sort_order ASC
    `).all(locationId, locationId);

    res.json({
      success: true,
      message: 'Services for location retrieved successfully',
      data: services,
      meta: { total: services.length }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve services for location', errors: { db: err.message } });
  }
});

// GET /api/services
publicRouter.get('/services', (req: Request, res: Response) => {
  try {
    const services = db.prepare(`
      SELECT id, name, slug, short_description, full_description, requirements, icon, featured, published, sort_order
      FROM services
      WHERE published = 1
      ORDER BY sort_order ASC, id ASC
    `).all();

    res.json({
      success: true,
      message: 'Approved services retrieved successfully',
      data: services,
      meta: { total: services.length }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve services', errors: { db: err.message } });
  }
});

// GET /api/services/:slug
publicRouter.get('/services/:slug', (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const service = db.prepare(`
      SELECT id, name, slug, short_description, full_description, requirements, icon, featured, published, sort_order
      FROM services
      WHERE (slug = ? OR id = ?) AND published = 1
    `).get(slug, slug);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or inactive.'
      });
    }

    res.json({
      success: true,
      message: 'Service retrieved successfully',
      data: service
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve service', errors: { db: err.message } });
  }
});

// GET /api/faqs
publicRouter.get('/faqs', (req: Request, res: Response) => {
  try {
    const faqs = db.prepare(`
      SELECT f.id, f.category_id, f.question, f.answer, f.sort_order,
             c.name as category_name, c.slug as category_slug
      FROM faqs f
      LEFT JOIN faq_categories c ON f.category_id = c.id
      WHERE f.published = 1
      ORDER BY c.sort_order ASC, f.sort_order ASC
    `).all();

    const categories = db.prepare(`
      SELECT id, name, slug, sort_order FROM faq_categories ORDER BY sort_order ASC
    `).all();

    res.json({
      success: true,
      message: 'FAQs retrieved successfully',
      data: { faqs, categories },
      meta: { total: faqs.length }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve FAQs', errors: { db: err.message } });
  }
});

// GET /api/blogs
publicRouter.get('/blogs', (req: Request, res: Response) => {
  try {
    const blogs = db.prepare(`
      SELECT b.id, b.category_id, b.title, b.slug, b.summary, b.author, b.featured_image,
             b.published_date, b.seo_title, b.seo_description,
             c.name as category_name, c.slug as category_slug
      FROM blogs b
      LEFT JOIN blog_categories c ON b.category_id = c.id
      WHERE b.status = 'PUBLISHED'
      ORDER BY b.published_date DESC, b.id DESC
    `).all();

    const categories = db.prepare(`
      SELECT id, name, slug FROM blog_categories ORDER BY sort_order ASC
    `).all();

    res.json({
      success: true,
      message: 'Blog guides retrieved successfully',
      data: { blogs, categories },
      meta: { total: blogs.length }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve blogs', errors: { db: err.message } });
  }
});

// GET /api/blogs/:slug
publicRouter.get('/blogs/:slug', (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const blog = db.prepare(`
      SELECT b.id, b.category_id, b.title, b.slug, b.summary, b.content, b.author,
             b.featured_image, b.published_date, b.status, b.seo_title, b.seo_description,
             b.canonical_url, b.og_image,
             c.name as category_name, c.slug as category_slug
      FROM blogs b
      LEFT JOIN blog_categories c ON b.category_id = c.id
      WHERE (b.slug = ? OR b.id = ?) AND b.status = 'PUBLISHED'
    `).get(slug, slug);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }

    res.json({
      success: true,
      message: 'Blog article retrieved successfully',
      data: blog
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve blog article', errors: { db: err.message } });
  }
});

// GET /api/testimonials
publicRouter.get('/testimonials', (req: Request, res: Response) => {
  try {
    // Only published + consent_status=1 + verified=1
    const testimonials = db.prepare(`
      SELECT t.id, t.display_name, t.country, t.destination, t.testimonial, t.photo,
             t.is_demo, t.date, s.name as service_name
      FROM testimonials t
      LEFT JOIN services s ON t.service_id = s.id
      WHERE t.published = 1 AND t.consent_status = 1 AND t.verified = 1 AND t.is_demo = 0
      ORDER BY t.date DESC
    `).all();

    res.json({
      success: true,
      message: 'Verified patient stories retrieved successfully',
      data: testimonials,
      meta: { total: testimonials.length }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve testimonials', errors: { db: err.message } });
  }
});

// GET /api/gallery
publicRouter.get('/gallery', (req: Request, res: Response) => {
  try {
    const items = db.prepare(`
      SELECT g.id, g.category_id, g.title, g.image, g.caption, g.source_type,
             c.name as category_name, c.slug as category_slug
      FROM gallery_items g
      LEFT JOIN gallery_categories c ON g.category_id = c.id
      WHERE g.published = 1 AND g.consent_status = 1
      ORDER BY g.sort_order ASC, g.id ASC
    `).all();

    const categories = db.prepare(`
      SELECT id, name, slug FROM gallery_categories ORDER BY sort_order ASC
    `).all();

    res.json({
      success: true,
      message: 'Gallery items retrieved successfully',
      data: { items, categories },
      meta: { total: items.length }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve gallery', errors: { db: err.message } });
  }
});

// GET /api/settings
publicRouter.get('/settings', (req: Request, res: Response) => {
  try {
    const siteSettingsRows = db.prepare('SELECT key, value FROM site_settings').all() as Array<{ key: string; value: string }>;
    const contactSettingsRows = db.prepare('SELECT key, value FROM contact_settings').all() as Array<{ key: string; value: string }>;
    const socialLinks = db.prepare('SELECT platform, url FROM social_links WHERE is_active = 1 ORDER BY sort_order ASC').all();

    const siteSettings: Record<string, string> = {};
    siteSettingsRows.forEach(r => siteSettings[r.key] = r.value);

    const contactSettings: Record<string, string> = {};
    contactSettingsRows.forEach(r => contactSettings[r.key] = r.value);

    res.json({
      success: true,
      message: 'Public settings retrieved',
      data: {
        site: siteSettings,
        contact: contactSettings,
        social: socialLinks
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve settings', errors: { db: err.message } });
  }
});

// GET /api/google-reviews
publicRouter.get('/google-reviews', (req: Request, res: Response) => {
  try {
    const googleSettings = db.prepare('SELECT place_id, rating, review_count, is_configured, show_demo_when_unconfigured FROM google_business_settings WHERE id = 1').get() as any;

    if (!googleSettings || googleSettings.is_configured === 0) {
      return res.json({
        success: true,
        message: 'Google Reviews integration is not configured.',
        data: {
          isConfigured: false,
          fallbackNotice: 'Google Reviews integration is ready to be connected with an active Google Business Profile Place ID.',
          rating: null,
          reviewCount: 0,
          reviews: []
        }
      });
    }

    res.json({
      success: true,
      message: 'Google review summary retrieved',
      data: {
        isConfigured: true,
        placeId: googleSettings.place_id,
        rating: googleSettings.rating,
        reviewCount: googleSettings.review_count,
        googleProfileUrl: googleSettings.place_id ? `https://search.google.com/local/reviews?placeid=${googleSettings.place_id}` : null
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve Google reviews', errors: { db: err.message } });
  }
});

// POST /api/enquiries - Real database enquiry submission
publicRouter.post('/enquiries', (req: Request, res: Response) => {
  try {
    const {
      fullName,
      phoneWhatsApp,
      email,
      countryCity,
      preferredDestination,
      preferredCity,
      treatmentSpecialty,
      expectedTravelDate,
      briefRequirement,
      selectedServiceId,
      consent
    } = req.body;

    const errors: Record<string, string> = {};
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      errors.fullName = 'Full Name is required (minimum 2 characters)';
    }
    if (!phoneWhatsApp || typeof phoneWhatsApp !== 'string' || phoneWhatsApp.trim().length < 6) {
      errors.phoneWhatsApp = 'Valid Phone or WhatsApp number is required';
    }
    if (!treatmentSpecialty || typeof treatmentSpecialty !== 'string' || treatmentSpecialty.trim().length < 2) {
      errors.treatmentSpecialty = 'Treatment or specialty requirement is required';
    }
    if (!consent) {
      errors.consent = 'Consent to be contacted is required to process your enquiry';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed. Please verify required fields.',
        errors
      });
    }

    // Generate unique reference number: PNC-2026-XXXXXX
    const countRow = db.prepare('SELECT count(*) as count FROM enquiries').get() as { count: number };
    const nextSeq = (countRow.count + 1).toString().padStart(6, '0');
    const referenceNo = `PNC-2026-${nextSeq}`;

    const insertStmt = db.prepare(`
      INSERT INTO enquiries (
        reference_no, full_name, phone_whatsapp, email, country_city,
        preferred_destination, preferred_city, treatment_specialty,
        expected_travel_date, brief_requirement, selected_service_id, consent, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW')
    `);

    const result = insertStmt.run(
      referenceNo,
      fullName.trim(),
      phoneWhatsApp.trim(),
      email ? email.trim() : null,
      countryCity ? countryCity.trim() : null,
      preferredDestination ? preferredDestination.trim() : null,
      preferredCity ? preferredCity.trim() : null,
      treatmentSpecialty.trim(),
      expectedTravelDate ? expectedTravelDate.trim() : null,
      briefRequirement ? briefRequirement.trim() : null,
      selectedServiceId ? Number(selectedServiceId) : null,
      1
    );

    const enquiryId = Number(result.lastInsertRowid);

    // Record initial status history
    db.prepare(`
      INSERT INTO enquiry_status_history (enquiry_id, previous_status, new_status, admin_user_id, admin_user_name, note)
      VALUES (?, NULL, 'NEW', NULL, 'Web Visitor', 'Enquiry registered through public coordination portal.')
    `).run(enquiryId);

    // Record notification for admin
    db.prepare(`
      INSERT INTO notifications (type, title, message, link)
      VALUES ('ENQUIRY', 'New Enquiry Submitted', ?, '/admin/enquiries')
    `).run(`Enquiry ${referenceNo} received from ${fullName.trim()} for ${treatmentSpecialty.trim()}`);

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received successfully. A dedicated care coordinator will contact you promptly.',
      data: {
        referenceNo,
        fullName: fullName.trim(),
        status: 'NEW',
        treatmentSpecialty: treatmentSpecialty.trim(),
        createdAt: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error('Enquiry creation error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to record your enquiry. Please try again or reach us via WhatsApp directly.',
      errors: { server: err.message }
    });
  }
});
