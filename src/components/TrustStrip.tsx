import React from 'react';
import { ShieldCheck, MapPin, Users2, FileText } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Non-Clinical Transparency',
      desc: 'Clear logistical coordination. We never provide medical advice or interfere with doctor prescriptions.'
    },
    {
      icon: MapPin,
      title: 'Kolkata Headquartered Hub',
      desc: 'Dedicated coordination desk operating from Purba Barisha, Kolkata with nationwide & international reach.'
    },
    {
      icon: FileText,
      title: 'Structured Medical Dossiers',
      desc: 'Pre-organized diagnostic reports submitted methodically for expedited hospital and specialist review.'
    },
    {
      icon: Users2,
      title: 'Patient & Family Centric',
      desc: 'Careful planning for both patient and accompanying attendants, from transfers to recovery lodging.'
    }
  ];

  return (
    <section className="bg-slate-50 border-y border-slate-200/80 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/70 shadow-xs"
              >
                <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#075985] flex items-center justify-center shrink-0 border border-sky-100">
                  <Icon className="w-5 h-5 text-[#0284C7]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 leading-snug">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
