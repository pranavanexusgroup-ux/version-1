import React, { useState } from 'react';
import { ShieldCheck, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface LegalPageProps {
  navigate: (path: string) => void;
  defaultTab?: 'privacy' | 'terms' | 'disclaimer';
}

export const LegalPage: React.FC<LegalPageProps> = ({ defaultTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer'>(defaultTab);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-[#075985]/15 to-transparent pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Governance, Compliance & Transparency
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 mt-3">
              Legal, Compliance & Policy Framework
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
              M/s. PRANAVA NEXUS CARE operates with complete adherence to ethical coordination boundaries, patient data privacy, and transparent terms of service.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs & Content */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Selection */}
          <div className="flex border-b border-slate-200 space-x-6 mb-10">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'privacy'
                  ? 'border-[#075985] text-[#075985]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Privacy & Data Protection Policy
            </button>

            <button
              onClick={() => setActiveTab('terms')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'terms'
                  ? 'border-[#075985] text-[#075985]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              Terms & Conditions of Service
            </button>

            <button
              onClick={() => setActiveTab('disclaimer')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'disclaimer'
                  ? 'border-[#075985] text-[#075985]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Medical Disclaimer
            </button>
          </div>

          {/* Privacy Policy */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <h2 className="text-2xl font-bold font-serif text-slate-900">
                Privacy & Medical Data Protection Policy
              </h2>
              <p className="text-xs text-slate-500">Last updated: 15 July 2026</p>

              <div className="space-y-4">
                <p>
                  At <strong>M/s. PRANAVA NEXUS CARE</strong> (operating from 5A, Kalipada Mukherjee Road, Purba Barisha, Kolkata – 700 008, West Bengal, India), we hold patient confidentiality and medical record privacy in the highest regard. This policy outlines how medical reports, identity credentials, and travel logistics information are collected, utilized, and safeguarded.
                </p>

                <h3 className="text-base font-bold font-serif text-slate-900 pt-2">
                  1. Information We Collect
                </h3>
                <p>
                  To provide healthcare-travel coordination, we may collect: patient name, age, contact telephone/WhatsApp numbers, email address, residential country and city, medical summaries, diagnostic test reports (blood tests, radiological scans, prescriptions), and attendant travel preferences.
                </p>

                <h3 className="text-base font-bold font-serif text-slate-900 pt-2">
                  2. Purpose of Information Use
                </h3>
                <p>
                  Data is processed strictly for:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Formulating structured preliminary case dossiers for submission to accredited hospitals and specialists requested by the patient.</li>
                  <li>Securing formal Medical Visa Invitation Letters from respective healthcare facilities.</li>
                  <li>Arranging ground transport, airport pick-ups, and patient-friendly accommodation.</li>
                  <li>Contacting patients or their authorized representatives regarding appointment timelines and coordination updates.</li>
                </ul>

                <h3 className="text-base font-bold font-serif text-slate-900 pt-2">
                  3. Non-Disclosure & Third Parties
                </h3>
                <p>
                  We never sell, rent, commercialize, or publicly disclose patient health data or personal records. Documents are transferred solely to authorized hospital international coordination desks or licensed medical practitioners with patient consent.
                </p>
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          {activeTab === 'terms' && (
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <h2 className="text-2xl font-bold font-serif text-slate-900">
                Terms and Conditions of Service
              </h2>
              <p className="text-xs text-slate-500">Effective Date: 15 July 2026</p>

              <div className="space-y-4">
                <p>
                  By accessing the website or engaging the coordination services of <strong>M/s. PRANAVA NEXUS CARE</strong>, the user, patient, or attendant agrees to the terms and stipulations set forth herein.
                </p>

                <h3 className="text-base font-bold font-serif text-slate-900 pt-2">
                  1. Non-Clinical Scope of Operations
                </h3>
                <p>
                  Pranava Nexus Care provides administrative and logistical facilitation only. We do not evaluate, prescribe, operate, or provide clinical care. All medical treatment contracts and patient relationships exist solely between the patient and the chosen healthcare provider.
                </p>

                <h3 className="text-base font-bold font-serif text-slate-900 pt-2">
                  2. Independent Medical Decision-Making
                </h3>
                <p>
                  Patients retain complete autonomy over hospital and physician selection. Treatment estimates, surgical risks, diagnostic interpretations, and medical outcomes are under the exclusive jurisdiction of the treating hospital and its medical staff.
                </p>

                <h3 className="text-base font-bold font-serif text-slate-900 pt-2">
                  3. Travel & Visa Documentation
                </h3>
                <p>
                  While we coordinate visa recommendation letters issued by accredited hospitals, visa approvals, consular clearances, and border entries remain at the sole discretion of sovereign immigration authorities (such as the Government of India).
                </p>
              </div>
            </div>
          )}

          {/* Medical Disclaimer */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                <div className="flex items-center gap-3 text-amber-900 font-bold font-serif text-lg mb-2">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                  <span>Statutory Medical & Emergency Disclaimer</span>
                </div>
                <p className="text-amber-900/90 leading-relaxed">
                  M/s. PRANAVA NEXUS CARE is a specialized healthcare-travel and medical tourism coordination agency. We are not a medical clinic, diagnostic laboratory, hospital, or emergency healthcare provider.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold font-serif text-slate-900">
                  Key Principles of Our Disclaimer:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#075985] shrink-0 mt-1" />
                    <span><strong>No Medical Advice:</strong> Information provided via our website, brochures, emails, or phone coordination does not constitute medical advice or substitute for professional clinical diagnosis.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#075985] shrink-0 mt-1" />
                    <span><strong>No Emergency Services:</strong> In any medical emergency or life-threatening situation, please do not contact our coordination desk. Seek immediate local hospital emergency department assistance.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#075985] shrink-0 mt-1" />
                    <span><strong>Hospital Autonomy:</strong> Doctors and hospitals operate independently. We do not influence doctor clinical recommendations or clinical treatment protocols.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
