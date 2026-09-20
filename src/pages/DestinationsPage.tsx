import React, { useEffect, useState } from 'react';
import { LocationServiceEngine } from '../components/LocationServiceEngine';
import { api } from '../services/api';
import { Location, Country } from '../types';
import { MapPin, CheckCircle2, ArrowRight, ShieldCheck, Globe2 } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

interface DestinationsPageProps {
  navigate: (path: string) => void;
  openEnquiryModal: (serviceId?: number, destination?: string) => void;
}

export const DestinationsPage: React.FC<DestinationsPageProps> = ({
  navigate,
  openEnquiryModal
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Healthcare Hubs & Global Destinations | Pranava Nexus Care',
    description: 'Explore accredited hospital destinations and live availability across India (Kolkata, Delhi NCR, Chennai, Mumbai, Bengaluru, Hyderabad) and international gateways (Dubai, Bangkok, Singapore).',
    keywords: ['medical tourism destinations', 'kolkata hospital network', 'delhi ncr medical travel', 'chennai healthcare tourism', 'international patient destinations'],
    canonicalUrl: 'https://pranavanexuscare.com/destinations'
  });


  useEffect(() => {
    async function loadLocations() {
      try {
        const locs = await api.getLocations();
        setLocations(locs);
      } catch (err) {
        console.error('Failed to load locations', err);
      } finally {
        setLoading(false);
      }
    }
    loadLocations();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-[#075985]/15 to-transparent pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Healthcare Network Hubs
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 mt-3">
              Destinations & Healthcare Hubs
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
              We coordinate medical travel across premier healthcare cities in India and select international medical destinations. Explore live availability status, verified services, and specialty strengths below.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Directory */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LocationServiceEngine openEnquiryModal={openEnquiryModal} />
        </div>
      </section>

      {/* All Available Locations Grid */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl font-bold font-serif text-slate-900">
              Active Medical Hubs Directory
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Real-time operational status maintained by our clinical logistics administration team in Kolkata.
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading destinations directory...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                          <span className="text-base">{loc.country_flag || '🌐'}</span>
                          <span>{loc.country_name}</span>
                        </div>
                        <h3 className="text-lg font-bold font-serif text-slate-900 leading-snug">
                          {loc.city_name}
                        </h3>
                      </div>

                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          loc.availability_status === 'AVAILABLE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {loc.availability_status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {loc.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Verified: {loc.last_verified_date || '2026-07-15'}
                    </span>
                    <button
                      onClick={() => openEnquiryModal(undefined, `${loc.city_name}, ${loc.country_name}`)}
                      className="text-xs font-semibold text-[#075985] hover:text-[#0284C7] flex items-center gap-1"
                    >
                      <span>Enquire for Hub</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
