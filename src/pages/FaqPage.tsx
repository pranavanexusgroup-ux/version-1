import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { FAQ, FAQCategory } from '../types';
import { HelpCircle, ChevronDown, Search, ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

interface FaqPageProps {
  navigate: (path: string) => void;
  openEnquiryModal: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ navigate, openEnquiryModal }) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Frequently Asked Questions (FAQ) | Pranava Nexus Care',
    description: 'Find answers to common questions regarding medical tourism coordination, hospital appointment scheduling, patient attendant duties, visa letters, and non-clinical assistance.',
    keywords: ['medical tourism faq', 'patient travel questions', 'hospital coordination faq', 'medical visa letters india faq'],
    canonicalUrl: 'https://pranavanexuscare.com/faq',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.slice(0, 8).map((f) => ({
        '@type': 'Question',
        'name': f.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.answer
        }
      }))
    }
  });


  useEffect(() => {
    async function loadFaqs() {
      try {
        const data = await api.getFaqs();
        setFaqs(data.faqs);
        setCategories(data.categories);
        if (data.faqs.length > 0) {
          setExpandedFaqId(data.faqs[0].id);
        }
      } catch (err) {
        console.error('Failed to load faqs', err);
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
  }, []);

  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = selectedCategory === 'ALL' || f.category_slug === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: number) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-[#075985]/15 to-transparent pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Clear & Transparent Answers
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 mt-3">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
              Find transparent answers about our non-clinical coordination boundaries, appointment scheduling, hospital liaison, accommodation assistance, and fees.
            </p>
          </div>
        </div>
      </section>

      {/* Main FAQ Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar & Category Filters */}
          <div className="space-y-4 mb-10">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions by keyword (e.g., visa, emergency, documents, Kolkata)..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#075985] focus:bg-white transition-all"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#075985] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Questions ({faqs.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-[#075985] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading FAQs...</div>
          ) : filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-600">No matching questions found for "{searchTerm}".</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                }}
                className="mt-3 text-xs text-[#075985] font-bold underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left p-5 bg-white hover:bg-slate-50/80 flex items-center justify-between gap-4 transition-colors"
                    >
                      <span className="font-serif font-bold text-slate-900 text-sm md:text-base leading-snug">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#075985]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 bg-slate-50 text-xs md:text-sm text-slate-700 leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Help Desk */}
          <div className="mt-16 bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-4">
            <h3 className="text-lg font-bold font-serif text-slate-900">
              Have a specific question not covered here?
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Our Kolkata-based coordination team is on hand to answer logistical inquiries or provide personalized guidance.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={openEnquiryModal}
                className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#075985] hover:bg-[#0369a1]"
              >
                Submit Direct Enquiry
              </button>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
              >
                Chat on WhatsApp (+91 98765 43210)
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
