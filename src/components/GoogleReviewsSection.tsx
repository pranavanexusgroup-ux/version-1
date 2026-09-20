import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Testimonial } from '../types';
import { Star, ShieldAlert, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

export const GoogleReviewsSection: React.FC = () => {
  const [googleData, setGoogleData] = useState<any>({});
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const copies = 4;

  useEffect(() => {
    async function loadData() {
      try {
        const [reviews, testList] = await Promise.all([
          api.getGoogleReviews(),
          api.getTestimonials()
        ]);
        setGoogleData(reviews);
        setTestimonials(testList);
      } catch (err) {
        console.error('Failed to load reviews data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const isLiveConfigured = googleData?.isConfigured;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || paused || testimonials.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let previous = performance.now();
    const animate = (time: number) => {
      const elapsed = time - previous;
      previous = time;
      const cycleWidth = track.scrollWidth / copies;
      if (cycleWidth > 0) {
        track.scrollLeft += (24 * elapsed) / 1000;
        if (track.scrollLeft >= cycleWidth) track.scrollLeft -= cycleWidth;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [paused, testimonials.length]);

  const move = (direction: number) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('.review-card');
    if (!track) return;
    const distance = (card?.offsetWidth || 300) + 24;
    const cycleWidth = track.scrollWidth / copies;
    const next = track.scrollLeft + direction * distance;
    track.scrollTo({ left: next >= cycleWidth ? 0 : Math.max(0, next < 0 ? cycleWidth - distance : next), behavior: 'smooth' });
  };

  if (!loading && testimonials.length === 0 && !isLiveConfigured) return null;

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100">
                Patient Feedback & Verification
              </span>
              {isLiveConfigured && <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">LIVE GOOGLE DATA</span>}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-slate-900">
              Patient Coordination Experiences
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-xl">
              Authentic feedback and journey narratives from patients assisted with hospital travel coordination.
            </p>
          </div>

          {/* Rating Summary Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4 shrink-0">
            <div className="text-center border-r border-slate-200 pr-4">
              <span className="text-3xl font-extrabold text-slate-900 font-serif">
                {googleData?.rating || '—'}
              </span>
              <div className="flex items-center text-amber-400 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <div className="text-xs text-slate-600">
              <strong className="block text-slate-900 text-sm">
                {googleData?.reviewCount || 0} Google Reviews
              </strong>
              <span>
                {isLiveConfigured ? 'Verified Google Business Profile' : 'No Google review feed connected'}
              </span>
            </div>
          </div>
        </div>

        {/* Integration Status Notice if unconfigured */}
        {!isLiveConfigured && testimonials.length > 0 && (
          <div className="mb-8 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Google Reviews Notice:</strong> Google Business verification is not connected yet. The approved patient experiences below are separate consented records and are not presented as Google reviews.
            </div>
          </div>
        )}

        {/* Testimonial Cards */}
        {loading ? (
          <div className="text-center py-8 text-slate-400 text-xs">Loading experiences...</div>
        ) : (
          <div className="relative">
            <div className="mb-4 flex justify-end gap-2">
              <button type="button" onClick={() => move(-1)} aria-label="Previous patient experiences" className="rounded-full border border-slate-200 bg-white p-2 text-[#075985] shadow-sm hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"><ArrowLeft className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(1)} aria-label="Next patient experiences" className="rounded-full border border-slate-200 bg-white p-2 text-[#075985] shadow-sm hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"><ArrowRight className="h-4 w-4" /></button>
            </div>
            <div ref={trackRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} aria-label="Approved patient experiences carousel" className="flex gap-6 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
            {Array.from({ length: copies }).flatMap(() => testimonials).map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                aria-hidden={index >= testimonials.length}
                className="review-card group relative w-[calc(100%-1rem)] shrink-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-0.5 hover:border-sky-300 md:w-[calc((100%-3rem)/3)]"
              >
                {item.is_demo === 1 && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-bold text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    DEMO
                  </div>
                )}

                <div>
                  <div className="flex items-center text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs md:text-sm text-slate-700 italic leading-relaxed mb-4">
                    "{item.testimonial}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{item.display_name}</h4>
                    <span className="text-slate-500 text-[11px]">
                      From {item.country} to {item.destination}
                    </span>
                  </div>

                  {item.verified === 1 && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>
    </section>
  );
};
