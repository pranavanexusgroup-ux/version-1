import React from 'react';
import { FileUp, Stethoscope, Compass, PlaneTakeoff, HeartHandshake, RefreshCw, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  openEnquiryModal: () => void;
  navigate?: (path: string) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ openEnquiryModal, navigate }) => {
  const steps = [
    {
      number: '01',
      icon: FileUp,
      title: 'Initial Enquiry & Document Sharing',
      description: 'You share the patient’s medical background, diagnostic reports, and preferred destination. We organize the preliminary case files.'
    },
    {
      number: '02',
      icon: Stethoscope,
      title: 'Provider Liaison & Appointments',
      description: 'We present your case files to accredited medical facilities and doctors to facilitate formal appointment schedules and treatment estimates.'
    },
    {
      number: '03',
      icon: Compass,
      title: 'Transparent Journey Planning',
      description: 'You receive a complete itinerary roadmap outlining expected consultation dates, hospital admission timeline, recovery stay, and cost parameters.'
    },
    {
      number: '04',
      icon: PlaneTakeoff,
      title: 'Travel, Visa & Stay Coordination',
      description: 'We assist with medical visa invitation letters from hospitals, flight arrangements, and patient-friendly hotel lodging near the treatment center.'
    },
    {
      number: '05',
      icon: HeartHandshake,
      title: 'Airport Pickup & Attendant Support',
      description: 'Dedicated ground transfer from the airport or railway station to your hotel, with local language and SIM card assistance for accompanying family.'
    },
    {
      number: '06',
      icon: RefreshCw,
      title: 'Recovery & Post-Care Follow-up',
      description: 'Post-discharge follow-up coordination with your treating specialist and tele-consultation facilitation once you return home safely.'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Transparent Coordination Methodology
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 mt-3">
            The 6-Step Patient Healthcare-Travel Pathway
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-3 leading-relaxed">
            From your very first enquiry to returning home in comfort, we handle the non-clinical logistics so you and your family can focus entirely on health and recovery.
          </p>
        </div>

        {/* 6-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-sky-300 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#075985] text-white flex items-center justify-center shadow-xs group-hover:bg-[#0284C7] transition-colors">
                      <Icon className="w-6 h-6 text-[#FFDF73]" />
                    </div>
                    <span className="text-2xl font-mono font-extrabold text-slate-300 group-hover:text-sky-200 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 font-serif mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Step {step.number} of 06</span>
                  <span className="text-emerald-700 font-medium">Non-Clinical Support</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="mt-12 text-center bg-linear-to-r from-sky-50 to-indigo-50 border border-sky-100 rounded-2xl p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-lg font-bold text-slate-900 font-serif">
              Ready to begin your treatment journey planning?
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Speak directly with an experienced medical travel coordinator in Kolkata.
            </p>
          </div>
          <button
            onClick={openEnquiryModal}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#075985] hover:bg-[#0369a1] shadow-sm hover:shadow-md transition-all shrink-0"
          >
            Start Your Free Enquiry
            <ArrowRight className="w-4 h-4 ml-1.5 text-[#F4C430]" />
          </button>
        </div>
      </div>
    </section>
  );
};
