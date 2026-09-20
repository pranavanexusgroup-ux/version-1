import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Building2, FileQuestion, Globe2, HeartPulse, Search as SearchIcon } from 'lucide-react';
import { api } from '../services/api';

interface SearchResult {
  type: string;
  slug: string;
  name: string;
  description?: string;
}

interface SearchPageProps {
  query: string;
  navigate: (path: string) => void;
}

const resultMeta: Record<string, { label: string; icon: React.ElementType }> = {
  blog: { label: 'Blog guide', icon: BookOpen },
  service: { label: 'Service', icon: HeartPulse },
  destination: { label: 'Destination', icon: Globe2 },
  faq: { label: 'FAQ', icon: FileQuestion },
  partner: { label: 'Partner', icon: Building2 }
};

export const SearchPage: React.FC<SearchPageProps> = ({ query, navigate }) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    api.search(query)
      .then((items) => setResults(items))
      .catch((error) => console.error('Search failed', error))
      .finally(() => setLoading(false));
  }, [query]);

  const openResult = (result: SearchResult) => {
    if (result.type === 'blog') navigate(`/blog/${result.slug}`);
    else if (result.type === 'service') navigate(`/services/${result.slug}`);
    else if (result.type === 'destination') navigate('/destinations');
    else if (result.type === 'faq') navigate('/faq');
    else navigate('/#services');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-linear-to-b from-[#075985]/15 to-transparent py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#075985]">Site search</span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-slate-900 md:text-4xl">Search Pranava Nexus Care</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            Find healthcare travel guides, coordination services, destinations, FAQs and network information.
          </p>
          <form onSubmit={(event) => { event.preventDefault(); }} className="mt-6 flex max-w-2xl gap-2">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input value={query} readOnly aria-label="Current search query" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm shadow-sm" />
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {query.trim().length < 2 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">Enter at least two characters in the header search.</div>
        ) : loading ? (
          <div className="py-12 text-center text-sm text-slate-500">Searching approved content...</div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center"><h2 className="font-serif text-xl font-bold text-slate-900">No results found</h2><p className="mt-2 text-sm text-slate-500">Try a different service, destination, guide or healthcare term.</p></div>
        ) : (
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-500">{results.length} result{results.length === 1 ? '' : 's'} for “{query}”</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result, index) => {
                const meta = resultMeta[result.type] || resultMeta.blog;
                const Icon = meta.icon;
                return <article key={`${result.type}-${result.slug}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"><div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0F766E]"><Icon className="h-4 w-4" />{meta.label}</div><h2 className="mt-3 font-serif text-lg font-bold leading-snug text-slate-900">{result.name}</h2><p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{result.description || 'Explore this Pranava Nexus Care resource.'}</p><button onClick={() => openResult(result)} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#075985] hover:text-[#0284C7] focus:outline-none focus:ring-2 focus:ring-sky-400"><span>View resource</span><ArrowRight className="h-3.5 w-3.5" /></button></article>;
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
