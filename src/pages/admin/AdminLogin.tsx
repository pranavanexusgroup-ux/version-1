import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  navigate: (path: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ navigate }) => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('admin@pranavanexuscare.com');
  const [password, setPassword] = useState('NexusAdmin@2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (user) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Invalid administrator login credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Login error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreFill = (role: 'admin' | 'content') => {
    if (role === 'admin') {
      setEmail('admin@pranavanexuscare.com');
      setPassword('NexusAdmin@2026!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-[#075985] to-[#0369a1] p-6 text-white text-center">
          <div className="flex justify-center mb-2">
            <Logo variant="light" />
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#FFDF73] font-bold block mt-1">
            Operational Management Portal
          </span>
          <h2 className="text-xl font-bold font-serif mt-1">
            Staff & CMS Authentication
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent"
                  placeholder="admin@pranavanexuscare.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-bold text-xs text-white bg-[#075985] hover:bg-[#0369a1] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In To Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#FFDF73]" />
                </>
              )}
            </button>
          </form>

          {/* Development / Demo Quick-fill */}
          <div className="pt-3 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 text-xs text-slate-600 rounded-b-2xl">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-[#075985]" />
              <span>Development Access Credentials:</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Default Super Admin credentials seeded in SQLite/MySQL database:
            </p>
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2 font-mono text-[11px]">
              <div>
                <span className="text-slate-400">User:</span> admin@pranavanexuscare.com
                <br />
                <span className="text-slate-400">Pass:</span> NexusAdmin@2026!
              </div>
              <button
                type="button"
                onClick={() => handlePreFill('admin')}
                className="px-2.5 py-1 bg-sky-50 text-[#075985] hover:bg-sky-100 rounded font-semibold text-[10px]"
              >
                Auto-Fill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
