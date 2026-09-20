import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AdminStats, Enquiry, ActivityLog } from '../../types';
import {
  ClipboardList,
  MapPin,
  HeartPulse,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

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

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-[#075985] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">Loading operations dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-[#075985] uppercase tracking-wider">
            Operational Overview
          </span>
          <h1 className="text-2xl font-bold font-serif text-slate-900 mt-1">
            Healthcare Travel Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Headquartered at 5A, Kalipada Mukherjee Road, Purba Barisha, Kolkata – 700 008.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/enquiries')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075985] text-white text-xs font-semibold hover:bg-[#0369a1] shadow-xs"
        >
          <ClipboardList className="w-4 h-4 text-[#FFDF73]" />
          <span>Manage All Enquiries</span>
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Enquiries</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#075985] flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-serif text-slate-900">
              {stats?.totalEnquiries ?? 0}
            </span>
            {stats?.newEnquiries ? (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                {stats.newEnquiries} NEW
              </span>
            ) : (
              <span className="text-xs text-slate-400">All reviewed</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">Live inquiries in database</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Healthcare Hubs</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-serif text-slate-900">
              {stats?.totalLocations ?? 0}
            </span>
            <span className="text-xs text-emerald-700 font-medium">Active in Engine</span>
          </div>
          <p className="text-[11px] text-slate-500">India & International hubs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Approved Services</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-serif text-slate-900">
              {stats?.totalServices ?? 9}
            </span>
            <span className="text-xs text-indigo-700 font-medium">Core Catalog</span>
          </div>
          <p className="text-[11px] text-slate-500">Non-clinical coordination scopes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Published Resources</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-serif text-slate-900">
              {(stats?.totalFaqs ?? 0) + (stats?.totalBlogs ?? 0)}
            </span>
            <span className="text-xs text-slate-500">
              {stats?.totalFaqs ?? 0} FAQs &bull; {stats?.totalBlogs ?? 0} Guides
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Verified educational guides</p>
        </div>
      </div>

      {/* Main Grid: Recent Enquiries & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Enquiries Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900">
                Recent Patient Travel Enquiries
              </h3>
              <p className="text-xs text-slate-500">Latest submissions requiring case liaison</p>
            </div>
            <button
              onClick={() => navigate('/admin/enquiries')}
              className="text-xs font-semibold text-[#075985] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ref / Date</th>
                  <th className="py-3 px-4">Patient & Contact</th>
                  <th className="py-3 px-4">Destination & Specialty</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {stats?.recentEnquiries && stats.recentEnquiries.length > 0 ? (
                  stats.recentEnquiries.map((enq: Enquiry) => (
                    <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block">
                          {enq.reference_no}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(enq.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="block text-slate-900 font-medium">
                          {enq.full_name}
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          {enq.phone_whatsapp}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="block font-medium text-slate-800">
                          {enq.treatment_specialty || 'General Coordination'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {enq.preferred_destination || 'Not Specified'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                            enq.status
                          )}`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate(`/admin/enquiries?id=${enq.id}`)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#075985] bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No patient enquiries recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Activity Stream */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold font-serif text-slate-900">
                  Operations Activity Audit
                </h3>
                <p className="text-[11px] text-slate-400">Real-time system events</p>
              </div>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-4 text-xs">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.slice(0, 6).map((act: ActivityLog) => (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#075985] mt-1.5 shrink-0"></div>
                    <div>
                      <strong className="block text-slate-800 font-semibold text-[11px]">
                        {act.action}
                      </strong>
                      <p className="text-slate-500 text-[11px] leading-snug">
                        {act.details}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {act.user_name || 'System'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 py-4 text-center">No recent activity recorded.</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => navigate('/admin/users')}
              className="w-full py-2 text-center text-xs font-semibold text-[#075985] hover:bg-sky-50 rounded-lg transition-colors"
            >
              View Full Audit Log & Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
