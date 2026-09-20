import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Enquiry, EnquiryStatusHistory } from '../../types';
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Send,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  MessageSquare
} from 'lucide-react';

export const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [history, setHistory] = useState<EnquiryStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Status Change Form State
  const [newStatus, setNewStatus] = useState<Enquiry['status']>('CONTACTED');
  const [statusNote, setStatusNote] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const list = await api.getAdminEnquiries();
      setEnquiries(list);

      // If URL has ?id=xxx
      const params = new URLSearchParams(window.location.search);
      const queryId = params.get('id');
      if (queryId) {
        const found = list.find((e) => e.id === parseInt(queryId));
        if (found) {
          handleSelectEnquiry(found);
        }
      }
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleSelectEnquiry = async (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setNewStatus(enq.status);
    setInternalNotes(enq.internal_notes || '');
    setStatusNote('');
    setActionSuccess('');

    try {
      const res = await api.getAdminEnquiryDetail(enq.id);
      setSelectedEnquiry(res.enquiry);
      setHistory(res.history || []);
      setInternalNotes(res.enquiry.internal_notes || '');
    } catch (err) {
      console.error('Failed to fetch full enquiry history', err);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setUpdating(true);
    setActionSuccess('');

    try {
      const res = await api.updateEnquiryStatus(selectedEnquiry.id, newStatus, statusNote);
      if (res.success) {
        setActionSuccess(`Status successfully updated to ${newStatus}`);
        setStatusNote('');
        // Refresh detail and list
        const updatedDetail = await api.getAdminEnquiryDetail(selectedEnquiry.id);
        setSelectedEnquiry(updatedDetail.enquiry);
        setHistory(updatedDetail.history || []);
        fetchEnquiries();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveInternalNotes = async () => {
    if (!selectedEnquiry) return;
    setUpdating(true);
    try {
      await api.updateEnquiryNotes(selectedEnquiry.id, internalNotes);
      setActionSuccess('Internal clinical coordination notes saved.');
      // Refresh
      const updatedDetail = await api.getAdminEnquiryDetail(selectedEnquiry.id);
      setSelectedEnquiry(updatedDetail.enquiry);
    } catch (err: any) {
      alert(err.message || 'Failed to save notes');
    } finally {
      setUpdating(false);
    }
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      item.reference_no.toLowerCase().includes(term) ||
      item.full_name.toLowerCase().includes(term) ||
      item.phone_whatsapp.toLowerCase().includes(term) ||
      (item.email && item.email.toLowerCase().includes(term)) ||
      (item.treatment_specialty && item.treatment_specialty.toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONTACTED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'IN_REVIEW':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'IN_PROGRESS':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-[#075985] uppercase tracking-wider">
            Patient Intake Workflow
          </span>
          <h1 className="text-2xl font-bold font-serif text-slate-900 mt-0.5">
            Enquiries & Coordination Management
          </h1>
          <p className="text-xs text-slate-500">
            Real-time status transitions, hospital liaison assignment, and internal case documentation.
          </p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient name, reference number, phone, or specialty..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#075985]"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'NEW', 'CONTACTED', 'IN_REVIEW', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    statusFilter === st
                      ? 'bg-[#075985] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Reference No</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Specialty & Destination</th>
                <th className="py-3.5 px-4">Submission Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading patient enquiries from database...
                  </td>
                </tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching enquiries found.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      selectedEnquiry?.id === item.id ? 'bg-sky-50/60' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.reference_no}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {item.full_name}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{item.phone_whatsapp}</div>
                      {item.email && (
                        <div className="text-[11px] text-slate-400">{item.email}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">
                        {item.treatment_specialty || 'General Inquiry'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.preferred_destination || 'Undecided'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleSelectEnquiry(item)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#075985] bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage Case</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Management Drawer / Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white min-h-screen shadow-2xl flex flex-col justify-between">
            {/* Drawer Header */}
            <div className="bg-[#075985] text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#FFDF73]">
                    {selectedEnquiry.reference_no}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusBadge(
                      selectedEnquiry.status
                    )}`}
                  >
                    {selectedEnquiry.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold font-serif mt-1">
                  {selectedEnquiry.full_name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
              {actionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Patient Dossier Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 font-serif text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-[#075985]" />
                  Patient Case Dossier
                </h3>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contact Phone / WhatsApp</span>
                    <strong className="text-slate-800">{selectedEnquiry.phone_whatsapp}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email Address</span>
                    <strong className="text-slate-800">{selectedEnquiry.email || 'None provided'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Patient Location</span>
                    <strong className="text-slate-800">
                      {selectedEnquiry.country_city || [selectedEnquiry.city, selectedEnquiry.country].filter(Boolean).join(', ') || 'Not specified'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Preferred Medical Hub</span>
                    <strong className="text-slate-800">
                      {selectedEnquiry.preferred_destination || 'Open to coordinator recommendation'}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Treatment Specialty</span>
                  <strong className="text-slate-800 text-xs">
                    {selectedEnquiry.treatment_specialty || 'General Treatment Evaluation'}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Patient Requirements / Medical Summary</span>
                  <p className="p-3 bg-white rounded-lg border border-slate-200 mt-1 leading-relaxed text-slate-800">
                    {selectedEnquiry.brief_requirement || 'No additional details entered.'}
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                  <span>Consent Given: {(selectedEnquiry.consent || selectedEnquiry.consent_agreed) ? 'Yes (Privacy Policy Accepted)' : 'No'}</span>
                  <span>Received: {new Date(selectedEnquiry.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Status Transition Control */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-bold text-slate-900 font-serif text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#075985]" />
                  Update Workflow Status
                </h3>

                <form onSubmit={handleStatusUpdate} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        New Stage
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED (Patient reached)</option>
                        <option value="IN_REVIEW">IN_REVIEW (Hospital reviewing reports)</option>
                        <option value="IN_PROGRESS">IN_PROGRESS (Journey & stay coordinated)</option>
                        <option value="COMPLETED">COMPLETED (Treatment & return done)</option>
                        <option value="CLOSED">CLOSED (Cancelled or declined)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Transition Note / Hospital Reference
                      </label>
                      <input
                        type="text"
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        placeholder="e.g. Sent reports to Apollo Kolkata Dr. Roy"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 bg-[#075985] text-white rounded-lg font-semibold hover:bg-[#0369a1] text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply Status Transition</span>
                  </button>
                </form>
              </div>

              {/* Internal Notes Editor */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 font-serif text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#075985]" />
                    Internal Staff & Liaison Notes
                  </h3>
                  <button
                    type="button"
                    onClick={handleSaveInternalNotes}
                    disabled={updating}
                    className="px-3 py-1 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save Notes</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record confidential coordinator notes, doctor communication details, flight timing, or hotel confirmation codes..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#075985]"
                />
              </div>

              {/* Status Audit Trail */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 font-serif text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#075985]" />
                  Audit Trail & History Log
                </h3>

                <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-1">
                  {history && history.length > 0 ? (
                    history.map((h) => (
                      <div key={h.id} className="relative pb-2">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#075985] border-2 border-white"></div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{h.status}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(h.created_at).toLocaleString()}
                          </span>
                        </div>
                        {h.notes && (
                          <p className="text-slate-600 text-[11px] mt-0.5">{h.notes}</p>
                        )}
                        <span className="text-[10px] text-slate-400">
                          By: {h.changed_by_name || 'System'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-xs">No status transitions recorded yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
