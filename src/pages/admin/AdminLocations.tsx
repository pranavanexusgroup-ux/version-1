import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Location, Country, City, Service } from '../../types';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Save,
  Globe2,
  Calendar,
  Layers
} from 'lucide-react';

export const AdminLocations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<Location | null>(null);
  const [cityName, setCityName] = useState('');
  const [citySlug, setCitySlug] = useState('');
  const [countryId, setCountryId] = useState<number>(1);
  const [availability, setAvailability] = useState<'AVAILABLE' | 'ON_REQUEST' | 'LIMITED' | 'COMING_SOON'>('AVAILABLE');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [locList, cList, sList] = await Promise.all([
        api.getLocations(),
        api.getCountries(),
        api.getServices()
      ]);
      setLocations(locList);
      setCountries(cList);
      setServices(sList);
      if (cList.length > 0) setCountryId(cList[0].id);
    } catch (err) {
      console.error('Failed to load locations admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingLoc(null);
    setCityName('');
    setCitySlug('');
    setAvailability('AVAILABLE');
    setDescription('');
    setFeedback('');
    setModalOpen(true);
  };

  const handleOpenEdit = (loc: Location) => {
    setEditingLoc(loc);
    setCityName(loc.city_name || loc.title || '');
    setCitySlug(loc.city_slug || loc.slug || '');
    setAvailability(loc.availability_status);
    setDescription(loc.description || '');
    setFeedback('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');

    try {
      if (editingLoc) {
        await api.updateAdminLocation(editingLoc.id, {
          title: editingLoc.title || `${editingLoc.city_name} Medical Travel Coordination`,
          slug: editingLoc.slug || editingLoc.city_slug,
          availability_status: availability,
          description: description.trim(),
          published: 1
        });
        setFeedback('Healthcare location updated successfully.');
      } else {
        await api.createAdminLocation({
          country_id: countryId,
          city_name: cityName.trim(),
          city_slug: citySlug.trim() || cityName.toLowerCase().replace(/\s+/g, '-'),
          title: `${cityName.trim()} Medical Travel Coordination`,
          slug: citySlug.trim() || cityName.toLowerCase().replace(/\s+/g, '-'),
          availability_status: availability,
          description: description.trim(),
          published: 1
        });
        setFeedback('New healthcare hub created successfully.');
      }
      loadData();
      setTimeout(() => setModalOpen(false), 1200);
    } catch (err: any) {
      setFeedback(err.message || 'Error saving location.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hub location?')) return;
    try {
      await api.deleteAdminLocation(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-[#075985] uppercase tracking-wider">
            Network Operations
          </span>
          <h1 className="text-2xl font-bold font-serif text-slate-900 mt-0.5">
            Healthcare Hubs & Availability Engine
          </h1>
          <p className="text-xs text-slate-500">
            Control live destination availability, city status, and public directory visibility.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075985] text-white text-xs font-semibold hover:bg-[#0369a1] shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#FFDF73]" />
          <span>Add Healthcare Hub</span>
        </button>
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Country & Flag</th>
                <th className="py-3.5 px-4">City / Hub Name</th>
                <th className="py-3.5 px-4">Operational Status</th>
                <th className="py-3.5 px-4">Last Verified Date</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading healthcare hubs...
                  </td>
                </tr>
              ) : locations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No locations recorded.
                  </td>
                </tr>
              ) : (
                locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{loc.country_flag || '🌐'}</span>
                        <span className="font-semibold text-slate-900">{loc.country_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {loc.city_name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                          loc.availability_status === 'AVAILABLE'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}
                      >
                        {loc.availability_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {loc.last_verified_date || '2026-07-15'}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">
                      {loc.description || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(loc)}
                        className="p-1.5 rounded text-[#075985] hover:bg-sky-50 transition-colors"
                        title="Edit Hub"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(loc.id)}
                        className="p-1.5 rounded text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Hub"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold font-serif text-slate-900 text-base">
                {editingLoc ? `Edit Hub: ${editingLoc.city_name}` : 'Add New Healthcare Hub'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-[#075985]">
                {feedback}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {!editingLoc && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Country Selection
                    </label>
                    <select
                      value={countryId}
                      onChange={(e) => setCountryId(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.flag || c.flag_emoji || '🌐'} {c.name} ({c.iso_code || c.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">City Name</label>
                      <input
                        type="text"
                        required
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        placeholder="e.g. Kolkata"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">URL Slug</label>
                      <input
                        type="text"
                        value={citySlug}
                        onChange={(e) => setCitySlug(e.target.value)}
                        placeholder="e.g. kolkata"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Availability Status
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="AVAILABLE">AVAILABLE (Full Live Coordination)</option>
                  <option value="ON_REQUEST">ON_REQUEST (Specialist Schedule Permitting)</option>
                  <option value="LIMITED">LIMITED (High Peak Season Delay)</option>
                  <option value="COMING_SOON">COMING_SOON (In Pipeline)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Specialty Hub Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Premier Eastern India healthcare hub specializing in cardiology, oncology, organ transplants, and medical travel coordination..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#075985] text-white rounded-lg hover:bg-[#0369a1] font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Hub'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
