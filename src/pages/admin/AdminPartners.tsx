import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import { Partner } from '../../types';
import {
  Building2,
  CheckCircle2,
  Edit2,
  Eye,
  GripVertical,
  ImagePlus,
  Plus,
  Search,
  Trash2,
  X,
  Save
} from 'lucide-react';

const categories = [
  'Hospitals', 'Clinics', 'Doctors', 'Diagnostic Centres', 'Hotels',
  'Travel Partners', 'Airlines', 'Insurance Partners', 'Visa/Immigration Partners',
  'Wellness Partners', 'Other Healthcare Partners'
];

const emptyForm = {
  name: '', category: 'Hospitals', description: '', website_url: '', display_order: 1,
  is_featured: 0, is_active: 1
};

export const AdminPartners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [previewing, setPreviewing] = useState<Partner | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [logo, setLogo] = useState<File | undefined>();
  const [logoPreview, setLogoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const pageSize = 8;

  const loadPartners = async () => {
    try {
      setLoading(true);
      setPartners(await api.getAdminPartners({ search, category, status }));
    } catch (error: any) {
      setFeedback(error.message || 'Failed to load partners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, [search, category, status]);

  const pagedPartners = useMemo(() => partners.slice((page - 1) * pageSize, page * pageSize), [partners, page]);
  const pageCount = Math.max(1, Math.ceil(partners.length / pageSize));

  const openAdd = () => {
    setEditing(null);
    setPartnerModalOpen(true);
    setForm({ ...emptyForm, display_order: partners.length + 1 });
    setLogo(undefined);
    setLogoPreview('');
    setFeedback('');
  };

  const openEdit = (partner: Partner) => {
    setEditing(partner);
    setPartnerModalOpen(true);
    setForm({
      name: partner.name,
      category: partner.category,
      description: partner.description || '',
      website_url: partner.website_url || '',
      display_order: partner.display_order,
      is_featured: partner.is_featured,
      is_active: partner.is_active
    });
    setLogo(undefined);
    setLogoPreview(partner.logo_url);
    setFeedback('');
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setFeedback('Logo must be SVG, PNG, JPG, or WebP and no larger than 5 MB.');
      return;
    }
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
    setFeedback('');
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing && !logo) {
      setFeedback('Choose a partner logo before saving.');
      return;
    }
    if (form.website_url && !/^https?:\/\//i.test(form.website_url)) {
      setFeedback('Website URL must begin with http:// or https://.');
      return;
    }
    try {
      setSaving(true);
      await api.saveAdminPartner({ ...(editing ? { id: editing.id } : {}), ...form }, logo);
      setFeedback('Partner saved successfully.');
      await loadPartners();
      setEditing(null);
      setPartnerModalOpen(false);
    } catch (error: any) {
      setFeedback(error.message || 'Failed to save partner.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (partner: Partner) => {
    try {
      await api.updateAdminPartnerStatus(partner.id, partner.is_active ? 0 : 1);
      await loadPartners();
    } catch (error: any) {
      setFeedback(error.message || 'Failed to update partner status.');
    }
  };

  const remove = async (partner: Partner) => {
    if (!window.confirm(`Delete ${partner.name}? This cannot be undone.`)) return;
    try {
      await api.deleteAdminPartner(partner.id);
      await loadPartners();
    } catch (error: any) {
      setFeedback(error.message || 'Failed to delete partner.');
    }
  };

  const reorder = async (fromId: number, toId: number) => {
    const next = [...partners];
    const fromIndex = next.findIndex((item) => item.id === fromId);
    const toIndex = next.findIndex((item) => item.id === toId);
    if (fromIndex < 0 || toIndex < 0) return;
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    const ordered = next.map((item, index) => ({ ...item, display_order: index + 1 }));
    setPartners(ordered);
    try {
      await api.reorderAdminPartners(ordered.map(({ id, display_order }) => ({ id, display_order })));
    } catch (error: any) {
      setFeedback(error.message || 'Failed to save partner order.');
      await loadPartners();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#075985]">Content Management</span>
          <h1 className="mt-1 font-serif text-2xl font-bold text-slate-900">Our Partners</h1>
          <p className="mt-1 text-xs text-slate-500">Manage verified healthcare and service network records shown on the public website.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#075985] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0369a1]">
          <Plus className="h-4 w-4" /> Add Partner
        </button>
      </div>

      {feedback && <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-[#075985]">{feedback}</div>}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search partners" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
        </label>
        <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="rounded-lg border border-slate-200 px-3 py-2 text-xs">
          <option value="ALL">All categories</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="rounded-lg border border-slate-200 px-3 py-2 text-xs">
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr><th className="px-4 py-3">Logo</th><th className="px-4 py-3">Partner Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Featured</th><th className="px-4 py-3">Order</th><th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? <tr><td colSpan={7} className="py-12 text-center text-slate-400">Loading partners...</td></tr> : pagedPartners.length === 0 ? <tr><td colSpan={7} className="py-12 text-center text-slate-400">No partners match these filters.</td></tr> : pagedPartners.map((partner) => (
                <tr key={partner.id} draggable onDragStart={(event) => event.dataTransfer.setData('partner-id', String(partner.id))} onDragOver={(event) => event.preventDefault()} onDrop={(event) => reorder(Number(event.dataTransfer.getData('partner-id')), partner.id)} className="hover:bg-slate-50">
                  <td className="px-4 py-3"><div className="flex h-12 w-16 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 p-2"><img src={partner.logo_url} alt={`${partner.name} logo`} className="max-h-full max-w-full object-contain" /></div></td>
                  <td className="px-4 py-3"><strong className="block text-slate-900">{partner.name}</strong><span className="text-[10px] text-slate-400">{partner.is_demo ? 'Development demo record' : partner.slug}</span></td>
                  <td className="px-4 py-3 text-slate-600">{partner.category}</td>
                  <td className="px-4 py-3"><button onClick={() => toggleStatus(partner)} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${partner.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}><CheckCircle2 className="h-3 w-3" />{partner.is_active ? 'Active' : 'Inactive'}</button></td>
                  <td className="px-4 py-3 text-slate-600">{partner.is_featured ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1 font-mono text-slate-600"><GripVertical className="h-3.5 w-3.5 text-slate-400" />{partner.display_order}</span></td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-1"><button onClick={() => setPreviewing(partner)} title="Preview partner" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Eye className="h-4 w-4" /></button><button onClick={() => openEdit(partner)} title="Edit partner" className="rounded-lg p-2 text-[#075985] hover:bg-sky-50"><Edit2 className="h-4 w-4" /></button><button onClick={() => remove(partner)} title="Delete partner" className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500"><span>{partners.length} partner records</span><div className="flex items-center gap-2"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-2 py-1 disabled:opacity-40">Previous</button><span>Page {page} of {pageCount}</span><button disabled={page >= pageCount} onClick={() => setPage(page + 1)} className="rounded border px-2 py-1 disabled:opacity-40">Next</button></div></div>
      </div>

      {(partnerModalOpen || previewing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          {previewing ? <div className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-serif text-xl font-bold text-slate-900">Partner Preview</h2><button onClick={() => setPreviewing(null)}><X className="h-5 w-5 text-slate-400" /></button></div><div className="rounded-xl border bg-slate-50 p-8 text-center"><img src={previewing.logo_url} alt={`${previewing.name} logo`} className="mx-auto h-28 max-w-full object-contain" /></div><h3 className="text-lg font-bold text-slate-900">{previewing.name}</h3><p className="text-xs uppercase tracking-wider text-[#0F766E]">{previewing.category}</p><p className="text-sm text-slate-600">{previewing.description || 'No description provided.'}</p></div> : <form onSubmit={save} className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><span className="text-[10px] font-bold uppercase tracking-wider text-[#075985]">Partner record</span><h2 className="font-serif text-xl font-bold text-slate-900">{editing ? 'Edit Partner' : 'Add Partner'}</h2></div><button type="button" onClick={() => { setEditing(null); setPartnerModalOpen(false); }}><X className="h-5 w-5 text-slate-400" /></button></div><div className="grid gap-4 md:grid-cols-2"><label className="text-xs font-semibold text-slate-700">Partner Name *<input required maxLength={180} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label><label className="text-xs font-semibold text-slate-700">Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal">{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-xs font-semibold text-slate-700 md:col-span-2">Website URL<input type="url" value={form.website_url} onChange={(event) => setForm({ ...form, website_url: event.target.value })} placeholder="https://partner.example" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label><label className="text-xs font-semibold text-slate-700 md:col-span-2">Short Description<textarea rows={3} maxLength={500} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label><label className="text-xs font-semibold text-slate-700">Display Order<input type="number" min={0} value={form.display_order} onChange={(event) => setForm({ ...form, display_order: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label><label className="flex items-center gap-2 pt-6 text-xs font-semibold text-slate-700"><input type="checkbox" checked={!!form.is_featured} onChange={(event) => setForm({ ...form, is_featured: event.target.checked ? 1 : 0 })} /> Featured partner</label><label className="flex items-center gap-2 text-xs font-semibold text-slate-700"><input type="checkbox" checked={!!form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked ? 1 : 0 })} /> Active on website</label><label className="text-xs font-semibold text-slate-700 md:col-span-2">Partner Logo {editing ? '(replace optional)' : '*'}<div className="mt-1 flex items-center gap-4 rounded-lg border border-dashed border-slate-300 p-3"><div className="flex h-20 w-28 items-center justify-center rounded border bg-slate-50 p-2">{logoPreview ? <img src={logoPreview} alt="Logo preview" className="max-h-full max-w-full object-contain" /> : <ImagePlus className="h-6 w-6 text-slate-400" />}</div><input required={!editing} type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" onChange={(event) => handleFile(event.target.files?.[0])} className="min-w-0 text-xs" /></div></label></div><div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => { setEditing(null); setPartnerModalOpen(false); }} className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold">Cancel</button><button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#075985] px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"><Save className="h-3.5 w-3.5" />{saving ? 'Saving...' : 'Save Partner'}</button></div></form>}
        </div>
      )}
    </div>
  );
};
