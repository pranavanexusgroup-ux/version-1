import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { User, ActivityLog } from '../../types';
import { Users, Shield, Clock, ShieldCheck } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsersAndLogs() {
      try {
        setLoading(true);
        const [uList, lList] = await Promise.all([
          api.getAdminUsers(),
          api.getAdminActivityLogs()
        ]);
        setUsers(uList);
        setLogs(lList);
      } catch (err) {
        console.error('Failed to load users or activity logs', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsersAndLogs();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono font-bold text-[#075985] uppercase tracking-wider">
          Access Control & Audit Trail
        </span>
        <h1 className="text-2xl font-bold font-serif text-slate-900 mt-0.5">
          Staff Accounts & System Activity Logs
        </h1>
        <p className="text-xs text-slate-500">
          Role-based permissions and complete non-repudiation audit logging of all administrative actions.
        </p>
      </div>

      {/* Staff Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#075985]" />
            <h2 className="text-base font-bold font-serif text-slate-900">
              Staff & Coordinator Accounts
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {users.length} Registered Accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Role Permission</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {u.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {u.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#075985] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 uppercase">
                      <Shield className="w-3 h-3" />
                      {u.role_code || 'SUPER_ADMIN'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Recent Session'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#075985]" />
            <h2 className="text-base font-bold font-serif text-slate-900">
              System Activity Audit Trail
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Immutable operation logs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Audit Details</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                    {log.user_name || 'System Admin'}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#075985]">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600 max-w-md truncate">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {log.ip_address || '127.0.0.1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
