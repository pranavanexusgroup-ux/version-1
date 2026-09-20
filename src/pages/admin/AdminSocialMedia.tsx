import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { SocialMediaItem } from '../../types';
import { ExternalLink, Pencil, Plus, Trash2, X } from 'lucide-react';

const emptyItem: Partial<SocialMediaItem> = { platform: 'YouTube', title: '', url: '', thumbnail_url: '', description: '', sort_order: 1, is_active: 1 };

export const AdminSocialMedia: React.FC = () => {
  const [items, setItems] = useState<SocialMediaItem[]>([]);
  const [form, setForm] = useState<Partial<SocialMediaItem>>(emptyItem);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const load = async () => setItems(await api.getAdminSocialMedia());
  useEffect(() => { load().catch((error) => setFeedback(error.message)); }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      await api.saveAdminSocialMedia(form);
      setOpen(false);
      setForm(emptyItem);
      setFeedback('Social media content saved.');
      await load();
    } catch (error: any) { setFeedback(error.message); } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Remove this social media item?')) return;
    await api.deleteAdminSocialMedia(id);
    await load();
  };

  return <div className="space-y-6"><div className="flex items-end justify-between"><div><span className="text-xs font-bold uppercase tracking-wider text-[#075985]">Content Management</span><h1 className="mt-1 font-serif text-2xl font-bold text-slate-900">Facebook & YouTube Media</h1><p className="mt-1 text-xs text-slate-500">Add approved videos, posts, and channel links for the public care media section.</p></div><button onClick={() => { setForm({ ...emptyItem, sort_order: items.length + 1 }); setOpen(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#075985] px-4 py-2.5 text-xs font-bold text-white"><Plus className="h-4 w-4" /> Add Media</button></div>{feedback && <div className="rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs text-[#075985]">{feedback}</div>}<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full text-left text-xs"><thead className="border-b bg-slate-50 text-slate-500"><tr><th className="px-4 py-3">Platform</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">URL</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={item.id}><td className="px-4 py-3 font-bold text-[#075985]">{item.platform}</td><td className="px-4 py-3 font-semibold text-slate-900">{item.title}</td><td className="max-w-xs truncate px-4 py-3 text-slate-500">{item.url}</td><td className="px-4 py-3">{item.is_active ? 'Active' : 'Inactive'}</td><td className="px-4 py-3 text-right"><button onClick={() => { setForm(item); setOpen(true); }} className="mr-2 rounded p-2 text-[#075985] hover:bg-sky-50"><Pencil className="h-4 w-4" /></button><a href={item.url} target="_blank" rel="noopener noreferrer" className="mr-2 inline-flex rounded p-2 text-slate-500 hover:bg-slate-100"><ExternalLink className="h-4 w-4" /></a><button onClick={() => remove(item.id)} className="rounded p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button></td></tr>)}</tbody></table></div>{open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"><form onSubmit={save} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-serif text-xl font-bold text-slate-900">{form.id ? 'Edit media' : 'Add media'}</h2><button type="button" onClick={() => setOpen(false)}><X className="h-5 w-5 text-slate-400" /></button></div><label className="block text-xs font-semibold">Platform<select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="mt-1 w-full rounded-lg border p-2"><option>YouTube</option><option>Facebook</option><option>Instagram</option><option>LinkedIn</option><option>Other</option></select></label><label className="block text-xs font-semibold">Title<input required value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label><label className="block text-xs font-semibold">Video or post URL<input required type="url" value={form.url || ''} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." className="mt-1 w-full rounded-lg border p-2" /></label><label className="block text-xs font-semibold">Thumbnail URL (optional)<input type="url" value={form.thumbnail_url || ''} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label><label className="block text-xs font-semibold">Description<textarea rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label><label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} /> Show on website</label><button disabled={saving} className="w-full rounded-lg bg-[#075985] py-2.5 text-xs font-bold text-white">{saving ? 'Saving...' : 'Save Media'}</button></form></div>}</div>;
};
