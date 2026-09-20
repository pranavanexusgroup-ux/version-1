import React from 'react';
import { Logo } from './Logo';
import { MapPin, Phone, Mail, Clock, AlertTriangle, ExternalLink, Star } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
  openEnquiryModal: (serviceId?: number) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate, openEnquiryModal }) => {
  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-[#075985]">
      {/* High-level Regulatory & Medical Disclaimer Callout */}
      <div className="bg-slate-950/80 py-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs md:text-sm text-amber-200/90 leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#FFDF73] font-semibold block mb-1">
                Statutory Medical & Coordination Disclaimer
              </strong>
              M/s. PRANAVA NEXUS CARE is a medical tourism and healthcare-travel coordination service provider. We facilitate non-clinical administrative logistics, appointment coordination, medical report relay, journey planning, accommodation, and travel assistance. We do not practice medicine, provide clinical diagnoses, prescribe treatments, or offer emergency life-saving services. All clinical assessments, consultations, and treatments are carried out independently by licensed physicians and accredited healthcare institutions.
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Identity Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed pt-2">
              Facilitating seamless international and domestic healthcare-travel coordination. Connecting patients with verified medical centers across India and premier global health destinations.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Registered Head Office:</span>
                  <p className="text-slate-400">
                    5A, Kalipada Mukherjee Road, Purba Barisha, Kolkata – 700 008, West Bengal, India
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#84CC16] shrink-0" />
                <span className="text-slate-300">+91 98765 43210 (Coordination Desk)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F4C430] shrink-0" />
                <span className="text-slate-300">care@pranavanexuscare.com</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-slate-400">Mon - Sat: 9:00 AM - 8:00 PM IST (Enquiries 24/7)</span>
              </div>

              <a
                href="https://www.trustpilot.com/evaluate/pranavanexuscare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 transition hover:border-emerald-400/60 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                <span>Review us on Trustpilot</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Column 2: Approved Services */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 border-b border-slate-800 pb-2">
              Coordination Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('/services/treatment-enquiry-coordination')} className="hover:text-white transition-colors text-left">
                  Treatment Enquiry Coordination
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services/hospital-doctor-appointment-coordination')} className="hover:text-white transition-colors text-left">
                  Hospital & Doctor Appointments
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services/medical-document-coordination')} className="hover:text-white transition-colors text-left">
                  Medical Document Coordination
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services/treatment-journey-planning')} className="hover:text-white transition-colors text-left">
                  Treatment Journey Planning
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services/travel-assistance')} className="hover:text-white transition-colors text-left">
                  Travel & Visa Assistance
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services/accommodation-assistance')} className="hover:text-white transition-colors text-left">
                  Patient Accommodation
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services/local-transfer-coordination')} className="hover:text-white transition-colors text-left">
                  Local Transfer & Pickups
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services/patient-attendant-support')} className="hover:text-white transition-colors text-left">
                  Patient & Attendant Support
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services/follow-up-coordination')} className="hover:text-white transition-colors text-left">
                  Follow-up Tele-Coordination
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Destinations & Patient Guides */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 border-b border-slate-800 pb-2">
              Destinations & Travel
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('/destinations')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Kolkata, India (Primary Hub)</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/destinations')} className="hover:text-white transition-colors text-left">
                  New Delhi / NCR, India
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/destinations')} className="hover:text-white transition-colors text-left">
                  Chennai, Tamil Nadu, India
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/destinations')} className="hover:text-white transition-colors text-left">
                  Bangalore & Mumbai, India
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/destinations')} className="hover:text-white transition-colors text-left">
                  Dubai, UAE (Global Nexus)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/destinations')} className="hover:text-white transition-colors text-left">
                  Bangkok, Thailand (On Request)
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <button onClick={() => handleNav('/international-patients')} className="hover:text-[#38BDF8] text-sky-400 font-medium transition-colors text-left">
                  International Patient Guide
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/domestic-patients')} className="hover:text-[#84CC16] text-lime-400 font-medium transition-colors text-left">
                  Domestic Inter-City Travel Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust, Policy & Compliance */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 border-b border-slate-800 pb-2">
              Governance & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('/about')} className="hover:text-white transition-colors text-left">
                  About Our Organization
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/how-it-works')} className="hover:text-white transition-colors text-left">
                  6-Step Coordination Pathway
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/patient-stories')} className="hover:text-white transition-colors text-left">
                  Patient Journey Experiences
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/faqs')} className="hover:text-white transition-colors text-left">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/blog')} className="hover:text-white transition-colors text-left">
                  Healthcare Travel Guides & Insights
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <button onClick={() => handleNav('/legal?tab=privacy')} className="hover:text-white transition-colors text-left">
                  Privacy & Data Protection Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/legal?tab=terms')} className="hover:text-white transition-colors text-left">
                  Terms & Conditions of Service
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/legal?tab=disclaimer')} className="hover:text-white transition-colors text-left">
                  Medical Disclaimer Notice
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Copyright and Registration details */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; 2026 <strong>M/s. PRANAVA NEXUS CARE</strong>. All rights reserved. Registered under deed dated 15 July 2026.
          </div>
          <div className="flex items-center gap-6">
            <span className="italic text-slate-400 font-serif">"One Nexus. Endless Opportunities."</span>
            <button
              onClick={() => handleNav('/admin')}
              className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              CMS Login <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
