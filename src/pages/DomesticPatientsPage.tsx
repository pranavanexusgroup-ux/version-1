import React from 'react';
import { MapPin, Train, Car, Hotel, CalendarCheck, ShieldCheck, ArrowRight } from 'lucide-react';

interface DomesticPatientsPageProps {
  navigate: (path: string) => void;
  openEnquiryModal: () => void;
}

export const DomesticPatientsPage: React.FC<DomesticPatientsPageProps> = ({
  navigate,
  openEnquiryModal
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-[#075985]/15 to-transparent pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Inter-City & Inter-State Coordination
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 mt-3">
              Domestic Healthcare Travel Across India
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
              Assisting patients from Tier-2 and Tier-3 towns or other states travelling to medical hubs in Kolkata, New Delhi NCR, Chennai, Bengaluru, and Mumbai for super-specialty consultations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-10 text-slate-700 leading-relaxed text-sm md:text-base">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900 mb-4">
                  Overcoming Domestic Medical Travel Hurdles
                </h2>
                <p>
                  Often, the best medical specialist or surgical center for complex cardiology, oncology, organ transplants, or neurology is located in a metropolitan center outside a patient’s home district. Travelling by train or flight with an elderly patient, arranging reliable local cabs, and finding safe, clean, hygienic lodging near the hospital can be challenging for families.
                </p>
                <p className="mt-3">
                  Pranava Nexus Care simplifies domestic healthcare journeys through end-to-end logistical planning from our central coordination office in Kolkata.
                </p>
              </div>

              {/* Service Capabilities for Domestic Patients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#075985] flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5 text-[#0284C7]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base font-serif">
                    Pre-Confirmed Hospital Appointments
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Avoid long hospital outpatient queues. We schedule consultations in advance so your travel days are strictly aligned with physician availability.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#075985] flex items-center justify-center">
                    <Train className="w-5 h-5 text-[#0284C7]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base font-serif">
                    Station / Airport Ground Pickups
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Reliable pre-booked transportation from Howrah or Sealdah railway stations, or airport terminals directly to your hotel or hospital OPD.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#075985] flex items-center justify-center">
                    <Hotel className="w-5 h-5 text-[#0284C7]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base font-serif">
                    Patient-Friendly Accommodation
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Carefully chosen lodging with elevator access, hygienic food options, and proximity to hospital corridors for easy walking transit.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#075985] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#0284C7]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base font-serif">
                    Attendant Support Desk
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dedicated phone contact for patient attendants to coordinate local medicine delivery, diagnostic appointment timing, and return travel tickets.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold font-serif text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  Domestic Coordination Desk
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Travelling to Kolkata, Delhi, Chennai, or Bengaluru for medical care? Let us organize your appointments and stay.
                </p>

                <button
                  onClick={openEnquiryModal}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#075985] hover:bg-[#0369a1] transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Request Domestic Travel Assistance</span>
                  <ArrowRight className="w-4 h-4 text-[#FFDF73]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
