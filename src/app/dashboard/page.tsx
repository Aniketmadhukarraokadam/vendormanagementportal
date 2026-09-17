'use client';
import { useEffect, useState } from 'react';
import { Briefcase, FileText, Users, Building2, CheckCircle2, TrendingUp, ArrowRight, Clock, Video, AlertCircle } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { SubmissionStatusBadge, RequirementStatusBadge } from '@/components/ui/badge';
import { mockSubmissions, mockRequirements, mockVendors, mockUsers } from '@/lib/mock-data';
import { formatDate, formatDateTime } from '@/lib/utils';
import { User } from '@/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminHRDashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('hirehub_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const openReqs = mockRequirements.filter(r => r.status === 'open').length;
  const totalSubs = mockSubmissions.length;
  const screeningToday = mockSubmissions.filter(s => s.status === 'screening_scheduled').length;
  const interviewScheduled = mockSubmissions.filter(s => s.status === 'interview_scheduled').length;
  const offers = mockSubmissions.filter(s => s.status === 'offer_offered').length;
  const approved = mockSubmissions.filter(s => s.status === 'approved').length;
  const vendors = mockVendors.filter(v => v.isActive).length;
  const totalUsers = mockUsers.length;

  const recentSubs = mockSubmissions.slice(0, 8);
  const recentReqs = mockRequirements.slice(0, 5);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="glass-strong rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.07) 100%)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Team'}! 👋
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <span className={cn('badge text-sm px-3 py-1', user?.role === 'admin' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20')}>
            {user?.role === 'admin' ? 'Administrator' : 'HR Team'}
          </span>
        </div>

        {screeningToday > 0 && (
          <div className="mt-4 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
            <AlertCircle size={16} className="text-amber-400" />
            <span className="text-sm text-amber-300">{screeningToday} screening{screeningToday > 1 ? 's' : ''} scheduled and pending confirmation</span>
          </div>
        )}
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Open Requirements" value={openReqs} icon={Briefcase} iconColor="text-emerald-400" trend="+2 this week" trendUp />
        <MetricCard title="Total Submissions" value={totalSubs} icon={FileText} iconColor="text-blue-400" trend="+5 today" trendUp />
        <MetricCard title="Screenings Pending" value={screeningToday} icon={Clock} iconColor="text-amber-400" />
        <MetricCard title="Offers Extended" value={offers + approved} icon={CheckCircle2} iconColor="text-purple-400" trend="+1 this week" trendUp />
      </div>

      {isAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Active Vendors" value={vendors} icon={Building2} iconColor="text-teal-400" />
          <MetricCard title="Total Users" value={totalUsers} icon={Users} iconColor="text-orange-400" />
          <MetricCard title="Interview Scheduled" value={interviewScheduled} icon={Video} iconColor="text-rose-400" />
          <MetricCard title="Success Rate" value="34%" icon={TrendingUp} iconColor="text-emerald-400" trend="+5% this month" trendUp />
        </div>
      )}

      {/* Bottom grid: submissions + requirements */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <div className="xl:col-span-2 glass rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.07] flex items-center justify-between">
            <h3 className="font-semibold text-white">Recent Submissions</h3>
            <Link href="/dashboard/submissions" className="btn btn-ghost text-sm">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Requirement</th>
                  <th>Vendor</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSubs.map(sub => (
                  <tr key={sub.id}>
                    <td className="text-white font-medium">{sub.candidateName}</td>
                    <td className="text-slate-300 text-sm max-w-[160px] truncate">{sub.requirementTitle}</td>
                    <td className="text-slate-400 text-sm">{sub.vendorName}</td>
                    <td><SubmissionStatusBadge status={sub.status} /></td>
                    <td className="text-slate-400 text-sm">{formatDate(sub.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Open Requirements */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.07] flex items-center justify-between">
            <h3 className="font-semibold text-white">Requirements</h3>
            <Link href="/dashboard/requirements" className="btn btn-ghost text-sm">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="p-3 space-y-2">
            {recentReqs.map(req => (
              <div key={req.id} className="glass rounded-xl p-3 hover:bg-white/[0.04] transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-sm font-medium text-white leading-tight">{req.title}</p>
                  <RequirementStatusBadge status={req.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{req.jobType}</span>
                  <span>•</span>
                  <span>{req.totalSubmissions} submissions</span>
                  <span>•</span>
                  <span>{req.minExperience}+ yrs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
