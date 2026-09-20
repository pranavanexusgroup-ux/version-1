import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Sliders,
  Building2,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  RefreshCw,
  Star,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [googleFeedback, setGoogleFeedback] = useState('');

  // Form states
  const [siteName, setSiteName] = useState('M/s. PRANAVA NEXUS CARE');
  const [tagline, setTagline] = useState('One Nexus. Endless Opportunities.');
  const [address, setAddress] = useState('5A, Kalipada Mukherjee Road, Purba Barisha, Kolkata – 700 008, West Bengal, India');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('care@pranavanexuscare.com');
  const [googlePlaceId, setGooglePlaceId] = useState('');
  const [googleRating, setGoogleRating] = useState('4.9');
  const [googleCount, setGoogleCount] = useState('28');

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const data = await api.getAdminSettings();
        setSettings(data);
        const siteValues = Object.fromEntries((data.siteSettings || []).map((item: any) => [item.key, item.value]));
        const contactValues = Object.fromEntries((data.contactSettings || []).map((item: any) => [item.key, item.value]));
        const google = data.googleSettings || {};
        if (siteValues.site_name) setSiteName(siteValues.site_name);
        if (siteValues.site_tagline) setTagline(siteValues.site_tagline);
        if (contactValues.contact_address) setAddress(contactValues.contact_address);
        if (contactValues.contact_phone) setPhone(contactValues.contact_phone);
        if (contactValues.contact_email) setEmail(contactValues.contact_email);
        if (google.place_id) setGooglePlaceId(google.place_id);
        if (google.rating !== undefined && google.rating !== null) setGoogleRating(String(google.rating));
        if (google.review_count !== undefined && google.review_count !== null) setGoogleCount(String(google.review_count));
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');

    try {
      await api.updateAdminSettings({
        site: { site_name: siteName, site_tagline: tagline },
        contact: { contact_address: address, contact_phone: phone, contact_email: email },
        google: { place_id: googlePlaceId, rating: Number(googleRating) || 0, review_count: Number(googleCount) || 0, is_configured: Boolean(googlePlaceId) }
      });
      setFeedback('Enterprise settings updated successfully.');
    } catch (err: any) {
      setFeedback(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSyncGoogle = async () => {
    setSyncing(true);
    setGoogleFeedback('');
    try {
      const res = await api.syncGoogleReviews();
      setGoogleFeedback(res.message || 'Google Places sync completed.');
    } catch (err: any) {
      setGoogleFeedback(err.message || 'Sync error.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono font-bold text-[#075985] uppercase tracking-wider">
          System Configuration
        </span>
        <h1 className="text-2xl font-bold font-serif text-slate-900 mt-0.5">
          Enterprise & Integration Settings
        </h1>
        <p className="text-xs text-slate-500">
          Configure legal entity details, Kolkata office location, contact endpoints, and Google Business Profile reviews.
        </p>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Organization Details */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-[#075985]" />
            <h2 className="font-bold font-serif text-slate-900 text-base">
              Business Entity Profile
            </h2>
          </div>

          <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Entity Name
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Enterprise Tagline
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Registered Head Office Address (Kolkata)
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Primary Coordination Desk Phone / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Primary Enquiries Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-[#075985] text-white rounded-xl font-semibold text-xs hover:bg-[#0369a1] shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Enterprise Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Google Reviews Integration */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Star className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold font-serif text-slate-900 text-base">
              Google Business & Reviews Sync
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Configure your Google Places Place ID to connect real Google Business data. No sample Google ratings or fake Google reviews are shown when this is not configured.
            </p>

            {googleFeedback && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-[#075985]">
                {googleFeedback}
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Google Places Place ID
              </label>
              <input
                type="text"
                value={googlePlaceId}
                onChange={(e) => setGooglePlaceId(e.target.value)}
                placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fallback Rating
                </label>
                <input
                  type="text"
                  value={googleRating}
                  onChange={(e) => setGoogleRating(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Review Count Benchmark
                </label>
                <input
                  type="text"
                  value={googleCount}
                  onChange={(e) => setGoogleCount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSyncGoogle}
                disabled={syncing}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Connecting to Places API...' : 'Test Sync Google Places'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
