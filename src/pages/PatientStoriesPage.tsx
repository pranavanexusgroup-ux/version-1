import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Testimonial } from '../types';
import { Star, ShieldCheck, CheckCircle2, MessageSquareQuote, ArrowRight, ShieldAlert } from 'lucide-react';

interface PatientStoriesPageProps {
  navigate: (path: string) => void;
  openEnquiryModal: () => void;
}

export const PatientStoriesPage: React.FC<PatientStoriesPageProps> = ({
  navigate,
  openEnquiryModal
}) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const list = await api.getTestimonials();
        setTestimonials(list);
      } catch (err) {
        console.error('Failed to load testimonials', err);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-[#075985]/15 to-transparent pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Patient Experiences & Feedback
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 mt-3">
              Patient Journey Stories
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
              Read how our non-clinical logistical coordination, appointment facilitation, and attendant care have supported patients and their families across India and internationally.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Transparency / Demo Notice */}
          <div className="mb-10 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs md:text-sm text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Sample Demonstration Stories Notice:</strong> Under our strict regulatory compliance policy, any patient accounts published during initial pre-launch phases are clearly marked with a <span className="font-bold text-amber-950 bg-amber-200 px-1.5 py-0.5 rounded text-[11px]">DEMO</span> tag to ensure complete transparency. Authentic patient feedback requires verified written consent in accordance with medical data privacy guidelines.
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading patient stories...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-sky-300 transition-all"
                >
                  {item.is_demo === 1 && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-bold text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-xs">
                      DEMO
                    </div>
                  )}

                  <div>
                    <div className="flex items-center text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6">
                      "{item.testimonial}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.display_name}</h4>
                      <p className="text-slate-500 text-[11px]">
                        Origin: {item.country} &bull; Hub: {item.destination}
                      </p>
                    </div>

                    {item.verified === 1 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Box */}
          <div className="mt-16 text-center bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-3xl mx-auto space-y-4">
            <h3 className="text-xl font-bold font-serif text-slate-900">
              Let us coordinate your healthcare journey with the same dedication
            </h3>
            <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto">
              Our patient liaisons in Kolkata are ready to assist with scheduling, accommodation, and document preparation.
            </p>
            <button
              onClick={openEnquiryModal}
              className="px-6 py-3 rounded-xl font-semibold text-xs text-white bg-[#075985] hover:bg-[#0369a1] shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Submit Treatment Travel Enquiry</span>
              <ArrowRight className="w-4 h-4 text-[#FFDF73]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
