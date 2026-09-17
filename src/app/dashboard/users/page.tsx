'use client';
import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, KeyRound, X, UserCog } from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { User, UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { MetricCard } from '@/components/ui/metric-card';
import { Users, Shield, Building2 } from 'lucide-react';

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  hr: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  vendor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
};

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'hr' as UserRole, password: '' });
  const [saved, setSaved] = useState(false);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const admins = users.filter(u => u.role === 'admin').length;
  const hrs = users.filter(u => u.role === 'hr').length;
  const vendors = users.filter(u => u.role === 'vendor').length;

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    const newUser: User = {
      id: `u${Date.now()}`, username: form.email.split('@')[0], isActive: true,
      createdAt: new Date().toISOString().slice(0, 10), name: form.name, email: form.email, role: form.role
    };
    setUsers(prev => [newUser, ...prev]);
    setSaved(true);
    setTimeout(() => { setCreateOpen(false); setSaved(false); setForm({ name: '', email: '', role: 'hr', password: '' }); }, 1500);
  };

  const toggleActive = (id: string) => setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">User Management</h2>
          <p className="text-slate-400 text-sm">Manage all platform users and their roles</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn btn-primary"><Plus size={16} /> Add User</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Admins" value={admins} icon={Shield} iconColor="text-purple-400" />
        <MetricCard title="HR Team" value={hrs} icon={Users} iconColor="text-blue-400" />
        <MetricCard title="Vendors" value={vendors} icon={Building2} iconColor="text-emerald-400" />
      </div>

      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" placeholder="Search users by name or email..." />
        </div>
        <div className="flex gap-2">
          {(['all', 'admin', 'hr', 'vendor'] as const).map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} className={cn('btn text-sm capitalize', roleFilter === r ? 'btn-primary' : 'btn-ghost')}>
              {r === 'all' ? 'All' : r}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.07]">
          <h3 className="font-semibold text-white">Users <span className="text-slate-400 font-normal text-sm">({filtered.length})</span></h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Username</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-white text-xs font-bold">
                        {u.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                      </div>
                      <span className="font-medium text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-slate-300 text-sm">{u.email}</td>
                  <td className="text-slate-400 text-sm">@{u.username}</td>
                  <td><span className={cn('badge border', ROLE_COLORS[u.role])}>{u.role}</span></td>
                  <td><span className={cn('badge', u.isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/15 text-slate-400 border border-slate-500/20')}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="text-slate-400 text-sm">{u.lastLoginAt ? formatDate(u.lastLoginAt) : '—'}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center text-amber-400" title="Edit"><Pencil size={13} /></button>
                      <button className="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400" title="Reset Password"><KeyRound size={13} /></button>
                      <button onClick={() => toggleActive(u.id)} className={cn('btn text-xs py-1 px-2', u.isActive ? 'btn-danger' : 'btn-ghost')}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {createOpen && (
        <div className="modal-overlay" onClick={() => setCreateOpen(false)}>
          <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
            {saved ? (
              <div className="p-8 text-center"><div className="text-4xl mb-4">✅</div><h3 className="text-lg font-bold text-white">User Created!</h3><p className="text-slate-400 text-sm mt-2">A welcome email has been sent.</p></div>
            ) : (
              <>
                <div className="p-6 border-b border-white/[0.07] flex items-center justify-between">
                  <h3 className="font-bold text-white">Add New User</h3>
                  <button onClick={() => setCreateOpen(false)}><X size={18} className="text-slate-400 hover:text-white" /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div><label className="block text-sm text-slate-300 mb-1.5">Full Name</label><input className="input" placeholder="e.g. Rajesh Kumar" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                  <div><label className="block text-sm text-slate-300 mb-1.5">Email</label><input className="input" type="email" placeholder="user@mindcrew.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                  <div><label className="block text-sm text-slate-300 mb-1.5">Role</label>
                    <select className="input" value={form.role} onChange={e => setForm({...form, role: e.target.value as UserRole})}>
                      <option value="admin">Admin</option>
                      <option value="hr">HR</option>
                      <option value="vendor">Vendor</option>
                    </select>
                  </div>
                  <div><label className="block text-sm text-slate-300 mb-1.5">Temporary Password</label><input className="input" type="password" placeholder="Set initial password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-blue-500" />
                    <span className="text-sm text-slate-300">Send welcome email with credentials</span>
                  </label>
                </div>
                <div className="p-6 pt-0 flex gap-3">
                  <button onClick={() => setCreateOpen(false)} className="btn btn-ghost flex-1 justify-center">Cancel</button>
                  <button onClick={handleSave} className="btn btn-primary flex-1 justify-center"><Plus size={15} /> Create User</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
