import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Blog } from '../types';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

interface BlogPageProps {
  navigate: (path: string) => void;
  openEnquiryModal: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ navigate }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await api.getBlogs();
        setBlogs(data.blogs);
      } catch (err) {
        console.error('Failed to load blogs', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-[#075985]/15 to-transparent pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075985] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Guidance & Practical Articles
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 mt-3">
              Medical Travel Insights & Guides
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
              In-depth articles explaining medical visa procedures, document preparation, Kolkata as a regional healthcare gateway, and practical attendant planning.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading published guides...</div>
          ) : blogs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-[#075985]" />
              <h2 className="mt-3 font-serif text-xl font-bold text-slate-900">Guides are being prepared</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">New healthcare travel articles will appear here as soon as they are published.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/90 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {blog.featured_image && (
                    <img
                      src={blog.featured_image}
                      alt=""
                      loading="lazy"
                      className="h-44 w-full object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="bg-sky-50 text-[#075985] font-semibold px-2.5 py-0.5 rounded-full">
                        {blog.category_name || 'Travel Guide'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {blog.published_date}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold font-serif text-slate-900 leading-snug mb-3">
                      {blog.title}
                    </h2>

                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {blog.summary}
                    </p>
                  </div>

                  <div className="px-6 py-4 bg-white border-t border-slate-200/70 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {blog.author}
                    </span>

                    <button
                      onClick={() => navigate(`/blog/${blog.slug}`)}
                      className="text-xs font-bold text-[#075985] hover:text-[#0284C7] flex items-center gap-1"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
