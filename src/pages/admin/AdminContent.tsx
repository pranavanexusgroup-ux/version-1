import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { FAQ, FAQCategory, Blog, Testimonial } from '../../types';
import {
  HelpCircle,
  BookOpen,
  Star,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  ShieldAlert
} from 'lucide-react';

export const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faqs' | 'blogs' | 'testimonials'>('faqs');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // FAQ Modal state
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState<number>(1);

  // Blog Modal state
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('Pranava Nexus Care Liaison Team');

  // Testimonial Modal state
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Testimonial | null>(null);
  const [testName, setTestName] = useState('');
  const [testCountry, setTestCountry] = useState('');
  const [testDest, setTestDest] = useState('Kolkata');
  const [testQuote, setTestQuote] = useState('');
  const [testRating, setTestRating] = useState(5);
  const [testIsDemo, setTestIsDemo] = useState(1);
  const [testVerified, setTestVerified] = useState(1);
  const [testConsent, setTestConsent] = useState(0);
  const [testPublished, setTestPublished] = useState(0);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadAll = async () => {
    try {
      setLoading(true);
      const [faqData, blogData, testData] = await Promise.all([
        api.getFaqs(),
        api.getBlogs(),
        api.getTestimonials()
      ]);
      setFaqs(faqData.faqs);
      setCategories(faqData.categories);
      setBlogs(blogData.blogs);
      setTestimonials(testData);
      if (faqData.categories.length > 0) setFaqCategory(faqData.categories[0].id);
    } catch (err) {
      console.error('Failed to load content', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // --- FAQ Actions ---
  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFeedback('');
    setFaqModalOpen(true);
  };

  const handleOpenEditFaq = (f: FAQ) => {
    setEditingFaq(f);
    setFaqQuestion(f.question);
    setFaqAnswer(f.answer);
    setFaqCategory(f.category_id || 1);
    setFeedback('');
    setFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingFaq) {
        await api.updateAdminFaq(editingFaq.id, {
          category_id: faqCategory,
          question: faqQuestion.trim(),
          answer: faqAnswer.trim()
        });
      } else {
        await api.createAdminFaq({
          category_id: faqCategory,
          question: faqQuestion.trim(),
          answer: faqAnswer.trim(),
          sort_order: faqs.length + 1
        });
      }
      loadAll();
      setFaqModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Error saving FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (!confirm('Delete this FAQ question?')) return;
    try {
      await api.deleteAdminFaq(id);
      loadAll();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  // --- Blog Actions ---
  const handleOpenAddBlog = () => {
    setEditingBlog(null);
    setBlogTitle('');
    setBlogSlug('');
    setBlogSummary('');
    setBlogContent('');
    setBlogAuthor('Pranava Nexus Care Liaison Team');
    setBlogModalOpen(true);
  };

  const handleOpenEditBlog = (b: Blog) => {
    setEditingBlog(b);
    setBlogTitle(b.title);
    setBlogSlug(b.slug);
    setBlogSummary(b.summary || '');
    setBlogContent(b.content);
    setBlogAuthor(b.author);
    setBlogModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingBlog) {
        await api.updateAdminBlog(editingBlog.id, {
          title: blogTitle.trim(),
          summary: blogSummary.trim(),
          content: blogContent.trim(),
          author: blogAuthor.trim()
        });
      } else {
        await api.createAdminBlog({
          title: blogTitle.trim(),
          slug: blogSlug.trim() || blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          summary: blogSummary.trim(),
          content: blogContent.trim(),
          author: blogAuthor.trim()
        });
      }
      loadAll();
      setBlogModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Error saving blog');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm('Delete this published guide?')) return;
    try {
      await api.deleteAdminBlog(id);
      loadAll();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  // --- Testimonial Actions ---
  const handleOpenAddTest = () => {
    setEditingTest(null);
    setTestName('');
    setTestCountry('');
    setTestDest('Kolkata');
    setTestQuote('');
    setTestRating(5);
    setTestIsDemo(1);
    setTestVerified(1);
    setTestConsent(0);
    setTestPublished(0);
    setTestModalOpen(true);
  };

  const handleOpenEditTest = (t: Testimonial) => {
    setEditingTest(t);
    setTestName(t.display_name);
    setTestCountry(t.country);
    setTestDest(t.destination);
    setTestQuote(t.testimonial);
    setTestRating(t.rating || 5);
    setTestIsDemo(t.is_demo);
    setTestVerified(t.verified);
    setTestConsent(t.consent_status);
    setTestPublished(t.published);
    setTestModalOpen(true);
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTest) {
        await api.updateAdminTestimonial(editingTest.id, {
          display_name: testName.trim(),
          country: testCountry.trim(),
          destination: testDest.trim(),
          testimonial: testQuote.trim(),
          rating: testRating,
          is_demo: testIsDemo,
          verified: testVerified,
          consent_status: testConsent,
          published: testPublished
        });
      } else {
        await api.createAdminTestimonial({
          display_name: testName.trim(),
          country: testCountry.trim(),
          destination: testDest.trim(),
          testimonial: testQuote.trim(),
          rating: testRating,
          is_demo: testIsDemo,
          verified: testVerified,
          consent_status: testConsent,
          published: testPublished
        });
      }
      loadAll();
      setTestModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Error saving testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTest = async (id: number) => {
    if (!confirm('Delete this patient narrative?')) return;
    try {
      await api.deleteAdminTestimonial(id);
      loadAll();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-mono font-bold text-[#075985] uppercase tracking-wider">
          Publishing & Compliance
        </span>
        <h1 className="text-2xl font-bold font-serif text-slate-900 mt-0.5">
          Content & Public Information CMS
        </h1>
        <p className="text-xs text-slate-500">
          Manage FAQ responses, patient guides, and verified patient stories with strict statutory demo labelling.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveTab('faqs')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'faqs'
              ? 'border-[#075985] text-[#075985]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blogs')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'blogs'
              ? 'border-[#075985] text-[#075985]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Published Travel Guides ({blogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('testimonials')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'testimonials'
              ? 'border-[#075985] text-[#075985]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Patient Experiences ({testimonials.length})</span>
        </button>
      </div>

      {/* --- TAB 1: FAQS --- */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleOpenAddFaq}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075985] text-white text-xs font-semibold hover:bg-[#0369a1]"
            >
              <Plus className="w-4 h-4 text-[#FFDF73]" />
              <span>Add FAQ Question</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Question</th>
                    <th className="py-3.5 px-4">Answer Overview</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {faqs.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 bg-sky-50 px-2 py-0.5 rounded text-[11px]">
                          {f.category_name || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                        {f.question}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-md truncate">
                        {f.answer}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditFaq(f)}
                          className="p-1 text-[#075985] hover:bg-sky-50 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(f.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: BLOGS --- */}
      {activeTab === 'blogs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleOpenAddBlog}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075985] text-white text-xs font-semibold hover:bg-[#0369a1]"
            >
              <Plus className="w-4 h-4 text-[#FFDF73]" />
              <span>Publish New Guide</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Title & Slug</th>
                    <th className="py-3.5 px-4">Summary</th>
                    <th className="py-3.5 px-4">Author</th>
                    <th className="py-3.5 px-4">Published Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {blogs.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <strong className="block text-slate-900 font-semibold">{b.title}</strong>
                        <span className="font-mono text-[10px] text-slate-400">{b.slug}</span>
                      </td>
                      <td className="py-3.5 px-4 max-w-sm truncate text-slate-600">
                        {b.summary}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{b.author}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {b.published_date}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditBlog(b)}
                          className="p-1 text-[#075985] hover:bg-sky-50 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(b.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: TESTIMONIALS --- */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl">
            <div className="flex items-start gap-2 text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Statutory Compliance Requirement:</strong> Demonstration stories MUST have the DEMO badge flag enabled. Only stories with verified patient written consent can have DEMO unchecked.
              </div>
            </div>

            <button
              onClick={handleOpenAddTest}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075985] text-white text-xs font-semibold hover:bg-[#0369a1] shrink-0"
            >
              <Plus className="w-4 h-4 text-[#FFDF73]" />
              <span>Add Patient Story</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Patient Name</th>
                    <th className="py-3.5 px-4">Route</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">Narrative Quote</th>
                    <th className="py-3.5 px-4">DEMO / Verified</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {testimonials.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {t.display_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {t.country} &rarr; {t.destination}
                      </td>
                      <td className="py-3.5 px-4 text-amber-500 font-bold">
                        ★ {t.rating}.0
                      </td>
                      <td className="py-3.5 px-4 max-w-sm truncate italic text-slate-600">
                        "{t.testimonial}"
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {t.is_demo === 1 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                              DEMO
                            </span>
                          )}
                          {t.verified === 1 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                              Verified
                            </span>
                          )}
                          {t.published === 1 && t.consent_status === 1 && t.verified === 1 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-100">Shown publicly</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditTest(t)}
                          className="p-1 text-[#075985] hover:bg-sky-50 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTest(t.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- FAQ Modal --- */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold font-serif text-slate-900 text-base">
                {editingFaq ? 'Edit FAQ Question' : 'Add FAQ Question'}
              </h3>
              <button onClick={() => setFaqModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="e.g. Can Pranava Nexus Care arrange a medical visa letter?"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Provide clear, transparent, non-clinical answer..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#075985] text-white rounded-lg font-semibold"
                >
                  {saving ? 'Saving...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Blog Modal --- */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold font-serif text-slate-900 text-base">
                {editingBlog ? 'Edit Healthcare Travel Guide' : 'Publish New Guide'}
              </h3>
              <button onClick={() => setBlogModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="e.g. Essential Checklist for Medical Travel to Kolkata"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              {!editingBlog && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    placeholder="e.g. kolkata-medical-travel-checklist"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  value={blogSummary}
                  onChange={(e) => setBlogSummary(e.target.value)}
                  placeholder="Short introductory summary shown in listings..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Content Body</label>
                <textarea
                  rows={6}
                  required
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Full text of the article..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Author Credit</label>
                <input
                  type="text"
                  value={blogAuthor}
                  onChange={(e) => setBlogAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#075985] text-white rounded-lg font-semibold"
                >
                  {saving ? 'Publishing...' : 'Publish Guide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Testimonial Modal --- */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold font-serif text-slate-900 text-base">
                {editingTest ? 'Edit Patient Narrative' : 'Add Patient Story'}
              </h3>
              <button onClick={() => setTestModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveTest} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="e.g. Tariqul Islam"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origin Country</label>
                  <input
                    type="text"
                    required
                    value={testCountry}
                    onChange={(e) => setTestCountry(e.target.value)}
                    placeholder="e.g. Bangladesh"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination Hub</label>
                  <input
                    type="text"
                    required
                    value={testDest}
                    onChange={(e) => setTestDest(e.target.value)}
                    placeholder="e.g. Kolkata"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating (1 to 5)</label>
                  <select
                    value={testRating}
                    onChange={(e) => setTestRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Good)</option>
                    <option value={3}>3 Stars</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient Testimonial Quote</label>
                <textarea
                  rows={3}
                  required
                  value={testQuote}
                  onChange={(e) => setTestQuote(e.target.value)}
                  placeholder="Patient's experience regarding non-clinical coordination..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg resize-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950">
                  <input
                    type="checkbox"
                    checked={testIsDemo === 1}
                    onChange={(e) => setTestIsDemo(e.target.checked ? 1 : 0)}
                    className="w-4 h-4 rounded text-[#075985]"
                  />
                  <span>Mark visibly with DEMO tag (Required for sample reviews)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={testVerified === 1}
                    onChange={(e) => setTestVerified(e.target.checked ? 1 : 0)}
                    className="w-4 h-4 rounded text-[#075985]"
                  />
                  <span>Patient Identity & Travel Records Verified</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" checked={testConsent === 1} onChange={(e) => setTestConsent(e.target.checked ? 1 : 0)} className="w-4 h-4 rounded text-[#075985]" />
                  <span>Written consent received</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#075985]">
                  <input type="checkbox" checked={testPublished === 1} onChange={(e) => setTestPublished(e.target.checked ? 1 : 0)} className="w-4 h-4 rounded text-[#075985]" />
                  <span>Approve and show on website</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#075985] text-white rounded-lg font-semibold"
                >
                  {saving ? 'Saving...' : 'Save Narrative'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
