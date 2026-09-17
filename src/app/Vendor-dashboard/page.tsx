'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, CheckCircle2, Briefcase, Clock, ArrowRight, User } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { SubmissionStatusBadge } from '@/components/ui/badge';
import { mockSubmissions } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Submission, User as UserType } from '@/types';

export default function VendorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('hirehub_user');
    if (stored) {
      const u: UserType = JSON.parse(stored);
      setUser(u);
      const vendorSubs = mockSubmissions.filter(s => s.vendorId === u.vendorId).slice(0, 5);
      setSubmissions(vendorSubs);
    }
  }, []);

  const totalSubs = mockSubmissions.filter(s => s.vendorId === user?.vendorId).length;
  const approved = mockSubmissions.filter(s => s.vendorId === user?.vendorId && (s.status === 'approved' || s.status === 'offer_offered')).length;
  const successRate = totalSubs > 0 ? Math.round((approved / totalSubs) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="glass-strong rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.08) 100%)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Welcome back, {user?.name?.split(' ')[0] || 'Vendor'}! 👋
            </h2>
            <p className="text-slate-400 text-sm">Manage your submissions and find new opportunities</p>
          </div>
          <Link href="/Vendor-dashboard/browse-requirements" className="btn btn-primary flex-shrink-0">
            Browse Requirements <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Submissions"
          value={totalSubs}
          subtitle="+0 this week"
          icon={FileText}
          iconColor="text-blue-400"
          trend="+0%"
          trendUp
        />
        <MetricCard
          title="Screening Approved"
          value={approved}
          subtitle={`Success rate: ${successRate}%`}
          icon={CheckCircle2}
          iconColor="text-emerald-400"
        />
        <MetricCard
          title="Available Requirements"
          value={236}
          subtitle="Browse Now →"
          icon={Briefcase}
          iconColor="text-purple-400"
          onClick={() => router.push('/Vendor-dashboard/browse-requirements')}
        />
      </div>

      {/* Recent Submissions */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.07] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Recent Submissions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Your latest candidate submissions</p>
          </div>
          <Link href="/Vendor-dashboard/submissions" className="btn btn-ghost text-sm">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Requirement</th>
                <th>Status</th>
                <th>Date</th>
                <th>Meeting</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    <User size={40} className="mx-auto mb-2 opacity-30" />
                    <p>No submissions yet. Start by browsing requirements.</p>
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td className="text-white font-medium">{sub.candidateName}</td>
                    <td className="text-slate-300">{sub.requirementTitle}</td>
                    <td><SubmissionStatusBadge status={sub.status} /></td>
                    <td className="text-slate-400 text-sm">{formatDate(sub.createdAt)}</td>
                    <td>
                      {sub.meetingLink ? (
                        <a href={sub.meetingLink} target="_blank" rel="noreferrer" className="text-blue-400 text-xs hover:text-blue-300 underline">
                          Join Meet
                        </a>
                      ) : (
                        <span className="text-slate-500 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/Vendor-dashboard/browse-requirements" className="glass rounded-2xl p-5 hover:bg-white/[0.04] transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
            <Briefcase size={22} className="text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Browse Requirements</p>
            <p className="text-sm text-slate-400">Find new opportunities to submit candidates</p>
          </div>
          <ArrowRight size={18} className="ml-auto text-slate-500 group-hover:text-blue-400 transition-colors" />
        </Link>
        <Link href="/Vendor-dashboard/submissions" className="glass rounded-2xl p-5 hover:bg-white/[0.04] transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
            <Clock size={22} className="text-purple-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Track Submissions</p>
            <p className="text-sm text-slate-400">Monitor your candidates through the pipeline</p>
          </div>
          <ArrowRight size={18} className="ml-auto text-slate-500 group-hover:text-purple-400 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
