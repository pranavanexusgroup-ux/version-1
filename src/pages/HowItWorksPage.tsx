import React from 'react';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { ShieldCheck, Clock, FileCheck, ArrowRight, PhoneCall } from 'lucide-react';

interface HowItWorksPageProps {
  navigate: (path: string) => void;
  openEnquiryModal: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ navigate, openEnquiryModal }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <section className="bg-linear-to-b from-[#075985]/15 to-transparent pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Operational Pathway
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 mt-3">
              How Medical Travel Coordination Works
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
              We structure your medical travel journey step-by-step to eliminate uncertainty, prevent redundant travel, and ensure your appointments and lodging are in place before you depart.
            </p>
          </div>
        </div>
      </section>

      {/* 6 Step Interactive Section */}
      <HowItWorksSection openEnquiryModal={openEnquiryModal} navigate={navigate} />

      {/* Realistic Timelines & Documentation Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-2xl font-bold font-serif text-slate-900">
              Realistic Coordination Timelines & Expectations
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-2">
              Every patient case is unique. Below are standard procedural benchmarks for transparent expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#075985] flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-[#0284C7]" />
              </div>
              <h3 className="font-bold font-serif text-slate-900 text-base mb-1">
                24 - 48 Hours
              </h3>
              <span className="text-xs font-semibold text-[#075985] block mb-2">
                Preliminary Case Review
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Initial assessment of reports and initial outreach to respective hospital specialty departments in your chosen destination.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#075985] flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5 text-[#0284C7]" />
              </div>
              <h3 className="font-bold font-serif text-slate-900 text-base mb-1">
                3 - 5 Working Days
              </h3>
              <span className="text-xs font-semibold text-[#075985] block mb-2">
                Medical Visa Invitation
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                For international patients travelling to India, formal Medical Visa assistance letters issued by the treating accredited hospital.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#075985] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-[#0284C7]" />
              </div>
              <h3 className="font-bold font-serif text-slate-900 text-base mb-1">
                Departure To Return
              </h3>
              <span className="text-xs font-semibold text-[#075985] block mb-2">
                Continuous Support
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                On-ground transfers, accommodation liaison, hospital admission support, and post-discharge journey coordination.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
