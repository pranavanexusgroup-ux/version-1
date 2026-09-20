import React, { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Globe2, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { Location } from '../types';

const markerPositions: Record<string, { x: number; y: number }> = {
  kolkata: { x: 74.6, y: 37.4 },
  'new delhi': { x: 71.4, y: 34.1 },
  delhi: { x: 71.4, y: 34.1 },
  chennai: { x: 72.3, y: 42.7 },
  bengaluru: { x: 71.6, y: 42.8 },
  bangalore: { x: 71.6, y: 42.8 },
  mumbai: { x: 70.3, y: 39.4 },
  hyderabad: { x: 71.9, y: 39.1 },
  dubai: { x: 65.3, y: 36.1 },
  bangkok: { x: 78, y: 42.4 },
  singapore: { x: 78.8, y: 49.2 },
  istanbul: { x: 58, y: 27.2 }
};

const fallbackPosition = (index: number) => ({
  x: 28 + ((index * 19) % 48),
  y: 30 + ((index * 13) % 40)
});

interface GlobalConnectionMapProps {
  navigate: (path: string) => void;
}

export const GlobalConnectionMap: React.FC<GlobalConnectionMapProps> = ({ navigate }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    api.getLocations()
      .then(setLocations)
      .catch((error) => console.error('Failed to load global connection map', error));
  }, []);

  const markers = useMemo(() => locations.map((location, index) => {
    const city = (location.city_name || location.title || '').toLowerCase();
    return { location, position: markerPositions[city] || fallbackPosition(index) };
  }), [locations]);

  const hub = markerPositions.kolkata;
  const connectedMarkers = markers.filter(({ location }) => (location.city_name || '').toLowerCase() !== 'kolkata');

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-16 lg:py-20" aria-labelledby="global-connection-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#075985]">
              <Globe2 className="h-4 w-4 text-[#0F766E]" />
              One connected network
            </span>
            <h2 id="global-connection-heading" className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              Global Connections, Coordinated from Kolkata
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">
              Our Kolkata coordination desk connects patients and families with active healthcare-travel hubs across India and selected international gateways.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-sm">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="block text-2xl font-bold text-[#075985]">{locations.length || '—'}</span>
                <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">Active hubs</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="block text-2xl font-bold text-[#0F766E]">24/7</span>
                <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">Enquiry intake</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/destinations')}
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#075985] hover:text-[#0284C7] focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              Explore healthcare hubs <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-sky-200 bg-[#082f49] p-4 shadow-xl sm:p-6">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(125,211,252,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.18) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
            <div className="relative aspect-[1.55] min-h-[280px] overflow-hidden rounded-2xl border border-sky-300/20 bg-[#0b4668]">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
                alt="World map showing Pranava Nexus Care healthcare connection hubs"
                className="absolute inset-0 h-full w-full object-contain p-3 opacity-25 brightness-0 invert"
                loading="lazy"
                draggable="false"
              />

              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {connectedMarkers.map(({ location, position }) => (
                  <line key={location.id} x1={hub.x} y1={hub.y} x2={position.x} y2={position.y} stroke="rgba(125,211,252,0.55)" strokeWidth="0.35" strokeDasharray="1.4 1.2" />
                ))}
              </svg>

              <div className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-[#F4C430] text-slate-950 shadow-[0_0_0_7px_rgba(244,196,48,0.16),0_0_24px_rgba(244,196,48,0.8)]" style={{ left: `calc(${hub.x}% - 12px)`, top: `calc(${hub.y}% - 12px)` }}>
                <Activity className="h-3.5 w-3.5" />
              </div>
              <span className="absolute whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-[#FFDF73]" style={{ left: `calc(${hub.x}% + 14px)`, top: `calc(${hub.y}% - 8px)` }}>Kolkata hub</span>

              {markers.map(({ location, position }) => {
                const isHub = (location.city_name || '').toLowerCase() === 'kolkata';
                if (isHub) return null;
                return (
                  <div key={location.id} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${position.x}%`, top: `${position.y}%` }} title={`${location.city_name || location.title} healthcare hub`}>
                    <span className="block h-3 w-3 rounded-full border-2 border-white bg-[#38BDF8] shadow-[0_0_0_5px_rgba(56,189,248,0.16)] transition group-hover:scale-150" />
                    <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold text-sky-100">{location.city_name || location.title}</span>
                  </div>
                );
              })}

              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/30 px-2.5 py-2 text-[10px] text-sky-100 backdrop-blur-sm">
                <MapPin className="h-3.5 w-3.5 text-[#FFDF73]" /> Live coordination hub map
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
