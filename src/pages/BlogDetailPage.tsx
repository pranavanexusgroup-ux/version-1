import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Blog } from '../types';
import { Calendar, User, ArrowLeft, ArrowRight, ShieldCheck, Share2 } from 'lucide-react';

interface BlogDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
  openEnquiryModal: () => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  slug,
  navigate,
  openEnquiryModal
}) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      try {
        const b = await api.getBlogBySlug(slug);
        setBlog(b);
      } catch (err) {
        console.error('Failed to load blog', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <div className="w-8 h-8 border-3 border-[#075985] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-slate-500">Loading guide...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center px-4">
        <h2 className="text-2xl font-bold font-serif text-slate-800">Article Not Found</h2>
        <p className="text-sm text-slate-600 mt-2">The requested guide could not be retrieved.</p>
        <button
          onClick={() => navigate('/blog')}
          className="mt-4 px-4 py-2 bg-[#075985] text-white rounded-lg text-xs font-semibold"
        >
          Return to Blog Directory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Article Header */}
      <section className="bg-linear-to-b from-[#075985]/15 to-transparent pt-10 pb-12 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/blog')}
            className="text-xs font-semibold text-[#075985] hover:underline inline-flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Healthcare Travel Guides
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            <span className="bg-sky-50 text-[#075985] font-bold px-2.5 py-0.5 rounded-full border border-sky-100">
              {blog.category_name || 'Travel Guide'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {blog.published_date}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {blog.author}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-slate-900 leading-tight">
            {blog.title}
          </h1>

          {blog.summary && (
            <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed font-serif italic border-l-4 border-[#F4C430] pl-4 py-1">
              {blog.summary}
            </p>
          )}
        </div>
      </section>

      {/* Article Body */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm md:text-base space-y-6">
            {blog.content.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Author & Disclaimer Box */}
          <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-[#075985]" />
              <span>Editorial & Non-Clinical Disclaimer</span>
            </div>
            <p>
              This article is published for educational and practical travel coordination planning only. It does not constitute medical diagnosis, clinical prescription, or formal healthcare advice. Consult authorized medical specialists for diagnostic or therapeutic determinations.
            </p>
          </div>

          {/* Bottom Enquiry CTA */}
          <div className="mt-8 bg-sky-50 border border-sky-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold font-serif text-slate-900 text-base">
                Planning Medical Travel to Kolkata or Other Hubs?
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Our coordination team can guide you through the appointment and logistical sequence.
              </p>
            </div>
            <button
              onClick={openEnquiryModal}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#075985] hover:bg-[#0369a1] transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Submit Treatment Enquiry</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFDF73]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
