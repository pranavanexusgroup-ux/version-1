import React, { useEffect, useState } from 'react';
import { Facebook, ExternalLink, Share2, Youtube } from 'lucide-react';
import { api } from '../services/api';
import { SocialMediaItem } from '../types';
const ASSET_BASE = import.meta.env.BASE_URL;

function getYouTubeThumbnail(url: string) {
  try {
    const parsed = new URL(url);
    const videoId = parsed.hostname.includes('youtu.be')
      ? parsed.pathname.slice(1)
      : parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
  } catch {
    return '';
  }
}

function getYouTubeEmbed(url: string) {
  try {
    const parsed = new URL(url);
    const videoId = parsed.hostname.includes('youtu.be')
      ? parsed.pathname.slice(1)
      : parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  } catch {
    return '';
  }
}

export const SocialEngagementSection: React.FC = () => {
  const [items, setItems] = useState<SocialMediaItem[]>([]);

  useEffect(() => {
    Promise.all([api.getSocialMedia(), api.getSettings()])
      .then(([media, settings]) => {
        const managed = media.filter((item) => ['Facebook', 'YouTube'].includes(item.platform));
        const fallback = settings.social
          .filter((item) => ['Facebook', 'YouTube'].includes(item.platform))
          .map((item, index) => ({
            id: -(index + 1),
            platform: item.platform,
            title: item.platform === 'Facebook' ? 'Follow us on Facebook' : 'Watch us on YouTube',
            url: item.url,
            thumbnail_url: `${ASSET_BASE}assets/images/patient-coordination-hero.jpg`,
            sort_order: index + 1,
            is_active: 1
          }));
        setItems(managed.length ? managed : fallback);
      })
      .catch((error) => console.error('Failed to load social engagement links', error));
  }, []);

  if (!items.length) return null;

  return (
    <section className="border-t border-slate-200 bg-white py-12" aria-labelledby="social-engagement-heading">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#075985]"><Share2 className="h-4 w-4 text-[#0F766E]" /> Stay connected</span>
          <h2 id="social-engagement-heading" className="mt-2 font-serif text-2xl font-bold text-slate-900">Follow Our Healthcare Travel Updates</h2>
          <p className="mt-2 text-sm text-slate-600">See practical travel guidance, service updates, and new patient-support information.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const isYouTube = item.platform === 'YouTube';
            const image = item.thumbnail_url || (isYouTube ? getYouTubeThumbnail(item.url) : '') || '/assets/images/patient-coordination-hero.jpg';
            if (isYouTube && getYouTubeEmbed(item.url)) {
              return <article key={`${item.platform}-${item.id}`} className="overflow-hidden rounded-2xl border border-red-200 bg-red-50">
                <div className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-red-700"><Youtube className="h-4 w-4" />{item.title}</div>
                <iframe title={item.title} src={getYouTubeEmbed(item.url)} loading="lazy" className="aspect-video w-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 text-xs font-bold text-red-700 hover:underline"><span>Open on YouTube</span><ExternalLink className="h-3.5 w-3.5" /></a>
              </article>;
            }
            return <a key={`${item.platform}-${item.id}`} href={item.url} target="_blank" rel="noopener noreferrer" className={`group overflow-hidden rounded-2xl border transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 ${isYouTube ? 'border-red-200 bg-red-50 focus:ring-red-400' : 'border-blue-200 bg-blue-50 focus:ring-blue-400'}`}>
              <div className="relative h-28 overflow-hidden bg-slate-200"><img src={image} alt={`${item.title} preview`} loading="lazy" onError={(event) => { event.currentTarget.src = '/assets/images/patient-coordination-hero.jpg'; }} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-slate-950/25" /><span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">{isYouTube ? <Youtube className="h-4 w-4 text-red-600" /> : <Facebook className="h-4 w-4 text-blue-700" />}</span></div>
              <div className="flex items-center justify-between gap-3 px-4 py-3"><span className={`text-xs font-bold ${isYouTube ? 'text-red-700' : 'text-blue-800'}`}>{item.title}</span><ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500" /></div>
            </a>;
          })}
        </div>
      </div>
    </section>
  );
};
