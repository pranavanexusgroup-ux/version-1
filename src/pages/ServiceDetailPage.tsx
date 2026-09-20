import React, { useEffect, useState } from 'react';
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
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  HelpCircle
} from 'lucide-react';

interface ServiceDetailPageProps {
  slug: string;
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

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  slug,
  navigate,
  openEnquiryModal
}) => {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadService() {
      try {
        const s = await api.getServiceBySlug(slug);
        setService(s);
      } catch (err) {
        console.error('Failed to load service', err);
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <div className="w-8 h-8 border-3 border-[#075985] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-slate-500">Retrieving service specifications...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center px-4">
        <h2 className="text-2xl font-bold font-serif text-slate-800">Service Not Found</h2>
        <p className="text-sm text-slate-600 mt-2">The requested coordination service could not be located.</p>
        <button
          onClick={() => navigate('/services')}
          className="mt-4 px-4 py-2 bg-[#075985] text-white rounded-lg text-xs font-semibold"
        >
          View All Approved Services
        </button>
      </div>
    );
  }

  const IconComponent = iconMap[service.icon] || HeartPulse;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-[#075985]/15 to-transparent pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#075985] mb-2">
            <button onClick={() => navigate('/services')} className="hover:underline">
              Services
            </button>
            <span>/</span>
            <span className="text-slate-500">{service.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 mt-4">
            <div className="w-16 h-16 rounded-2xl bg-[#075985] text-white flex items-center justify-center shrink-0 shadow-md">
              <IconComponent className="w-9 h-9 text-[#FFDF73]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 leading-tight">
                {service.name}
              </h1>
              <p className="text-slate-600 text-sm md:text-base mt-2 max-w-3xl">
                {service.short_description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Scope & Process */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900 mb-3">
                  Service Scope & Description
                </h2>
                <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-3">
                  <p>{service.full_description}</p>
                  <p>
                    All communication is handled systematically by dedicated coordinators in Kolkata. We liaise between the patient or attendant and the respective hospital department, ensuring all enquiries receive documented responses without unnecessary delays.
                  </p>
                </div>
              </div>

              {service.requirements && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                  <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#075985]" />
                    Prerequisites & Medical Documentation
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    To coordinate this service effectively, the following information is typically gathered:
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                    {service.requirements}
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    Note: Patients share only diagnostic documents they are comfortable providing. We maintain strict privacy and data confidentiality protocols.
                  </p>
                </div>
              )}

              {/* Non-Clinical Safeguard */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 space-y-1.5">
                <strong className="block font-bold text-amber-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Coordination Boundaries & Clinical Integrity
                </strong>
                <p>
                  Pranava Nexus Care provides purely administrative coordination for this service. We do not provide medical consultation, clinical advice, or prescribe medications. All medical evaluations and treatments are conducted strictly by qualified physicians and certified hospitals.
                </p>
              </div>
            </div>

            {/* Right Column: CTA & Hub Details */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold font-serif text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  Request Coordination
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Start your enquiry for <strong>{service.name}</strong>. A patient coordinator will review your case.
                </p>

                <button
                  onClick={() => openEnquiryModal(service.id)}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#075985] hover:bg-[#0369a1] transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Initiate Service Request</span>
                  <ArrowRight className="w-4 h-4 text-[#FFDF73]" />
                </button>

                <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Dedicated Kolkata Coordinator Assigned
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Direct Liaison with Treating Facility
                  </div>
                </div>
              </div>

              <div className="bg-sky-50 rounded-2xl p-6 border border-sky-100 text-xs text-slate-700 space-y-2">
                <h4 className="font-bold text-[#075985] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#0284C7]" />
                  Have Questions on This Service?
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Connect with our coordination desk via WhatsApp for preliminary inquiries regarding document formats or travel timelines.
                </p>
                <a
                  href={`https://wa.me/919876543210?text=Hello%20Pranava%20Nexus%20Care,%20I%20have%20an%20enquiry%20regarding%20${encodeURIComponent(service.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 pt-1"
                >
                  <span>Chat on WhatsApp (+91 98765 43210)</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
