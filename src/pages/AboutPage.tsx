import React from 'react';
import { ShieldCheck, MapPin, Building2, Calendar, Target, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

interface AboutPageProps {
  navigate: (path: string) => void;
  openEnquiryModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate, openEnquiryModal }) => {
  useSEO({
    title: 'About Us | M/s. PRANAVA NEXUS CARE',
    description: 'Learn about M/s. PRANAVA NEXUS CARE – a dedicated non-clinical medical tourism facilitator headquartered in Kolkata, West Bengal, India. Our mission, values, and hospital network.',
    keywords: ['about pranava nexus care', 'medical tourism facilitator kolkata', 'healthcare travel mission', 'registered healthcare travel india'],
    canonicalUrl: 'https://pranavanexuscare.com/about'
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="bg-linear-to-b from-[#075985]/15 to-transparent pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Organizational Identity & Mission
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 mt-3">
              About M/s. PRANAVA NEXUS CARE
            </h1>
            <p className="text-slate-600 text-base sm:text-lg mt-3 font-serif italic text-[#0284C7]">
              "One Nexus. Endless Opportunities."
            </p>
            <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
              Established with an unyielding commitment to patient dignity, transparency, and logistical excellence, Pranava Nexus Care acts as a dedicated non-clinical bridge connecting patients worldwide with premier healthcare ecosystems.
            </p>
          </div>
        </div>
      </section>

      {/* Main Narrative & Governance */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Narrative Column */}
            <div className="lg:col-span-8 space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900 mb-3">
                  Our Background & Registration
                </h2>
                <p>
                  M/s. PRANAVA NEXUS CARE is a legally constituted coordination enterprise established under a registered deed dated <strong>15 July 2026</strong>. Operating from its principal registered head office at <strong>5A, Kalipada Mukherjee Road, Purba Barisha, Kolkata – 700 008, West Bengal, India</strong>, the organization was founded to address the fragmented, often opaque nature of medical travel.
                </p>
                <p className="mt-3">
                  Whether an international patient is flying into India for complex surgical care, or a domestic family is travelling inter-state to access a specialized super-specialty hospital in Kolkata, New Delhi, Chennai, or Bengaluru, healthcare-travel involves numerous non-clinical challenges. We bridge this critical gap.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900 mb-3">
                  Our Philosophy & Approach
                </h2>
                <p>
                  We believe that patients and their families should never feel vulnerable or lost in unfamiliar cities. Healthcare-travel is deeply personal, stressful, and emotionally demanding. By providing structured pre-arrival coordination, transparent scheduling with accredited hospitals, and dedicated on-ground attendant support, we ensure that families can focus entirely on medical care and emotional reassurance.
                </p>
                <p className="mt-3">
                  Our coordination model is built upon three foundational tenets:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Total Patient Autonomy:</strong> Patients choose their hospitals, specialists, and treatment pathways. We present clear options without commercial coercion or artificial bias.</li>
                  <li><strong>Dignity for Attendants:</strong> Accompanying family members receive equal care regarding lodging, local transfers, and clear daily briefings.</li>
                  <li><strong>Ethical Non-Clinical Liaison:</strong> We maintain a strict boundary between logistical facilitation and medical judgment, ensuring clinical integrity is never compromised.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900 mb-3">
                  Strict Non-Clinical Commitment
                </h2>
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 text-slate-800 text-sm">
                  <div className="flex items-center gap-2 font-bold text-[#075985] mb-2">
                    <ShieldCheck className="w-5 h-5 text-[#0284C7]" />
                    <span>Clear Distinction Between Logistics and Clinical Practice</span>
                  </div>
                  <p>
                    Pranava Nexus Care does not engage in the practice of medicine. We do not provide clinical diagnoses, recommend medications, perform medical procedures, or provide emergency ambulance or trauma response services. All clinical assessments, consultations, surgical interventions, and medical documentation are provided independently by licensed medical practitioners and accredited healthcare institutions.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Information Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Official Credentials Box */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="text-sm font-bold font-serif text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  Corporate Registration Profile
                </h3>

                <div>
                  <span className="font-semibold text-slate-500 block">Full Registered Business Name:</span>
                  <strong className="text-slate-900 text-sm">M/s. PRANAVA NEXUS CARE</strong>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block">Constitution / Deed Date:</span>
                  <span className="text-slate-800 font-medium">15 July 2026</span>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block">Registered Office Address:</span>
                  <p className="text-slate-800">
                    5A, Kalipada Mukherjee Road, Purba Barisha, Kolkata – 700 008, West Bengal, India
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block">Operational Coordination Desk:</span>
                  <span className="text-slate-800 font-medium">+91 98765 43210</span>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block">Email Inquiries:</span>
                  <span className="text-slate-800 font-medium">care@pranavanexuscare.com</span>
                </div>
              </div>

              {/* Scope of Operations */}
              <div className="bg-linear-to-br from-[#075985] to-[#0369a1] text-white rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="text-base font-bold font-serif text-[#FFDF73]">
                  Destination Coverage
                </h3>
                <p className="text-xs text-sky-100 leading-relaxed">
                  Coordination capabilities across primary Indian healthcare hubs including Kolkata, New Delhi, Chennai, Bengaluru, and Mumbai, alongside cross-border liaison to Dubai and Southeast Asia.
                </p>
                <button
                  onClick={openEnquiryModal}
                  className="w-full mt-3 py-2.5 px-4 bg-white text-[#075985] hover:bg-sky-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Request Case Coordination</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
