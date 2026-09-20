import React, { useState, useEffect } from 'react';
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { EnquiryModal } from './components/EnquiryModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MedicalTourismServicesPage } from './pages/MedicalTourismServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { InternationalPatientsPage } from './pages/InternationalPatientsPage';
import { DomesticPatientsPage } from './pages/DomesticPatientsPage';
import { PatientStoriesPage } from './pages/PatientStoriesPage';
import { FaqPage } from './pages/FaqPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { SearchPage } from './pages/SearchPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminLocations } from './pages/admin/AdminLocations';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminPartners } from './pages/admin/AdminPartners';
import { AdminSocialMedia } from './pages/admin/AdminSocialMedia';
import { AdminContent } from './pages/admin/AdminContent';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminUsers } from './pages/admin/AdminUsers';

export default function App() {
  const getAppPath = () => {
  const pathname = window.location.pathname || '/';
  const path = BASE_PATH && pathname.startsWith(BASE_PATH)
    ? pathname.slice(BASE_PATH.length) || '/'
    : pathname;

  return `${path}${window.location.search}`;
};

const [currentPath, setCurrentPath] = useState<string>(getAppPath());
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalServiceId, setModalServiceId] = useState<number | undefined>(undefined);
  const [modalDestination, setModalDestination] = useState<string | undefined>(undefined);

  // Sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
  setCurrentPath(getAppPath());
};
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullPath = `${BASE_PATH}${cleanPath === '/' ? '/' : cleanPath}`;

  window.history.pushState({}, '', fullPath);
  setCurrentPath(cleanPath);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

  const openEnquiryModal = (serviceId?: number, destination?: string) => {
    setModalServiceId(serviceId);
    setModalDestination(destination);
    setModalOpen(true);
  };

  // Route matching logic
  const renderRoute = () => {
    const [path, queryString] = currentPath.split('?');
    const searchQuery = new URLSearchParams(queryString || '').get('q') || '';

    // --- Admin Routes ---
    if (path === '/admin' || path === '/admin/login') {
      return <AdminLogin navigate={navigate} />;
    }

    if (path.startsWith('/admin')) {
      return (
        <AdminLayout currentPath={path} navigate={navigate}>
          {path === '/admin/dashboard' && <AdminDashboard navigate={navigate} />}
          {path === '/admin/enquiries' && <AdminEnquiries />}
          {path === '/admin/locations' && <AdminLocations />}
          {path === '/admin/services' && <AdminServices />}
          {path === '/admin/partners' && <AdminPartners />}
          {path === '/admin/social-media' && <AdminSocialMedia />}
          {path === '/admin/content' && <AdminContent />}
          {path === '/admin/settings' && <AdminSettings />}
          {path === '/admin/users' && <AdminUsers />}
          {!['/admin/dashboard', '/admin/enquiries', '/admin/locations', '/admin/services', '/admin/partners', '/admin/social-media', '/admin/content', '/admin/settings', '/admin/users'].includes(path) && (
            <AdminDashboard navigate={navigate} />
          )}
        </AdminLayout>
      );
    }

    // --- Public Service Details Route ---
    if (path.startsWith('/services/') && path.length > 10) {
      const slug = path.replace('/services/', '');
      return (
        <ServiceDetailPage
          slug={slug}
          navigate={navigate}
          openEnquiryModal={openEnquiryModal}
        />
      );
    }

    // --- Public Blog Details Route ---
    if (path.startsWith('/blog/') && path.length > 6) {
      const slug = path.replace('/blog/', '');
      return (
        <BlogDetailPage
          slug={slug}
          navigate={navigate}
          openEnquiryModal={openEnquiryModal}
        />
      );
    }

    if (path === '/search') {
      return <SearchPage query={searchQuery} navigate={navigate} />;
    }

    // --- Static Public Routes ---
    switch (path) {
      case '/':
        return <HomePage navigate={navigate} openEnquiryModal={openEnquiryModal} />;
      case '/about':
        return <AboutPage navigate={navigate} openEnquiryModal={openEnquiryModal} />;
      case '/services':
        return (
          <MedicalTourismServicesPage
            navigate={navigate}
            openEnquiryModal={openEnquiryModal}
          />
        );
      case '/destinations':
        return (
          <DestinationsPage
            navigate={navigate}
            openEnquiryModal={openEnquiryModal}
          />
        );
      case '/how-it-works':
        return (
          <HowItWorksPage
            navigate={navigate}
            openEnquiryModal={openEnquiryModal}
          />
        );
      case '/international-patients':
        return (
          <InternationalPatientsPage
            navigate={navigate}
            openEnquiryModal={openEnquiryModal}
          />
        );
      case '/domestic-patients':
        return (
          <DomesticPatientsPage
            navigate={navigate}
            openEnquiryModal={openEnquiryModal}
          />
        );
      case '/patient-stories':
        return (
          <PatientStoriesPage
            navigate={navigate}
            openEnquiryModal={openEnquiryModal}
          />
        );
      case '/faq':
        return <FaqPage navigate={navigate} openEnquiryModal={openEnquiryModal} />;
      case '/blog':
        return <BlogPage navigate={navigate} openEnquiryModal={openEnquiryModal} />;
      case '/contact':
        return <ContactPage navigate={navigate} openEnquiryModal={openEnquiryModal} />;
      case '/legal':
        return <LegalPage navigate={navigate} />;
      case '/privacy':
        return <LegalPage navigate={navigate} defaultTab="privacy" />;
      case '/terms':
        return <LegalPage navigate={navigate} defaultTab="terms" />;
      case '/disclaimer':
        return <LegalPage navigate={navigate} defaultTab="disclaimer" />;
      default:
        return <NotFoundPage navigate={navigate} />;
    }
  };

  const isAdminView = currentPath.startsWith('/admin');

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 antialiased selection:bg-sky-200 selection:text-sky-900">
        {/* Global Header (for public views) */}
        {!isAdminView && (
          <Header
            currentPath={currentPath}
            navigate={navigate}
            openEnquiryModal={openEnquiryModal}
          />
        )}

        {/* Dynamic Route View */}
        <main className="flex-1">{renderRoute()}</main>

        {/* Global Footer (for public views) */}
        {!isAdminView && (
          <Footer
            navigate={navigate}
            openEnquiryModal={openEnquiryModal}
          />
        )}

        {/* Floating WhatsApp Quick-Help (public views) */}
        {!isAdminView && <WhatsAppButton />}

        {/* Universal Treatment Travel Enquiry Modal */}
        <EnquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          preselectedServiceId={modalServiceId}
          prefilledDestination={modalDestination}
        />
      </div>
    </AuthProvider>
  );
}
