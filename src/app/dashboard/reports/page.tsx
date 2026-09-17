'use client';
import { BarChart3, TrendingUp, Users, FileText, Building2, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { mockSubmissions, mockRequirements, mockVendors } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const vendorPerf = [
  { name: 'TechStaff Solutions', submissions: 41, approved: 8, rate: 19.5 },
  { name: 'Apex Talent Hub', submissions: 33, approved: 5, rate: 15.2 },
  { name: 'Vortex Soft Innovations', submissions: 24, approved: 3, rate: 12.5 },
  { name: 'Nexus Recruit', submissions: 19, approved: 4, rate: 21.0 },
  { name: 'Global Staffing India', submissions: 8, approved: 1, rate: 12.5 },
];

const funnelData = [
  { stage: 'Submitted', count: 8, color: 'bg-blue-500' },
  { stage: 'Screening Scheduled', count: 2, color: 'bg-amber-500' },
  { stage: 'Interview Scheduled', count: 1, color: 'bg-purple-500' },
  { stage: 'Offer Extended', count: 1, color: 'bg-teal-500' },
  { stage: 'Approved', count: 1, color: 'bg-emerald-500' },
];
const funnelMax = funnelData[0].count;

const reqTypeData = [
  { type: 'Remote', count: 187, pct: 79 },
  { type: 'Onsite', count: 14, pct: 6 },
  { type: 'Hybrid', count: 35, pct: 15 },
];

export default function ReportsPage() {
  const totalSubs = mockSubmissions.length;
  const approved = mockSubmissions.filter(s => ['approved', 'offer_offered'].includes(s.status)).length;
  const rejected = mockSubmissions.filter(s => s.status === 'rejected').length;
  const successRate = Math.round((approved / totalSubs) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Reports & Analytics</h2>
        <p className="text-slate-400 text-sm">Platform performance and hiring insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Submissions" value={totalSubs} icon={FileText} iconColor="text-blue-400" trend="+12% this month" trendUp />
        <MetricCard title="Approved / Offers" value={approved} icon={Award} iconColor="text-emerald-400" trend="+3 this month" trendUp />
        <MetricCard title="Rejection Rate" value={`${Math.round((rejected / totalSubs) * 100)}%`} icon={TrendingUp} iconColor="text-red-400" trend="-2% vs last month" trendUp />
        <MetricCard title="Success Rate" value={`${successRate}%`} icon={BarChart3} iconColor="text-purple-400" trend="+5% this month" trendUp />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Submission Funnel */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-5">Submission Pipeline Funnel</h3>
          <div className="space-y-3">
            {funnelData.map((item) => (
              <div key={item.stage}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-300">{item.stage}</span>
                  <span className="font-semibold text-white">{item.count}</span>
                </div>
                <div className="h-7 bg-white/[0.05] rounded-lg overflow-hidden">
                  <div
                    className={cn('h-full rounded-lg transition-all duration-700 flex items-center px-3', item.color)}
                    style={{ width: `${(item.count / funnelMax) * 100}%`, opacity: 0.8 }}
                  >
                    <span className="text-white text-xs font-bold">{Math.round((item.count / funnelMax) * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Performance */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-5">Vendor Performance Leaderboard</h3>
          <div className="space-y-3">
            {vendorPerf.map((v, i) => (
              <div key={v.name} className="flex items-center gap-3">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold', i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-slate-400/20 text-slate-300' : 'bg-orange-500/10 text-orange-400')}>
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-300 font-medium">{v.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{v.submissions} subs</span>
                      <span className={cn('font-semibold', v.rate > 15 ? 'text-emerald-400' : 'text-amber-400')}>{v.rate}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${(v.submissions / 50) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements by type */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-5">Requirements by Job Type</h3>
          <div className="space-y-4">
            {reqTypeData.map((item) => (
              <div key={item.type}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-300">{item.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{item.count}</span>
                    <span className="font-semibold text-white">{item.pct}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all duration-700', item.type === 'Remote' ? 'bg-blue-500' : item.type === 'Onsite' ? 'bg-purple-500' : 'bg-teal-500')} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time-to-fill estimate */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-5">Key Metrics Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Avg. Time to Fill', value: '23 days', trend: '-2 days', up: true },
              { label: 'Active Requirements', value: mockRequirements.filter(r => r.status === 'open').length, trend: '+2 this week', up: true },
              { label: 'Vendors Active', value: mockVendors.filter(v => v.isActive).length, trend: 'Stable', up: true },
              { label: 'Screening Pass Rate', value: '42%', trend: '+5% vs last month', up: true },
              { label: 'Offer Acceptance', value: '80%', trend: '+10%', up: true },
              { label: 'Rejection Rate', value: `${Math.round((rejected / totalSubs) * 100)}%`, trend: '-2%', up: true },
            ].map((m) => (
              <div key={m.label} className="glass rounded-xl p-3">
                <p className="text-xs text-slate-400">{m.label}</p>
                <p className="text-xl font-bold text-white mt-0.5">{m.value}</p>
                <p className={cn('text-xs mt-0.5 flex items-center gap-1', m.up ? 'text-emerald-400' : 'text-red-400')}>
                  {m.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{m.trend}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
