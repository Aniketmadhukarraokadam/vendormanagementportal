'use client';
import { useState } from 'react';
import { Search, Video, Check, X, ChevronDown, Eye } from 'lucide-react';
import { SubmissionStatusBadge } from '@/components/ui/badge';
import { mockSubmissions, mockRequirements, mockVendors } from '@/lib/mock-data';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Submission, SubmissionStatus } from '@/types';
import { cn } from '@/lib/utils';
import { MetricCard } from '@/components/ui/metric-card';
import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function DashboardSubmissionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [reqFilter, setReqFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [subs, setSubs] = useState(mockSubmissions);
  const [viewSub, setViewSub] = useState<Submission | null>(null);

  const filtered = subs.filter(s => {
    const matchSearch = s.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      s.requirementTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.vendorName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchReq = reqFilter === 'all' || s.requirementId === reqFilter;
    const matchVendor = vendorFilter === 'all' || s.vendorId === vendorFilter;
    return matchSearch && matchStatus && matchReq && matchVendor;
  });

  const updateStatus = (id: string, status: SubmissionStatus) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    setViewSub(null);
  };

  const total = subs.length;
  const pending = subs.filter(s => s.status === 'submitted').length;
  const screening = subs.filter(s => s.status === 'screening_scheduled').length;
  const approved = subs.filter(s => ['approved', 'offer_offered'].includes(s.status)).length;
  const rejected = subs.filter(s => s.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">All Submissions</h2>
        <p className="text-slate-400 text-sm">Manage candidate submissions from all vendors</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard title="Total" value={total} icon={FileText} iconColor="text-blue-400" />
        <MetricCard title="Pending Review" value={pending} icon={Clock} iconColor="text-amber-400" />
        <MetricCard title="Screening" value={screening} icon={Video} iconColor="text-purple-400" />
        <MetricCard title="Approved" value={approved} icon={CheckCircle2} iconColor="text-emerald-400" />
        <MetricCard title="Rejected" value={rejected} icon={XCircle} iconColor="text-red-400" />
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" placeholder="Search candidates, requirements, vendors..." />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as SubmissionStatus | 'all')} className="input w-auto min-w-[180px]">
          <option value="all">All Status</option>
          {(['submitted','screening_scheduled','screening_done','interview_scheduled','offer_offered','approved','rejected'] as SubmissionStatus[]).map(s => (
            <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
          ))}
        </select>
        <select value={reqFilter} onChange={e => setReqFilter(e.target.value)} className="input w-auto min-w-[180px]">
          <option value="all">All Requirements</option>
          {mockRequirements.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
        </select>
        <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)} className="input w-auto min-w-[160px]">
          <option value="all">All Vendors</option>
          {mockVendors.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.07]">
          <h3 className="font-semibold text-white">Submissions <span className="text-slate-400 font-normal text-sm">({filtered.length})</span></h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Candidate</th><th>Requirement</th><th>Vendor</th><th>Experience</th><th>Status</th><th>Meeting</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(sub => (
                <tr key={sub.id}>
                  <td>
                    <div className="font-medium text-white">{sub.candidateName}</div>
                    <div className="text-xs text-slate-500">{sub.candidateEmail}</div>
                  </td>
                  <td className="text-slate-300 text-sm max-w-[160px] truncate">{sub.requirementTitle}</td>
                  <td className="text-slate-400 text-sm">{sub.vendorName}</td>
                  <td className="text-slate-300 text-sm">{sub.totalExperience}y / {sub.relevantExperience}y rel</td>
                  <td><SubmissionStatusBadge status={sub.status} /></td>
                  <td>
                    {sub.meetingLink
                      ? <a href={sub.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 text-xs hover:text-blue-300"><Video size={12} /> Meet</a>
                      : <span className="text-slate-500 text-xs">—</span>}
                  </td>
                  <td className="text-slate-400 text-sm">{formatDate(sub.createdAt)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewSub(sub)} className="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400 transition-colors"><Eye size={13} /></button>
                      {sub.status === 'submitted' && <>
                        <button onClick={() => updateStatus(sub.id, 'screening_scheduled')} className="w-7 h-7 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 transition-colors" title="Approve for Screening"><Check size={13} /></button>
                        <button onClick={() => updateStatus(sub.id, 'rejected')} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors" title="Reject"><X size={13} /></button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-slate-500">No submissions match the filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Submission Modal */}
      {viewSub && (
        <div className="modal-overlay" onClick={() => setViewSub(null)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/[0.07] flex items-center justify-between">
              <h3 className="font-bold text-white">Submission Details</h3>
              <button onClick={() => setViewSub(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white">{viewSub.candidateName}</h4>
                  <p className="text-sm text-slate-400">{viewSub.candidateEmail} • {viewSub.candidatePhone}</p>
                </div>
                <SubmissionStatusBadge status={viewSub.status} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['Requirement', viewSub.requirementTitle], ['Vendor', viewSub.vendorName], ['Total Experience', `${viewSub.totalExperience} years`], ['Relevant Exp', `${viewSub.relevantExperience} years`], ['JD Comfortable', viewSub.jdComfortable ? 'Yes ✅' : 'No ❌'], ['CV', viewSub.cvFilename || '—'], ['Submitted', formatDate(viewSub.createdAt)], ['Meeting', viewSub.meetingLink ? 'Scheduled' : 'Not yet']].map(([k, v]) => (
                  <div key={k} className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-400">{k}</p>
                    <p className="text-white font-medium mt-0.5 text-sm truncate">{v}</p>
                  </div>
                ))}
              </div>
              {viewSub.status === 'submitted' && (
                <div className="flex gap-3">
                  <button onClick={() => updateStatus(viewSub.id, 'screening_scheduled')} className="btn btn-primary flex-1 justify-center"><Check size={15} /> Approve Screening</button>
                  <button onClick={() => updateStatus(viewSub.id, 'rejected')} className="btn btn-danger flex-1 justify-center"><X size={15} /> Reject</button>
                </div>
              )}
              {viewSub.status === 'screening_scheduled' && (
                <div className="flex gap-3">
                  <button onClick={() => updateStatus(viewSub.id, 'interview_scheduled')} className="btn btn-primary flex-1 justify-center"><Check size={15} /> Move to Interview</button>
                  <button onClick={() => updateStatus(viewSub.id, 'rejected')} className="btn btn-danger flex-1 justify-center"><X size={15} /> Reject</button>
                </div>
              )}
              {viewSub.status === 'interview_scheduled' && (
                <div className="flex gap-3">
                  <button onClick={() => updateStatus(viewSub.id, 'offer_offered')} className="btn btn-primary flex-1 justify-center">🎉 Extend Offer</button>
                  <button onClick={() => updateStatus(viewSub.id, 'rejected')} className="btn btn-danger flex-1 justify-center"><X size={15} /> Reject</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
