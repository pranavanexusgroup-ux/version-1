import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Service } from '../types';
import { X, CheckCircle2, ShieldCheck, AlertCircle, Phone, ArrowRight, FileText } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: number;
  prefilledDestination?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  preselectedServiceId,
  prefilledDestination
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [fullName, setFullName] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');
  const [email, setEmail] = useState('');
  const [countryCity, setCountryCity] = useState('');
  const [preferredDestination, setPreferredDestination] = useState(prefilledDestination || '');
  const [treatmentSpecialty, setTreatmentSpecialty] = useState('');
  const [expectedTravelDate, setExpectedTravelDate] = useState('');
  const [briefRequirement, setBriefRequirement] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(preselectedServiceId);
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ referenceNo: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadServices() {
      try {
        const s = await api.getServices();
        setServices(s);
      } catch (err) {
        console.error('Failed to load services for form', err);
      }
    }
    loadServices();
  }, []);

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    }
    if (prefilledDestination) {
      setPreferredDestination(prefilledDestination);
    }
  }, [preselectedServiceId, prefilledDestination]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Please enter patient or representative name';
    if (!phoneWhatsApp.trim()) errs.phoneWhatsApp = 'Phone or WhatsApp number is required';
    if (!treatmentSpecialty.trim()) errs.treatmentSpecialty = 'Please indicate treatment area or specialty';
    if (!consent) errs.consent = 'You must confirm patient consent for non-clinical coordination';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      const res = await api.submitEnquiry({
        fullName: fullName.trim(),
        phoneWhatsApp: phoneWhatsApp.trim(),
        email: email.trim() || undefined,
        countryCity: countryCity.trim() || undefined,
        preferredDestination: preferredDestination.trim() || undefined,
        treatmentSpecialty: treatmentSpecialty.trim(),
        expectedTravelDate: expectedTravelDate.trim() || undefined,
        briefRequirement: briefRequirement.trim() || undefined,
        selectedServiceId: selectedServiceId ? Number(selectedServiceId) : undefined,
        consent: true
      });

      if (res.success && res.data) {
        setSubmittedData(res.data);
      } else if (res.errors) {
        setErrors(res.errors);
      } else {
        setErrors({ server: res.message || 'Submission failed. Please try again.' });
      }
    } catch (err: any) {
      setErrors({ server: err.message || 'Network error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedData(null);
    setFullName('');
    setPhoneWhatsApp('');
    setEmail('');
    setCountryCity('');
    setPreferredDestination('');
    setTreatmentSpecialty('');
    setExpectedTravelDate('');
    setBriefRequirement('');
    setSelectedServiceId(undefined);
    setConsent(false);
    setErrors({});
    onClose();
  };

  const specialties = [
    'Cardiac Sciences & Heart Surgery',
    'Oncology & Cancer Care',
    'Orthopedics & Joint Replacement',
    'Neurosciences & Spine Surgery',
    'Organ Transplant Coordination (Liver / Renal)',
    'Gastroenterology & Hepatology',
    'IVF & Fertility Treatment',
    'Nephrology & Urology',
    'Cosmetic & Reconstructive Surgery',
    'Ophthalmology & Eye Care',
    'Dental Specialty Care',
    'Ayurveda & Rejuvenation / Wellness',
    'General Health Checkup & Second Opinion'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="enquiry-modal-title">
      <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl my-4 sm:my-8">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-[#075985] to-[#0284c7] text-white p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close form"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 mb-1 text-[#FFDF73] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Patient coordination desk</span>
          </div>
          <h3 id="enquiry-modal-title" className="text-xl md:text-2xl font-bold font-serif">
            Start Your Healthcare Travel Enquiry
          </h3>
          <p className="text-xs md:text-sm text-sky-100 mt-1">
            Tell us what support you need and our coordinator will help you plan the next practical step.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 text-[10px] font-semibold text-sky-100">
            <div className="rounded-lg border border-white/20 bg-white/10 px-2 py-2 text-center">1. Share your need</div>
            <div className="rounded-lg border border-white/20 bg-white/10 px-2 py-2 text-center">2. We review it</div>
            <div className="rounded-lg border border-white/20 bg-white/10 px-2 py-2 text-center">3. We contact you</div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="min-h-0 overflow-y-auto p-5 sm:p-6 md:p-8">
          {submittedData ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 font-serif">
                Enquiry Successfully Registered
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your medical travel enquiry has been assigned a reference identifier and logged with our Kolkata coordination center.
              </p>

              <div className="inline-block bg-sky-50 border border-sky-200 rounded-xl px-6 py-3 my-2">
                <span className="text-xs uppercase tracking-wider text-[#075985] font-semibold block">
                  Enquiry Reference Number
                </span>
                <span className="text-xl font-mono font-bold text-[#075985]">
                  {submittedData.referenceNo}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-md mx-auto text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#075985]" />
                  Immediate Next Steps:
                </div>
                <p>1. Our patient care coordinator will review your indicated specialty and destination preferences.</p>
                <p>2. We will contact you via WhatsApp / Phone to confirm any diagnostic documents you wish to share.</p>
                <p>3. Quote our reference number <strong className="text-slate-900">{submittedData.referenceNo}</strong> during any communication.</p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/919876543210?text=Hello%20Pranava%20Nexus%20Care,%20I%20have%20submitted%20enquiry%20reference%20${submittedData.referenceNo}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba5a] flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Connect Instantly on WhatsApp
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            /* Active Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.server && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.server}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient / Representative Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma or Johnathan Doe"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent"
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-600 mt-0.5">{errors.fullName}</p>}
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number (with country code) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneWhatsApp}
                    onChange={(e) => setPhoneWhatsApp(e.target.value)}
                    placeholder="e.g. +91 98765 43210 or +880 1712..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent"
                  />
                  {errors.phoneWhatsApp && <p className="text-[11px] text-rose-600 mt-0.5">{errors.phoneWhatsApp}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient.care@example.com"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent"
                  />
                </div>

                {/* Patient Country / City */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Location / Residence
                  </label>
                  <input
                    type="text"
                    value={countryCity}
                    onChange={(e) => setCountryCity(e.target.value)}
                    placeholder="e.g. Dhaka, Bangladesh or Siliguri, India"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Treatment Specialty */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Medical Specialty / Treatment Area <span className="text-rose-600">*</span>
                  </label>
                  <input
                    list="specialties-list"
                    type="text"
                    required
                    value={treatmentSpecialty}
                    onChange={(e) => setTreatmentSpecialty(e.target.value)}
                    placeholder="Select or type specialty..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent"
                  />
                  <datalist id="specialties-list">
                    {specialties.map((spec, i) => (
                      <option key={i} value={spec} />
                    ))}
                  </datalist>
                  {errors.treatmentSpecialty && <p className="text-[11px] text-rose-600 mt-0.5">{errors.treatmentSpecialty}</p>}
                </div>

                {/* Preferred Destination */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Destination Hub
                  </label>
                  <input
                    type="text"
                    value={preferredDestination}
                    onChange={(e) => setPreferredDestination(e.target.value)}
                    placeholder="e.g. Kolkata, India or New Delhi, India"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Specific Coordination Service */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Service Needed
                  </label>
                  <select
                    value={selectedServiceId || ''}
                    onChange={(e) => setSelectedServiceId(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent bg-white"
                  >
                    <option value="">-- General Healthcare-Travel Assistance --</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expected Travel Timeline */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Travel Timeframe
                  </label>
                  <input
                    type="text"
                    value={expectedTravelDate}
                    onChange={(e) => setExpectedTravelDate(e.target.value)}
                    placeholder="e.g. Immediate, Next 2 weeks, or Next month"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Brief Requirement */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brief Medical Situation / Specific Needs
                </label>
                <textarea
                  rows={2}
                  value={briefRequirement}
                  onChange={(e) => setBriefRequirement(e.target.value)}
                  placeholder="Share details such as current doctor diagnosis, reports available, language needs, or wheelchair requirements..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent resize-none"
                />
              </div>

              {/* Patient Consent & Disclaimer Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-sm border-slate-300 text-[#075985] focus:ring-[#075985]"
                  />
                  <span className="text-[11px] text-slate-600 leading-snug">
                    I confirm that I am requesting non-clinical healthcare-travel coordination services from M/s. Pranava Nexus Care. I understand Pranava Nexus Care does not provide clinical medical advice, treatment, or emergency services, and I authorize the team to contact me regarding this enquiry.
                  </span>
                </label>
                {errors.consent && <p className="text-[11px] text-rose-600 mt-1">{errors.consent}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-sm text-white bg-linear-to-r from-[#075985] to-[#0284c7] hover:from-[#0369a1] hover:to-[#0284c7] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Registering Coordination Request...</span>
                  ) : (
                    <>
                      <span>Submit Healthcare Travel Enquiry</span>
                      <ArrowRight className="w-4 h-4 text-[#FFDF73]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
