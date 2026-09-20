import React, { useEffect, useState } from 'react';
import { ArrowRight, Facebook, Image as ImageIcon, Play, Quote, Youtube } from 'lucide-react';
import { api } from '../services/api';
import { GalleryItem, SocialMediaItem, Testimonial } from '../types';

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

export const CareMediaSection: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [stories, setStories] = useState<Testimonial[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMediaItem[]>([]);

  useEffect(() => {
    Promise.all([api.getGallery(), api.getTestimonials(), api.getSocialMedia()])
      .then(([galleryData, testimonials, media]) => {
        setGallery(galleryData.items.filter((item) => item.image));
        setStories(testimonials);
        setSocialMedia(media);
      })
      .catch((error) => console.error('Failed to load care media', error));
  }, []);

  const youtube = socialMedia.filter((item) => item.platform === 'YouTube');
  const facebook = socialMedia.filter((item) => item.platform === 'Facebook');
  if (!gallery.length && !stories.length && !socialMedia.length) return null;

  return (
    <section className="border-t border-slate-200 bg-white py-16 lg:py-20" aria-labelledby="care-media-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#075985]"><ImageIcon className="h-4 w-4 text-[#0F766E]" /> Care in action</span>
          <h2 id="care-media-heading" className="mt-3 font-serif text-3xl font-bold text-slate-900 md:text-4xl">Stories, Services & Patient Support</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">See the practical side of our healthcare-travel coordination, service network, and patient experiences.</p>
        </div>

        {gallery.length > 0 && (
          <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {gallery.slice(0, 4).map((item) => <figure key={item.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"><img src={item.image} alt={item.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" /><figcaption className="p-3 text-xs font-semibold text-slate-800">{item.title}</figcaption></figure>)}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {stories.slice(0, 3).map((story) => <article key={story.id} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6"><Quote className="h-7 w-7 text-sky-300" /><p className="mt-3 text-sm italic leading-relaxed text-slate-700">“{story.testimonial}”</p><div className="mt-5 border-t border-slate-200 pt-4"><strong className="block text-sm text-slate-900">{story.display_name}</strong><span className="text-xs text-slate-500">{story.country} to {story.destination}</span></div>{story.is_demo === 1 && <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2 py-1 text-[9px] font-bold uppercase text-amber-800">Demo story</span>}</article>)}

          {youtube.slice(0, 1).map((item) => { const embed = getYouTubeEmbed(item.url); return <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 lg:col-span-2"><div className="flex items-center gap-2 px-5 py-4 text-sm font-bold text-white"><Youtube className="h-5 w-5 text-red-400" />{item.title}</div>{embed ? <iframe title={item.title} src={embed} loading="lazy" className="aspect-video w-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex aspect-video items-center justify-center bg-slate-800 text-sm font-semibold text-white">Watch video <Play className="ml-2 h-4 w-4" /></a>}<p className="p-4 text-xs text-slate-300">{item.description || 'Watch our latest healthcare-travel coordination update.'}</p></article>; })}
        </div>

        {(facebook.length > 0 || youtube.length > 0) && <div className="mt-8 flex flex-wrap gap-3"><a href={facebook[0]?.url || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-800"><Facebook className="h-4 w-4" /> Follow updates on Facebook <ArrowRight className="h-3.5 w-3.5" /></a><a href={youtube[0]?.url || 'https://youtube.com'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700"><Youtube className="h-4 w-4" /> Visit our YouTube channel <ArrowRight className="h-3.5 w-3.5" /></a></div>}
      </div>
    </section>
  );
};
