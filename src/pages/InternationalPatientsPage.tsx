import React from 'react';
import { Globe, Plane, FileCheck, PhoneCall, ArrowRight, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

interface InternationalPatientsPageProps {
  navigate: (path: string) => void;
  openEnquiryModal: () => void;
}

export const InternationalPatientsPage: React.FC<InternationalPatientsPageProps> = ({
  navigate,
  openEnquiryModal
}) => {
  useSEO({
    title: 'International Patient Care Coordination | Pranava Nexus Care',
    description: 'Complete cross-border medical travel facilitation for patients coming to India. Medical visa invitations, FRRO guidance, airport reception, translation, and hospital admission planning.',
    keywords: ['international medical travel india', 'medical visa assistance kolkata', 'frro registration medical', 'cross border healthcare facilitation'],
    canonicalUrl: 'https://pranavanexuscare.com/international-patients'
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-[#075985]/15 to-transparent pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Cross-Border Healthcare Liaison
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 mt-3">
              International Patient Travel Coordination
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
              Serving patients travelling from Bangladesh, Nepal, Bhutan, East Africa, the Middle East, and worldwide seeking accredited super-specialty medical treatment in India.
            </p>
          </div>
        </div>
      </section>

      {/* Main Guide Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-10 text-slate-700 leading-relaxed text-sm md:text-base">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900 mb-4">
                  Navigating Medical Travel to India
                </h2>
                <p>
                  Travelling to another country for specialized healthcare requires meticulous planning. Different languages, visa requirements, currency regulations, and unfamiliar hospital systems can be overwhelming. M/s. PRANAVA NEXUS CARE acts as your dedicated local partner, organizing the sequence of events before your flight takes off.
                </p>
              </div>

              {/* Step-by-Step International Support */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold font-serif text-slate-900">
                  Key Support Areas for International Visitors
                </h3>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#075985] flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5 text-[#0284C7]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Medical Visa Assistance (M-Visa & Attendant MX-Visa)</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      We coordinate formal Medical Visa Invitation Letters from accredited hospital international desks for both patient and accompanying attendants, facilitating consular clearance.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#075985] flex items-center justify-center shrink-0">
                    <Plane className="w-5 h-5 text-[#0284C7]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Airport Pickup & Ground Transit</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Our coordinator arranges personalized airport greeting upon arrival in Kolkata (Netaji Subhash Chandra Bose International Airport - CCU), New Delhi, Chennai, or Mumbai.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#075985] flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-5 h-5 text-[#0284C7]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Language, Attendant Lodging & Practical Essentials</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Support with local SIM card registration, currency exchange guidance, interpreter coordination, and booking clean recovery apartments or serviced guest houses near the hospital.
                    </p>
                  </div>
                </div>
              </div>

              {/* Regulatory Notice */}
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong className="block font-bold text-amber-950 mb-1">
                  Compliance and Legal Statement:
                </strong>
                Pranava Nexus Care facilitates non-clinical travel logistics, administrative translation liaison, and hospital enquiry conveyance. We do not act as immigration authorities, do not guarantee visa approvals, and do not practice medicine.
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold font-serif text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  Overseas Coordination
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Submit patient diagnostic summaries to receive preliminary hospital appointment timeframes and visa assistance information.
                </p>

                <button
                  onClick={openEnquiryModal}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#075985] hover:bg-[#0369a1] transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Start International Enquiry</span>
                  <ArrowRight className="w-4 h-4 text-[#FFDF73]" />
                </button>

                <div className="pt-2 text-xs text-slate-500">
                  Direct WhatsApp Liaison available in English, Hindi, and Bengali:
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#075985] font-bold block mt-1 hover:underline"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
