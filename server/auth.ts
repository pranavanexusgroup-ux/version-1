import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db, hashPassword } from './db.js';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role_slug: string;
  role_name: string;
}

// In-memory active tokens map: token -> { user, expiresAt }
const activeTokens = new Map<string, { user: AuthUser; expiresAt: number }>();

export function generateToken(user: AuthUser): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeTokens.set(token, { user, expiresAt });
  return token;
}

export function revokeToken(token: string) {
  activeTokens.delete(token);
}

export function verifyToken(token: string): AuthUser | null {
  const session = activeTokens.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeTokens.delete(token);
    return null;
  }
  return session.user;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in with valid admin credentials.',
      errors: { auth: 'Missing or invalid token' }
    });
  }

  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please log in again.',
      errors: { auth: 'Invalid token' }
    });
  }

  req.user = user;
  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Super Admin has unrestricted access to everything
    if (req.user.role_slug === 'super-admin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role_slug)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions for this operation.',
        errors: { permission: `Required roles: ${allowedRoles.join(', ')}` }
      });
    }

    next();
  };
}

export function logActivity(userId: number | undefined, userName: string | undefined, action: string, module: string, details: string, ip: string = '127.0.0.1') {
  try {
    const stmt = db.prepare('INSERT INTO admin_activity_logs (user_id, user_name, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(userId || null, userName || 'System', action, module, details, ip);
  } catch (err) {
    console.error('Failed to log admin activity:', err);
  }
}
