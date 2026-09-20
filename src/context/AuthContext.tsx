import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message: string; errors?: any }>;
  logout: () => Promise<void>;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('pnc_admin_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const profile = await api.getAdminMe();
          if (profile) {
            setUser(profile);
          } else {
            setUser(null);
            setToken(null);
            localStorage.removeItem('pnc_admin_token');
          }
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem('pnc_admin_token');
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.adminLogin(credentials);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('pnc_admin_token', res.data.token);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message, errors: res.errors };
  };

  const logout = async () => {
    try {
      await api.adminLogout();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('pnc_admin_token');
    }
  };

  const hasRole = (roles: string[]) => {
    if (!user) return false;
    if (user.role_slug === 'super-admin') return true;
    return roles.includes(user.role_slug);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user || !!token, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
