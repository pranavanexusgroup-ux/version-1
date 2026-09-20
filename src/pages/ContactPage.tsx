import React, { useState } from 'react';
import { api } from '../services/api';
import { MapPin, Phone, Mail, Clock, ShieldAlert, CheckCircle2, ArrowRight, MessageCircle, Navigation } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

interface ContactPageProps {
  navigate: (path: string) => void;
  openEnquiryModal: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ openEnquiryModal }) => {
  useSEO({
    title: 'Contact Us & Kolkata Headquarters | Pranava Nexus Care',
    description: 'Get in touch with M/s. PRANAVA NEXUS CARE at 5A, Kalipada Mukherjee Road, Purba Barisha, Kolkata – 700 008, West Bengal, India. Direct assistance for healthcare travel and hospital coordination.',
    keywords: ['contact pranava nexus care', 'medical tourism kolkata office', 'healthcare travel coordinator contact', 'purba barisha medical assistance'],
    canonicalUrl: 'https://pranavanexuscare.com/contact'
  });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.submitEnquiry({
        fullName: name.trim(),
        phoneWhatsApp: phone.trim(),
        email: email.trim() || undefined,
        treatmentSpecialty: subject.trim() || 'General Information & Coordination Inquiry',
        briefRequirement: message.trim(),
        consent: true
      });

      if (res.success) {
        setSuccessMsg(
          `Thank you. Your message has been received with reference: ${res.data?.referenceNo || 'PNC-2026-ENQ'}. A coordinator will contact you shortly.`
        );
        setName('');
        setPhone('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setErrorMsg(res.message || 'Failed to submit inquiry. Please try again or message on WhatsApp.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred. Please try WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-[#075985]/15 to-transparent pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Operational Liaison Desk
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 mt-3">
              Contact Pranava Nexus Care
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
              Tell us what kind of healthcare-travel support you need. Choose the quickest way to reach our coordination desk or send a short enquiry online.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <a
                  href="https://wa.me/919876543210?text=Hello%20Pranava%20Nexus%20Care,%20I%20need%20help%20with%20medical%20travel%20coordination."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 transition hover:-translate-y-0.5 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white"><MessageCircle className="h-5 w-5" /></span>
                  <span><strong className="block text-sm text-slate-900">Message on WhatsApp</strong><small className="text-xs text-slate-600">Fastest for travel questions</small></span>
                </a>
                <a
                  href="tel:+919876543210"
                  className="group flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 transition hover:-translate-y-0.5 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#075985] text-white"><Phone className="h-5 w-5" /></span>
                  <span><strong className="block text-sm text-slate-900">Call the coordination desk</strong><small className="text-xs text-slate-600">+91 98765 43210</small></span>
                </a>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#075985] block mb-1">
                    Headquartered In Kolkata
                  </span>
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    M/s. PRANAVA NEXUS CARE
                  </h3>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#075985] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-medium">Registered Head Office:</strong>
                      <p className="text-slate-600 mt-0.5">
                        5A, Kalipada Mukherjee Road, Purba Barisha,
                        <br />
                        Kolkata – 700 008, West Bengal, India
                      </p>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=5A%20Kalipada%20Mukherjee%20Road%20Purba%20Barisha%20Kolkata%20700008"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#075985] hover:underline"
                      >
                        <Navigation className="h-3.5 w-3.5" /> Get directions
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#65A30D] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-medium">Phone & WhatsApp Coordination:</strong>
                      <a href="tel:+919876543210" className="text-[#075985] hover:underline">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-medium">Direct Inquiries:</strong>
                      <a href="mailto:care@pranavanexuscare.com" className="text-[#075985] hover:underline">
                        care@pranavanexuscare.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-medium">Desk Working Hours:</strong>
                      <p className="text-slate-600 mt-0.5">
                        Monday – Saturday: 9:00 AM – 8:00 PM IST
                        <br />
                        <span className="text-emerald-700 font-medium">Online Enquiries Monitored 24/7</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Emergency Notice */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p>
                    <strong>Non-Emergency Notice:</strong> Pranava Nexus Care is not an emergency medical service. In an emergency, contact your local emergency services immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">
                  Send a short enquiry
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  Share only what you are comfortable sharing. A coordinator will reply with the next practical step.
                </p>

                {successMsg && (
                  <div role="status" aria-live="polite" className="p-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-4 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone / WhatsApp <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@domain.com"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Inquiry Subject / Area
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Appointment in Kolkata"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      How can we help?
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us your preferred destination, treatment area, or travel timeline..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:border-transparent bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-linear-to-r from-[#075985] to-[#0284C7] hover:from-[#0369a1] hover:to-[#0284c7] shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending Inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <ArrowRight className="w-4 h-4 text-[#FFDF73]" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-500">
                    For a guided treatment-travel enquiry with destination and specialty options, use the <button type="button" onClick={openEnquiryModal} className="font-semibold text-[#075985] hover:underline">assistance form</button>.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
