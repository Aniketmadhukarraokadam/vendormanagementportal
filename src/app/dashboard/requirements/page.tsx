'use client';
import { useState } from 'react';
import { Plus, Search, Eye, Pencil, Trash2, X, MapPin } from 'lucide-react';
import { RequirementStatusBadge, JobTypeBadge } from '@/components/ui/badge';
import { mockRequirements } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Requirement, JobType, RequirementStatus } from '@/types';
import { cn } from '@/lib/utils';

const EMPTY_REQ: Partial<Requirement> = {
  title: '', description: '', jobType: 'remote', location: '', minExperience: 0,
  targetClosureDate: '', budget: '', mandatorySkills: [], primarySkills: [], secondarySkills: [], status: 'open'
};

export default function RequirementsPage() {
  const [reqs, setReqs] = useState(mockRequirements);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequirementStatus | 'all'>('all');
  const [createModal, setCreateModal] = useState(false);
  const [viewReq, setViewReq] = useState<Requirement | null>(null);
  const [form, setForm] = useState<Partial<Requirement>>(EMPTY_REQ);
  const [skillInput, setSkillInput] = useState({ mandatory: '', primary: '', secondary: '' });
  const [saved, setSaved] = useState(false);

  const filtered = reqs.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const addSkill = (type: 'mandatory' | 'primary' | 'secondary') => {
    const val = skillInput[type].trim();
    if (!val) return;
    const key = type === 'mandatory' ? 'mandatorySkills' : type === 'primary' ? 'primarySkills' : 'secondarySkills';
    setForm(prev => ({ ...prev, [key]: [...(prev[key] as string[] || []), val] }));
    setSkillInput(prev => ({ ...prev, [type]: '' }));
  };

  const removeSkill = (type: 'mandatorySkills' | 'primarySkills' | 'secondarySkills', skill: string) => {
    setForm(prev => ({ ...prev, [type]: (prev[type] as string[]).filter(s => s !== skill) }));
  };

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    const newReq: Requirement = {
      id: `r${Date.now()}`, totalSubmissions: 0, createdBy: 'u2', postedDate: new Date().toISOString().slice(0, 10),
      ...form,
    } as Requirement;
    setReqs(prev => [newReq, ...prev]);
    setSaved(true);
    setTimeout(() => { setCreateModal(false); setSaved(false); setForm(EMPTY_REQ); }, 1500);
  };

  const SkillTags = ({ skills, colorClass, type, onRemove }: { skills: string[]; colorClass: string; type: 'mandatorySkills' | 'primarySkills' | 'secondarySkills'; onRemove?: (s: string) => void }) => (
    <div className="flex flex-wrap gap-1.5">
      {skills.map(s => (
        <span key={s} className={cn('badge', colorClass)}>
          {s}
          {onRemove && <button onClick={() => onRemove(s)} className="ml-1 hover:opacity-70"><X size={10} /></button>}
        </span>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Requirements</h2>
          <p className="text-slate-400 text-sm">Manage all job requirements and postings</p>
        </div>
        <button onClick={() => setCreateModal(true)} className="btn btn-primary">
          <Plus size={16} /> Create Requirement
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" placeholder="Search requirements..." />
        </div>
        <div className="flex gap-2">
          {(['all', 'open', 'on_hold', 'closed'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn('btn text-sm capitalize', statusFilter === s ? 'btn-primary' : 'btn-ghost')}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Requirements table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.07]">
          <h3 className="font-semibold text-white">All Requirements <span className="text-slate-400 font-normal text-sm">({filtered.length})</span></h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Job Title</th><th>Type</th><th>Location</th><th>Experience</th><th>Status</th><th>Submissions</th><th>Posted</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(req => (
                <tr key={req.id}>
                  <td>
                    <div className="font-medium text-white">{req.title}</div>
                    <div className="text-xs text-slate-500">{req.mandatorySkills.slice(0, 3).join(', ')}</div>
                  </td>
                  <td><JobTypeBadge type={req.jobType} /></td>
                  <td className="text-slate-300"><div className="flex items-center gap-1"><MapPin size={12} className="text-slate-500" />{req.location}</div></td>
                  <td className="text-slate-300">{req.minExperience}+ yrs</td>
                  <td><RequirementStatusBadge status={req.status} /></td>
                  <td><span className="font-semibold text-white">{req.totalSubmissions}</span></td>
                  <td className="text-slate-400 text-sm">{formatDate(req.postedDate)}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setViewReq(req)} className="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400 transition-colors"><Eye size={13} /></button>
                      <button className="w-7 h-7 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center text-amber-400 transition-colors"><Pencil size={13} /></button>
                      <button className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {createModal && (
        <div className="modal-overlay" onClick={() => setCreateModal(false)}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            {saved ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-bold text-white">Requirement Created!</h3>
                <p className="text-slate-400 text-sm mt-2">Vendors will be notified of this new opportunity.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-white/[0.07] flex items-center justify-between">
                  <h3 className="font-bold text-white text-lg">Create New Requirement</h3>
                  <button onClick={() => setCreateModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><label className="block text-sm text-slate-300 mb-1.5">Job Title *</label>
                      <input className="input" placeholder="e.g. Senior React Developer" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
                    <div><label className="block text-sm text-slate-300 mb-1.5">Job Type</label>
                      <select className="input" value={form.jobType} onChange={e => setForm({...form, jobType: e.target.value as JobType})}>
                        {['remote', 'onsite', 'hybrid'].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                      </select></div>
                    <div><label className="block text-sm text-slate-300 mb-1.5">Location</label>
                      <input className="input" placeholder="e.g. Remote / Pune" value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
                    <div><label className="block text-sm text-slate-300 mb-1.5">Min Experience (yrs)</label>
                      <input className="input" type="number" min={0} value={form.minExperience} onChange={e => setForm({...form, minExperience: +e.target.value})} /></div>
                    <div><label className="block text-sm text-slate-300 mb-1.5">Target Closure Date</label>
                      <input className="input" type="date" value={form.targetClosureDate} onChange={e => setForm({...form, targetClosureDate: e.target.value})} /></div>
                    <div><label className="block text-sm text-slate-300 mb-1.5">Budget / CTC Range</label>
                      <input className="input" placeholder="e.g. ₹18-25 LPA" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} /></div>
                    <div><label className="block text-sm text-slate-300 mb-1.5">Status</label>
                      <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value as RequirementStatus})}>
                        <option value="open">Open</option>
                        <option value="on_hold">On Hold</option>
                        <option value="closed">Closed</option>
                      </select></div>
                  </div>
                  <div><label className="block text-sm text-slate-300 mb-1.5">Job Description *</label>
                    <textarea className="input min-h-[100px] resize-none" placeholder="Describe the role, responsibilities..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>

                  {/* Skills */}
                  {([ ['mandatory', 'Mandatory Skills', 'mandatorySkills', 'bg-red-500/15 text-red-400'],
                       ['primary', 'Primary Skills', 'primarySkills', 'bg-blue-500/15 text-blue-400'],
                       ['secondary', 'Secondary Skills', 'secondarySkills', 'bg-slate-500/15 text-slate-300'] ] as const).map(([field, label, key, color]) => (
                    <div key={key}>
                      <label className="block text-sm text-slate-300 mb-1.5">{label}</label>
                      <div className="flex gap-2 mb-2">
                        <input className="input text-sm" placeholder={`Add ${label.toLowerCase()}...`} value={skillInput[field]} onChange={e => setSkillInput(prev => ({...prev, [field]: e.target.value}))} onKeyDown={e => e.key === 'Enter' && addSkill(field)} />
                        <button type="button" onClick={() => addSkill(field)} className="btn btn-ghost text-sm px-3">Add</button>
                      </div>
                      <SkillTags skills={(form[key] || []) as string[]} colorClass={color} type={key} onRemove={(s) => removeSkill(key, s)} />
                    </div>
                  ))}
                </div>
                <div className="p-6 pt-0 flex gap-3">
                  <button onClick={() => setCreateModal(false)} className="btn btn-ghost flex-1 justify-center">Cancel</button>
                  <button onClick={handleSave} className="btn btn-primary flex-1 justify-center"><Plus size={16} /> Create Requirement</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* View Requirement Modal */}
      {viewReq && (
        <div className="modal-overlay" onClick={() => setViewReq(null)}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/[0.07] flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{viewReq.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <JobTypeBadge type={viewReq.jobType} />
                  <RequirementStatusBadge status={viewReq.status} />
                </div>
              </div>
              <button onClick={() => setViewReq(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[['Location', viewReq.location], ['Min Experience', `${viewReq.minExperience}+ years`], ['Target Closure', formatDate(viewReq.targetClosureDate)], ['Budget', viewReq.budget || 'Market standard'], ['Total Submissions', viewReq.totalSubmissions], ['Posted', formatDate(viewReq.postedDate)]].map(([k, v]) => (
                  <div key={k as string} className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-400">{k}</p>
                    <p className="text-white font-medium mt-0.5 text-sm">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-300 mb-2">Description</p>
                <p className="text-sm text-slate-400 leading-relaxed">{viewReq.description}</p>
              </div>
              {[['Mandatory', viewReq.mandatorySkills, 'bg-red-500/15 text-red-400'], ['Primary', viewReq.primarySkills, 'bg-blue-500/15 text-blue-400'], ['Secondary', viewReq.secondarySkills, 'bg-slate-500/15 text-slate-300']].map(([label, skills, color]) => (
                <div key={label as string}>
                  <p className="text-sm font-semibold text-slate-300 mb-2">{label} Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(skills as string[]).map(s => <span key={s} className={cn('badge', color as string)}>{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
