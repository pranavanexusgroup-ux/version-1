import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo';
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  HeartPulse,
  Handshake,
  Share2,
  FileText,
  Sliders,
  Users,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  currentPath: string;
  navigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  navigate,
  children
}) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Auth guard
  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const navItems = [
    { label: 'Overview Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Enquiries Workflow', path: '/admin/enquiries', icon: ClipboardList },
    { label: 'Locations & Engine', path: '/admin/locations', icon: MapPin },
    { label: 'Approved Services', path: '/admin/services', icon: HeartPulse },
    { label: 'Our Partners', path: '/admin/partners', icon: Handshake },
    { label: 'Facebook & YouTube', path: '/admin/social-media', icon: Share2 },
    { label: 'Content CMS', path: '/admin/content', icon: FileText },
    { label: 'System Settings', path: '/admin/settings', icon: Sliders },
    { label: 'Users & Audit Logs', path: '/admin/users', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Logo variant="light" />
        </div>

        {/* User Tag */}
        <div className="p-4 mx-3 my-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#075985] text-white flex items-center justify-center font-bold text-xs uppercase">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
            <span className="text-[10px] text-[#FFDF73] font-mono uppercase tracking-wider block">
              {user?.role_code || 'SUPER_ADMIN'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== '/admin/dashboard' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-[#075985] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFDF73]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Public Website
            </span>
            <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">Live</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <Logo variant="light" />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 flex items-center gap-2"
            >
              <item.icon className="w-4 h-4 text-slate-400" />
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-sky-400 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Public Site</span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="text-xs text-rose-400 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">M/s. PRANAVA NEXUS CARE</span>
            <span>&bull;</span>
            <span>Kolkata Operations Control</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Real Database Active
            </span>
          </div>
        </header>

        {/* Page Children Container */}
        <div className="p-6 md:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
};
