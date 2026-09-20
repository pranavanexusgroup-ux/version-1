import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Service } from '../types';
import { useSEO } from '../hooks/useSEO';
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
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface MedicalTourismServicesPageProps {
  navigate: (path: string) => void;
  openEnquiryModal: (serviceId?: number) => void;
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

export const MedicalTourismServicesPage: React.FC<MedicalTourismServicesPageProps> = ({
  navigate,
  openEnquiryModal
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Medical Tourism & Coordination Services | Pranava Nexus Care',
    description: 'Explore the 9 non-clinical healthcare coordination services offered by M/s. PRANAVA NEXUS CARE, including hospital appointment scheduling, visa facilitation, attendant logistics, and recovery accommodation.',
    keywords: ['medical travel services', 'hospital coordination india', 'medical visa letter assistance', 'patient attendant services', 'pranava nexus care services'],
    canonicalUrl: 'https://pranavanexuscare.com/services'
  });


  useEffect(() => {
    async function loadServices() {
      try {
        const list = await api.getServices();
        setServices(list);
      } catch (err) {
        console.error('Failed to load services', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-[#075985]/15 to-transparent pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Approved Scope of Coordination
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 mt-3">
              Medical Tourism & Healthcare Travel Services
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
              Explore our complete range of 9 approved non-clinical coordination services. Designed to organize, clarify, and simplify every stage of patient travel between home and hospital.
            </p>
          </div>
        </div>
      </section>

      {/* Services List Detailed */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Statutory Scope Reminder */}
          <div className="mb-12 p-4 bg-sky-50 border border-sky-200 rounded-xl text-xs md:text-sm text-slate-700 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#075985] shrink-0 mt-0.5" />
            <div>
              <strong>Non-Clinical Coordination Framework:</strong> All services listed below are logistical, administrative, and travel-oriented. We do not provide clinical diagnosis, medical treatment, or emergency ambulance care. Medical opinions, treatment plans, and clinical procedures are delivered exclusively by authorized hospitals and licensed specialists.
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading coordination services...</div>
          ) : (
            <div className="space-y-8">
              {services.map((service, index) => {
                const IconComponent = iconMap[service.icon] || HeartPulse;
                return (
                  <div
                    key={service.id}
                    id={service.slug}
                    className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/90 hover:border-sky-300 shadow-xs transition-all"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#075985] text-white flex items-center justify-center shrink-0">
                            <IconComponent className="w-6 h-6 text-[#FFDF73]" />
                          </div>
                          <div>
                            <span className="text-xs font-mono font-bold text-[#0284C7] uppercase">
                              Service 0{index + 1}
                            </span>
                            <h3 className="text-xl font-bold font-serif text-slate-900 leading-snug">
                              {service.name}
                            </h3>
                          </div>
                        </div>

                        <p className="text-sm text-slate-700 leading-relaxed">
                          {service.full_description}
                        </p>

                        {service.requirements && (
                          <div className="bg-white rounded-xl p-4 border border-slate-200 text-xs text-slate-600">
                            <strong className="text-slate-800 flex items-center gap-1.5 mb-1">
                              <FileText className="w-3.5 h-3.5 text-[#075985]" />
                              Typical Documents or Information Needed:
                            </strong>
                            <span>{service.requirements}</span>
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-200 flex flex-col justify-between h-full space-y-4">
                        <div>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                            Availability
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Active Across Primary Hubs
                          </span>
                          <p className="text-[11px] text-slate-500 mt-2">
                            Available in Kolkata, Delhi NCR, Chennai, Bengaluru, Mumbai & International partner routes.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <button
                            onClick={() => openEnquiryModal(service.id)}
                            className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-[#075985] hover:bg-[#0369a1] transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>Request This Service</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#FFDF73]" />
                          </button>

                          <button
                            onClick={() => navigate(`/services/${service.slug}`)}
                            className="w-full py-2 px-4 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            Detailed Specifications
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
