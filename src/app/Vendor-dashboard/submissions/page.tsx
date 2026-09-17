'use client';
import { useState, useEffect } from 'react';
import { Search, Users, RefreshCw, Video, Eye, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { SubmissionStatusBadge } from '@/components/ui/badge';
import { mockSubmissions, mockRequirements } from '@/lib/mock-data';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Submission, SubmissionStatus } from '@/types';
import { FileText, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS: { value: SubmissionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'screening_scheduled', label: 'Screening Scheduled' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'offer_offered', label: 'Offer Extended' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function SubmissionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [reuseOpen, setReuseOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [reuseSuccess, setReuseSuccess] = useState(false);
  const [vendorId, setVendorId] = useState('v1');

  useEffect(() => {
    const stored = localStorage.getItem('hirehub_user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u.vendorId) setVendorId(u.vendorId);
    }
  }, []);

  const allSubs = mockSubmissions.filter(s => s.vendorId === vendorId);

  const filtered = allSubs.filter(s => {
    const matchSearch = s.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      s.requirementTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalSubs = allSubs.length;
  const screeningApproved = allSubs.filter(s => ['approved', 'offer_offered'].includes(s.status)).length;
  const screeningScheduled = allSubs.filter(s => s.status === 'screening_scheduled').length;

  const uniqueCandidates = [...new Map(allSubs.map(s => [s.candidateName, s])).values()];

  const handleReuse = async () => {
    await new Promise(r => setTimeout(r, 600));
    setReuseSuccess(true);
    setTimeout(() => { setReuseOpen(false); setReuseSuccess(false); setSelectedReq(''); setSelectedCandidate(''); }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Total Submissions" value={totalSubs} icon={FileText} iconColor="text-blue-400" />
        <MetricCard title="Screening Scheduled" value={screeningScheduled} icon={CheckCircle2} iconColor="text-amber-400" />
        <MetricCard title="Approved / Offers" value={screeningApproved} icon={XCircle} iconColor="text-emerald-400" />
      </div>

      {/* Controls */}
      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" placeholder="Search by candidate or requirement..." />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as SubmissionStatus | 'all')} className="input w-auto min-w-[180px]">
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button onClick={() => setReuseOpen(true)} className="btn btn-primary flex-shrink-0 whitespace-nowrap">
          <RefreshCw size={15} /> My Team — Reuse Candidate
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.07]">
          <h3 className="font-semibold text-white">Submissions <span className="text-slate-400 font-normal text-sm">({filtered.length})</span></h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Requirement</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Meeting Link</th>
                <th>Scheduled At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sub => (
                <tr key={sub.id}>
                  <td>
                    <div className="font-medium text-white">{sub.candidateName}</div>
                    <div className="text-xs text-slate-500">{sub.candidateEmail}</div>
                  </td>
                  <td className="text-slate-300 max-w-[200px] truncate">{sub.requirementTitle}</td>
                  <td className="text-slate-300">{sub.totalExperience} yrs total<br /><span className="text-xs text-slate-500">{sub.relevantExperience} yrs relevant</span></td>
                  <td><SubmissionStatusBadge status={sub.status} /></td>
                  <td>
                    {sub.meetingLink ? (
                      <a href={sub.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 text-xs hover:text-blue-300 transition-colors">
                        <Video size={13} /> Join Meet
                      </a>
                    ) : <span className="text-slate-500 text-sm">—</span>}
                  </td>
                  <td className="text-slate-400 text-sm">
                    {sub.scheduledAt ? formatDateTime(sub.scheduledAt) : '—'}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400 transition-colors" title="View"><Eye size={13} /></button>
                      <button className="w-7 h-7 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center text-amber-400 transition-colors" title="Edit"><Pencil size={13} /></button>
                      <button className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors" title="Delete"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-slate-500">No submissions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reuse Modal */}
      {reuseOpen && (
        <div className="modal-overlay" onClick={() => setReuseOpen(false)}>
          <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
            {reuseSuccess ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-bold text-white mb-2">Candidate Reused!</h3>
                <p className="text-slate-400 text-sm">Submission created for the new requirement.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-white/[0.07] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">My Team — Reuse a Candidate</h3>
                    <p className="text-sm text-slate-400">Submit an existing candidate to a new requirement</p>
                  </div>
                  <button onClick={() => setReuseOpen(false)} className="text-slate-400 hover:text-white p-1"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Select Requirement</label>
                    <select className="input" value={selectedReq} onChange={e => setSelectedReq(e.target.value)}>
                      <option value="">— Choose a requirement —</option>
                      {mockRequirements.filter(r => r.status === 'open').map(r => (
                        <option key={r.id} value={r.id}>{r.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Select from My Team</label>
                    <div className="space-y-2">
                      {uniqueCandidates.map(c => (
                        <button key={c.candidateName} onClick={() => setSelectedCandidate(c.candidateName)}
                          className={cn('w-full glass rounded-xl p-3 text-left transition-all', selectedCandidate === c.candidateName ? 'border-blue-500 border bg-blue-500/10' : 'hover:bg-white/[0.04]')}>
                          <div className="font-medium text-white text-sm">{c.candidateName}</div>
                          <div className="text-xs text-slate-400">{c.candidateEmail} • {c.totalExperience} yrs exp</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0 flex gap-3">
                  <button onClick={() => setReuseOpen(false)} className="btn btn-ghost flex-1 justify-center">Cancel</button>
                  <button onClick={handleReuse} disabled={!selectedReq || !selectedCandidate} className="btn btn-primary flex-1 justify-center">Confirm Reuse</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
