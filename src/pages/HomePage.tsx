import React, { useEffect, useState } from 'react';
import { TrustStrip } from '../components/TrustStrip';
import { LocationServiceEngine } from '../components/LocationServiceEngine';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { GoogleReviewsSection } from '../components/GoogleReviewsSection';
import { GlobalConnectionMap } from '../components/GlobalConnectionMap';
import { OurPartnersSection } from '../components/OurPartnersSection';
import { SocialEngagementSection } from '../components/SocialEngagementSection';
import { HeroSlideshow } from '../components/HeroSlideshow';
import { useSEO } from '../hooks/useSEO';
import { api } from '../services/api';
import { Service } from '../types';
import {
  FileSearch,
  CalendarCheck2,
  FileCheck,
  Compass,
  Plane,
  Hotel,
  Car,
  Users,
  HeartPulse,
  Hospital,
  UserRound,
  Scissors,
  Cross,
  Stethoscope,
  Ambulance,
  Pill,
  Smile,
  FileText,
  PlaneLanding,
  Globe2,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  MapPin
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
  openEnquiryModal: (serviceId?: number, destination?: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  FileSearch,
  CalendarCheck2,
  FileCheck,
  Compass,
  Plane,
  Hotel,
  Car,
  Users,
  HeartPulse
};

const medicalTourismNodes = [
  { label: 'Hospital care', icon: Hospital, color: 'text-[#075985]' },
  { label: 'Doctor coordination', icon: UserRound, color: 'text-[#0284C7]' },
  { label: 'Surgical care', icon: Scissors, color: 'text-[#0F766E]' },
  { label: 'Medical cross', icon: Cross, color: 'text-[#0E7490]' },
  { label: 'Healthcare', icon: Stethoscope, color: 'text-[#075985]' },
  { label: 'Ambulance support', icon: Ambulance, color: 'text-[#0F766E]' },
  { label: 'Pharmacy', icon: Pill, color: 'text-[#0284C7]' },
  { label: 'Dental care', icon: Smile, color: 'text-[#0E7490]' },
  { label: 'Medical visa documents', icon: FileText, color: 'text-[#075985]' },
  { label: 'Air travel', icon: Plane, color: 'text-[#0284C7]' },
  { label: 'International patients', icon: Users, color: 'text-[#0F766E]' },
  { label: 'Accommodation', icon: Hotel, color: 'text-[#075985]' },
  { label: 'Airport travel', icon: PlaneLanding, color: 'text-[#0284C7]' },
  { label: 'Global healthcare', icon: Globe2, color: 'text-[#0E7490]' },
  { label: 'Patient assistance', icon: HeartHandshake, color: 'text-[#0F766E]' }
];

export const HomePage: React.FC<HomePageProps> = ({ navigate, openEnquiryModal }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Hook Implementation: Dynamic SEO Configuration
  useSEO({
    title: 'Global Medical Tourism & Patient Care Coordination',
    description: 'Empowering your medical travel with care, precision, and trust. Structured healthcare journeys, hospital appointment coordination, and patient attendant logistics in Kolkata and global hubs.',
    keywords: [
      'medical tourism india',
      'healthcare travel facilitator',
      'patient care coordination',
      'kolkata medical tourism services',
      'hospital appointment coordination',
      'medical visa assistance',
      'attendant support medical travel',
      'pranava nexus care'
    ],
    canonicalUrl: 'https://pranavanexuscare.com/',
    ogImage: `${import.meta.env.BASE_URL}assets/images/patient-coordination-hero.jpg`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Pranava Nexus Care – Global Medical Tourism Services',
      'description': 'Structured healthcare-travel coordination, hospital appointments, and patient attendant logistics.',
      'publisher': {
        '@type': 'MedicalBusiness',
        'name': 'M/s. PRANAVA NEXUS CARE',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '5A, Kalipada Mukherjee Road, Purba Barisha',
          'addressLocality': 'Kolkata',
          'postalCode': '70008',
          'addressCountry': 'IN'
        }
      }
    }
  });

  useEffect(() => {
    async function loadServices() {
      try {
        const sList = await api.getServices();
        setServices(sList);
      } catch (err) {
        console.error('Failed to load services', err);
      } finally {
        setLoadingServices(false);
      }
    }
    loadServices();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Front-Loaded Realistic Patient Coordination Background Slideshow */}
      <section className="relative border-b border-slate-900">
        <HeroSlideshow>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center -mt-15">
            {/* Hero Left: Strategic Proposition */}
            <div className="lg:col-span-7 space-y-6">
            
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-white leading-[1.15] tracking-tight drop-shadow-sm">
                Empowering Your Medical Travel With Care, Precision, and Trust.
              </h1>

              {/* Tagline Callout */}
              <div className="flex items-center gap-2 text-[#FFDF73] font-serif italic text-base sm:text-lg font-semibold">
                <span className="h-px w-6 bg-[#F4C430]"></span>
                <span>"One Nexus. Endless Opportunities."</span>
                <span className="h-px w-6 bg-[#F4C430]"></span>
              </div>

              {/* Descriptive Copy */}
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl drop-shadow-xs">
                M/s. PRANAVA NEXUS CARE coordinates non-clinical travel, hospital appointment requests, medical records relay, and patient attendant logistics. Whether travelling within India or across international borders, our dedicated team ensures your healthcare journey is structured, transparent, and dignified.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => openEnquiryModal()}
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-linear-to-r from-[#075985] to-[#0284C7] hover:from-[#0369a1] hover:to-[#0284c7] shadow-lg shadow-sky-950/50 hover:shadow-sky-800/60 transition-all flex items-center justify-center gap-2 border border-sky-400/40 cursor-pointer"
                >
                  <span>Get Medical Travel Assistance</span>
                  <ArrowRight className="w-4 h-4 text-[#FFDF73]" />
                </button>

                <a
                  href="#destination-engine"
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-100 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-[#0EA5E9]" />
                  <span>Explore Destinations & Services</span>
                </a>
              </div>

              {/* Verified Features Pills */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-200">
                <span className="flex items-center gap-1.5 font-medium bg-slate-900/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                  Non-Clinical Coordination
                </span>
                <span className="flex items-center gap-1.5 font-medium bg-slate-900/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                  Accredited Hospital Network
                </span>
                <span className="flex items-center gap-1.5 font-medium bg-slate-900/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                  Attendant Support Included
                </span>
              </div>
            </div>

            {/* Hero Right: Circular Medical Tourism Ecosystem */}
            <div className="lg:col-span-5 flex justify-center">
              <figure
                aria-labelledby="medical-tourism-graphic-title"
                className="relative w-full max-w-[530px] aspect-square"
              >
                <div className="absolute inset-[10%] rounded-full border border-sky-200/50 bg-white/5 shadow-[0_0_70px_rgba(14,165,233,0.16)]" />
                <div className="absolute inset-[18%] rounded-full border border-dashed border-teal-200/50" />
                <div className="absolute inset-[27%] rounded-full border border-white/20" />

                {medicalTourismNodes.map(({ label, icon: Icon, color }, index) => {
                  const angle = (index * 360) / medicalTourismNodes.length;
                  return (
                    <div
                      key={label}
                      className="medical-tourism-orbit-node absolute left-1/2 top-1/2"
                      style={{
                        '--node-angle': `${angle}deg`,
                        animationDelay: `${-index * 2.4}s`
                      } as React.CSSProperties}
                    >
                      <div
                        className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/95 shadow-lg shadow-sky-950/20 backdrop-blur-sm transition-transform duration-300 hover:scale-110"
                        title={label}
                        aria-label={label}
                      >
                        <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.8} />
                      </div>
                    </div>
                  );
                })}

                <div className="absolute left-1/2 top-1/2 flex aspect-square w-[35%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-white/90 bg-linear-to-br from-[#075985] via-[#0284C7] to-[#0F766E] text-center shadow-2xl shadow-sky-950/40">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white">
                    <HeartPulse className="h-7 w-7" strokeWidth={1.7} />
                  </div>
                  <h2 id="medical-tourism-graphic-title" className="max-w-[110px] text-sm font-bold leading-tight text-white">
                    Medical Tourism
                  </h2>
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                    Care in motion
                  </span>
                </div>
              </figure>
            </div>
          </div>
        </HeroSlideshow>
      </section>

      {/* Verified Capabilities Strip */}
      <TrustStrip />

      <OurPartnersSection />

      {/* Approved Services Grid */}
      <section className="py-16 lg:py-24 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Core Coordination Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 mt-3">
              Comprehensive Healthcare-Travel Services
            </h2>
            <p className="text-slate-600 text-sm md:text-base mt-3 leading-relaxed">
              We specialize strictly in non-clinical logistical and administrative coordination. Every service is tailored to respect the patient's choices and family peace of mind.
            </p>
          </div>

          {loadingServices ? (
            <div className="py-12 text-center text-slate-500">Loading approved coordination services...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const IconComponent = iconMap[service.icon] || HeartPulse;
                return (
                  <div
                    key={service.id}
                    className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-white text-[#075985] border border-slate-200 flex items-center justify-center mb-4 group-hover:bg-[#075985] group-hover:text-white transition-colors shadow-xs">
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <h3 className="text-lg font-bold font-serif text-slate-900 mb-2 leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                        {service.short_description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/services/${service.slug}`)}
                        className="text-xs font-semibold text-[#075985] hover:text-[#0284C7] flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => openEnquiryModal(service.id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-[#075985] hover:text-white transition-colors text-slate-700"
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Location & Service Availability Engine */}
      <section className="py-16 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LocationServiceEngine openEnquiryModal={openEnquiryModal} />
        </div>
      </section>

      {/* 6-Step Coordination Pathway */}
      <HowItWorksSection openEnquiryModal={() => openEnquiryModal()} navigate={navigate} />

      {/* Patient Stories & Verified Google Feedback */}
      <GoogleReviewsSection />

      <SocialEngagementSection />

      {/* Global Connection Hub */}
      <GlobalConnectionMap navigate={navigate} />

    </div>
  );
};
