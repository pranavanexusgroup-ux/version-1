import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Handshake } from 'lucide-react';
import { api } from '../services/api';
import { Partner } from '../types';

export const OurPartnersSection: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselCopies = 6;

  useEffect(() => {
    let mounted = true;
    api.getPartners()
      .then((items) => {
        if (mounted) setPartners(items.filter((partner) => partner.logo_url));
      })
      .catch((error) => console.error('Failed to load partners', error))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || paused || partners.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frameId = 0;
    let previousTime = performance.now();
    const speed = 28;
    const animate = (time: number) => {
      const elapsed = time - previousTime;
      previousTime = time;
      const cycleWidth = track.scrollWidth / carouselCopies;
      if (cycleWidth > 0) {
        track.scrollLeft += (speed * elapsed) / 1000;
        if (track.scrollLeft >= cycleWidth) track.scrollLeft -= cycleWidth;
      }
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [paused, partners.length]);

  const move = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.partner-card');
    const distance = card ? card.offsetWidth + 20 : 260;
    const cycleWidth = track.scrollWidth / carouselCopies;
    const nextPosition = track.scrollLeft + direction * distance;
    if (nextPosition >= cycleWidth) {
      track.scrollTo({ left: 0, behavior: 'auto' });
    } else if (nextPosition < 0) {
      track.scrollTo({ left: Math.max(0, cycleWidth - distance), behavior: 'smooth' });
    } else {
      track.scrollTo({ left: nextPosition, behavior: 'smooth' });
    }
  };

  if (loading || partners.length === 0) return null;

  return (
    <section
      aria-labelledby="our-partners-heading"
      className="border-y border-slate-200 bg-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#075985]">
              <Handshake className="h-4 w-4 text-[#0F766E]" />
              Trusted network
            </span>
            <h2 id="our-partners-heading" className="mt-2 font-serif text-3xl font-bold text-slate-900 md:text-4xl">
              Our Partners
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
              Trusted healthcare and service partners supporting our medical tourism network.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous partners"
              className="rounded-full border border-slate-200 bg-white p-2.5 text-[#075985] shadow-sm transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next partners"
              className="rounded-full border border-slate-200 bg-white p-2.5 text-[#075985] shadow-sm transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="partner-carousel-track flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          aria-label="Partner logos carousel"
        >
          {Array.from({ length: carouselCopies }).flatMap(() => partners).map((partner, index) => {
            const copyIndex = Math.floor(index / partners.length);
            const isClone = copyIndex > 0;
            const content = (
              <>
                <div className="flex h-28 w-full items-center justify-center rounded-xl border border-slate-100 bg-slate-50/70 p-5">
                  <img
                    src={partner.logo_url}
                    alt={`${partner.name} logo`}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain grayscale transition duration-300 group-hover:grayscale-0"
                    onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{partner.name}</h3>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[#0F766E]">{partner.category}</p>
                  </div>
                  {partner.website_url && <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />}
                </div>
                {partner.description && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{partner.description}</p>}
              </>
            );

            return partner.website_url ? (
              <a
                key={`${partner.id}-${copyIndex}`}
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-hidden={isClone}
                tabIndex={isClone ? -1 : 0}
                className="partner-card group block shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label={`Visit ${partner.name} website`}
              >
                {content}
              </a>
            ) : (
              <article key={`${partner.id}-${copyIndex}`} aria-hidden={isClone} className="partner-card group shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg">
                {content}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
