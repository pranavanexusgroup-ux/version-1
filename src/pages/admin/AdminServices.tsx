import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Service } from '../../types';
import {
  HeartPulse,
  Edit2,
  CheckCircle2,
  ShieldCheck,
  Save,
  X,
  FileText
} from 'lucide-react';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isActive, setIsActive] = useState(1);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadServices = async () => {
    try {
      setLoading(true);
      const list = await api.getServices();
      setServices(list);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleEdit = (s: Service) => {
    setEditingService(s);
    setShortDesc(s.short_description);
    setFullDesc(s.full_description);
    setRequirements(s.requirements || '');
    setIsActive(s.is_active ?? s.published ?? 1);
    setMessage('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setSaving(true);
    setMessage('');

    try {
      await api.updateAdminService(editingService.id, {
        short_description: shortDesc.trim(),
        full_description: fullDesc.trim(),
        requirements: requirements.trim(),
        is_active: isActive
      });
      setMessage('Service specifications updated successfully.');
      loadServices();
      setTimeout(() => setEditingService(null), 1200);
    } catch (err: any) {
      setMessage(err.message || 'Error updating service.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono font-bold text-[#075985] uppercase tracking-wider">
          Service Portfolio Governance
        </span>
        <h1 className="text-2xl font-bold font-serif text-slate-900 mt-0.5">
          Approved Non-Clinical Coordination Services
        </h1>
        <p className="text-xs text-slate-500">
          Governance of the 9 core approved healthcare travel services operated by M/s. Pranava Nexus Care.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Service Name & Slug</th>
                <th className="py-3.5 px-4">Overview</th>
                <th className="py-3.5 px-4">Documentation Requirements</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading services...
                  </td>
                </tr>
              ) : (
                services.map((srv, idx) => (
                  <tr key={srv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                      0{idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="block text-slate-900 font-semibold">
                        {srv.name}
                      </strong>
                      <span className="font-mono text-[10px] text-[#075985]">
                        {srv.slug}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm truncate text-slate-600">
                      {srv.short_description}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">
                      {srv.requirements || 'Standard enquiry details'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleEdit(srv)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#075985] bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Scope</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#075985]">
                  Service Scope Editor
                </span>
                <h3 className="font-bold font-serif text-slate-900 text-base">
                  {editingService.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {message && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-[#075985]">
                {message}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Summary (Shown on cards & directory)
                </label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Detailed Operational Scope
                </label>
                <textarea
                  rows={4}
                  required
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Required Documents / Prerequisites
                </label>
                <input
                  type="text"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="e.g. Diagnostic reports, Passport copy, Doctor notes"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
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
                  <span>{saving ? 'Saving...' : 'Update Specifications'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
