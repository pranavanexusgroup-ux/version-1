import React, { useState } from 'react';
import { Logo } from './Logo';
import { Menu, X, ChevronRight, Lock, Search } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
  openEnquiryModal: (serviceId?: number, destination?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate, openEnquiryModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (query.length >= 2) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center text-left focus:outline-hidden"
          >
            <Logo />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#075985] bg-sky-50 font-semibold'
                      : 'text-slate-700 hover:text-[#075985] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={submitSearch} className="relative hidden lg:block">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search"
                aria-label="Search the website"
                className="w-36 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-2 text-xs outline-none transition focus:w-48 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
            </form>
            <button
              onClick={() => openEnquiryModal()}
              id="header-cta-btn"
              className="inline-flex items-center justify-center px-4.5 py-2.5 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-[#075985] to-[#0284C7] hover:from-[#0369a1] hover:to-[#0284c7] shadow-sm hover:shadow-md transition-all active:scale-98"
            >
              Get Travel Assistance
              <ChevronRight className="w-4 h-4 ml-1 text-[#FFDF73]" />
            </button>
            <button
              onClick={() => handleNav('/admin')}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-[#075985]"
              title="Operational Administration Portal"
            >
              <Lock className="h-3 w-3" />
              Admin
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => openEnquiryModal()}
              className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-[#075985]"
            >
              Assistance
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium ${
                currentPath === link.path
                  ? 'bg-sky-50 text-[#075985] font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <form onSubmit={submitSearch} className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search guides, services, destinations"
                aria-label="Search the website"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </form>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openEnquiryModal();
              }}
              className="w-full py-3 rounded-lg text-sm font-semibold text-center text-white bg-linear-to-r from-[#075985] to-[#0284C7]"
            >
              Get Medical Travel Assistance
            </button>
            <button
              onClick={() => handleNav('/admin')}
              className="w-full py-2.5 rounded-lg text-xs font-medium text-center text-slate-600 bg-slate-100 flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Staff / Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
