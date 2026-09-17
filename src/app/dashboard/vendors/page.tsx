'use client';
import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, X, Building2, Mail, Phone, MapPin } from 'lucide-react';
import { mockVendors } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Vendor } from '@/types';
import { cn } from '@/lib/utils';
import { MetricCard } from '@/components/ui/metric-card';
import { Users, CheckCircle2 } from 'lucide-react';

export default function VendorsPage() {
  const [vendors, setVendors] = useState(mockVendors);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null);
  const [form, setForm] = useState({ companyName: '', contactPerson: '', email: '', phone: '', address: '' });
  const [saved, setSaved] = useState(false);

  const filtered = vendors.filter(v =>
    v.companyName.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase()) ||
    v.contactPerson.toLowerCase().includes(search.toLowerCase())
  );

  const activeVendors = vendors.filter(v => v.isActive).length;
  const totalSubs = vendors.reduce((acc, v) => acc + v.totalSubmissions, 0);

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    const newVendor: Vendor = {
      id: `v${Date.now()}`, isActive: true, totalSubmissions: 0, createdAt: new Date().toISOString().slice(0, 10), ...form
    };
    setVendors(prev => [newVendor, ...prev]);
    setSaved(true);
    setTimeout(() => { setCreateOpen(false); setSaved(false); setForm({ companyName: '', contactPerson: '', email: '', phone: '', address: '' }); }, 1500);
  };

  const toggleActive = (id: string) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, isActive: !v.isActive } : v));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Vendor Management</h2>
          <p className="text-slate-400 text-sm">Manage all vendor companies and their access</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn btn-primary"><Plus size={16} /> Add Vendor</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Active Vendors" value={activeVendors} icon={Building2} iconColor="text-teal-400" />
        <MetricCard title="Total Vendors" value={vendors.length} icon={Users} iconColor="text-blue-400" />
        <MetricCard title="Total Submissions" value={totalSubs} icon={CheckCircle2} iconColor="text-purple-400" />
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" placeholder="Search vendors..." />
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.07]">
          <h3 className="font-semibold text-white">Vendors <span className="text-slate-400 font-normal text-sm">({filtered.length})</span></h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Company</th><th>Contact Person</th><th>Email</th><th>Submissions</th><th>Since</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/30 to-blue-500/30 flex items-center justify-center text-teal-400 font-bold text-sm">
                        {v.companyName[0]}
                      </div>
                      <div className="font-medium text-white">{v.companyName}</div>
                    </div>
                  </td>
                  <td className="text-slate-300">{v.contactPerson}</td>
                  <td className="text-slate-400 text-sm">{v.email}</td>
                  <td><span className="font-semibold text-white">{v.totalSubmissions}</span></td>
                  <td className="text-slate-400 text-sm">{formatDate(v.createdAt)}</td>
                  <td>
                    <span className={cn('badge', v.isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/15 text-slate-400 border border-slate-500/20')}>
                      {v.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setViewVendor(v)} className="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400"><Eye size={13} /></button>
                      <button className="w-7 h-7 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center text-amber-400"><Pencil size={13} /></button>
                      <button onClick={() => toggleActive(v.id)} className={cn('btn text-xs py-1 px-2', v.isActive ? 'btn-danger' : 'btn-ghost')}>
                        {v.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Vendor Modal */}
      {createOpen && (
        <div className="modal-overlay" onClick={() => setCreateOpen(false)}>
          <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
            {saved ? (
              <div className="p-8 text-center"><div className="text-4xl mb-4">✅</div><h3 className="text-lg font-bold text-white">Vendor Added!</h3></div>
            ) : (
              <>
                <div className="p-6 border-b border-white/[0.07] flex items-center justify-between">
                  <h3 className="font-bold text-white">Add New Vendor</h3>
                  <button onClick={() => setCreateOpen(false)}><X size={18} className="text-slate-400 hover:text-white" /></button>
                </div>
                <div className="p-6 space-y-3">
                  {[['companyName', 'Company Name', 'e.g. TechStaff Solutions'], ['contactPerson', 'Contact Person', 'Full name'], ['email', 'Email', 'company@example.com'], ['phone', 'Phone', '+91 XXXXX XXXXX'], ['address', 'Address', 'City, State']].map(([key, label, placeholder]) => (
                    <div key={key}><label className="block text-sm text-slate-300 mb-1.5">{label}</label>
                      <input className="input" placeholder={placeholder} value={(form as any)[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} /></div>
                  ))}
                </div>
                <div className="p-6 pt-0 flex gap-3">
                  <button onClick={() => setCreateOpen(false)} className="btn btn-ghost flex-1 justify-center">Cancel</button>
                  <button onClick={handleSave} className="btn btn-primary flex-1 justify-center"><Plus size={15} /> Add Vendor</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* View Vendor Modal */}
      {viewVendor && (
        <div className="modal-overlay" onClick={() => setViewVendor(null)}>
          <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/[0.07] flex items-center justify-between">
              <h3 className="font-bold text-white">Vendor Details</h3>
              <button onClick={() => setViewVendor(null)}><X size={18} className="text-slate-400 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/30 to-blue-500/30 flex items-center justify-center text-teal-400 font-bold text-2xl">
                  {viewVendor.companyName[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{viewVendor.companyName}</h4>
                  <span className={cn('badge text-xs', viewVendor.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400')}>{viewVendor.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="space-y-2">
                {[[<Users size={14} />, viewVendor.contactPerson], [<Mail size={14} />, viewVendor.email], [<Phone size={14} />, viewVendor.phone || '—'], [<MapPin size={14} />, viewVendor.address || '—']].map(([icon, val], i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                    <span className="text-slate-500">{icon as React.ReactNode}</span> {val as string}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="glass rounded-xl p-3 text-center"><p className="text-2xl font-bold text-white">{viewVendor.totalSubmissions}</p><p className="text-xs text-slate-400">Total Submissions</p></div>
                <div className="glass rounded-xl p-3 text-center"><p className="text-sm font-bold text-white">{formatDate(viewVendor.createdAt)}</p><p className="text-xs text-slate-400">Active Since</p></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
