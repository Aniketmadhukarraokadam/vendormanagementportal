'use client';
import { useState, useEffect } from 'react';
import { Search, Filter, Eye, UserPlus, X, ChevronLeft, ChevronRight, Calendar, Upload } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { RequirementStatusBadge, JobTypeBadge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/file-upload';
import { mockRequirements, mockScreeningSlots } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Requirement, JobType } from '@/types';
import { Briefcase, MapPin, Clock, Wifi, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const slots = mockScreeningSlots;

export default function BrowseRequirementsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | JobType>('all');
  const [viewModal, setViewModal] = useState<Requirement | null>(null);
  const [submitModal, setSubmitModal] = useState<Requirement | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [submitStep, setSubmitStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    candidateName: '', phone: '', email: '',
    totalExp: '', relevantExp: '', jdComfort: '',
  });

  const filtered = mockRequirements.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.mandatorySkills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'all' || r.jobType === typeFilter;
    return matchSearch && matchType;
  });

  const openReqs = mockRequirements.filter(r => r.status === 'open').length;
  const remoteReqs = mockRequirements.filter(r => r.jobType === 'remote').length;
  const onsiteReqs = mockRequirements.filter(r => r.jobType === 'onsite').length;

  const availableDates = [...new Set(slots.map(s => s.date))];
  const availableTimes = slots.filter(s => s.date === selectedDate && s.isAvailable).map(s => s.time);

  const handleSubmit = async () => {
    await new Promise(r => setTimeout(r, 800));
    setSubmitted(true);
  };

  const resetSubmit = () => {
    setSubmitModal(null);
    setSubmitStep(1);
    setSubmitted(false);
    setSelectedDate('');
    setSelectedSlot('');
    setForm({ candidateName: '', phone: '', email: '', totalExp: '', relevantExp: '', jdComfort: '' });
  };

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Open Requirements" value={openReqs} icon={Briefcase} iconColor="text-emerald-400" />
        <MetricCard title="Onsite Opportunities" value={onsiteReqs} icon={Building2} iconColor="text-purple-400" />
        <MetricCard title="Remote Opportunities" value={remoteReqs} icon={Wifi} iconColor="text-blue-400" />
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-10"
              placeholder="Search by job title or skills..."
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'remote', 'onsite', 'hybrid'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn('btn text-sm capitalize', typeFilter === t ? 'btn-primary' : 'btn-ghost')}
              >
                {t === 'all' ? 'All Jobs' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.07]">
          <h3 className="font-semibold text-white">Job Requirements <span className="text-slate-400 text-sm font-normal">({filtered.length} results)</span></h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Experience</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => (
                <tr key={req.id}>
                  <td>
                    <div className="font-medium text-white">{req.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{req.mandatorySkills.slice(0, 2).join(', ')}</div>
                  </td>
                  <td className="text-slate-300">{req.minExperience}+ yrs</td>
                  <td><JobTypeBadge type={req.jobType} /></td>
                  <td className="text-slate-300">
                    <div className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-500" />{req.location}</div>
                  </td>
                  <td><RequirementStatusBadge status={req.status} /></td>
                  <td className="text-slate-400 text-sm">{formatDate(req.postedDate)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewModal(req)} className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400 transition-colors" title="View Details">
                        <Eye size={15} />
                      </button>
                      {req.status === 'open' && (
                        <button onClick={() => { setSubmitModal(req); setSubmitted(false); setSubmitStep(1); }} className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 transition-colors" title="Submit Candidate">
                          <UserPlus size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-slate-500">No requirements match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {viewModal && (
        <div className="modal-overlay" onClick={() => setViewModal(null)}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/[0.07] flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{viewModal.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <JobTypeBadge type={viewModal.jobType} />
                  <RequirementStatusBadge status={viewModal.status} />
                </div>
              </div>
              <button onClick={() => setViewModal(null)} className="text-slate-400 hover:text-white transition-colors p-1"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-3"><p className="text-xs text-slate-400">Location</p><p className="text-white font-medium mt-0.5">{viewModal.location}</p></div>
                <div className="glass rounded-xl p-3"><p className="text-xs text-slate-400">Min Experience</p><p className="text-white font-medium mt-0.5">{viewModal.minExperience}+ years</p></div>
                <div className="glass rounded-xl p-3"><p className="text-xs text-slate-400">Target Closure</p><p className="text-white font-medium mt-0.5">{formatDate(viewModal.targetClosureDate)}</p></div>
                <div className="glass rounded-xl p-3"><p className="text-xs text-slate-400">Budget</p><p className="text-white font-medium mt-0.5">{viewModal.budget || 'As per market'}</p></div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-300 mb-2">Job Description</p>
                <p className="text-sm text-slate-400 leading-relaxed">{viewModal.description}</p>
              </div>

              {[
                { label: 'Mandatory Skills', skills: viewModal.mandatorySkills, color: 'bg-red-500/15 text-red-400' },
                { label: 'Primary Skills', skills: viewModal.primarySkills, color: 'bg-blue-500/15 text-blue-400' },
                { label: 'Secondary Skills', skills: viewModal.secondarySkills, color: 'bg-slate-500/15 text-slate-300' },
              ].map(({ label, skills, color }) => (
                <div key={label}>
                  <p className="text-sm font-semibold text-slate-300 mb-2">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => <span key={s} className={cn('badge', color)}>{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 pt-0">
              {viewModal.status === 'open' && (
                <button onClick={() => { setViewModal(null); setSubmitModal(viewModal); }} className="btn btn-primary w-full justify-center">
                  <UserPlus size={16} /> Submit Candidate for this Role
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Candidate Modal */}
      {submitModal && (
        <div className="modal-overlay" onClick={resetSubmit}>
          <div className="modal-content max-w-xl" onClick={e => e.stopPropagation()}>
            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Candidate Submitted!</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Your candidate has been submitted for <strong className="text-white">{submitModal.title}</strong>. The HR team will review and confirm the screening.
                </p>
                <button onClick={resetSubmit} className="btn btn-primary w-full justify-center">Done</button>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-white/[0.07] flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Submit Candidate</h2>
                    <p className="text-sm text-slate-400 mt-0.5">for: <span className="text-blue-400">{submitModal.title}</span></p>
                  </div>
                  <button onClick={resetSubmit} className="text-slate-400 hover:text-white p-1"><X size={20} /></button>
                </div>

                {/* Steps indicator */}
                <div className="px-6 pt-4 flex items-center gap-2">
                  {[1, 2, 3].map(step => (
                    <div key={step} className="flex items-center gap-2">
                      <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold', submitStep >= step ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-400')}>
                        {step}
                      </div>
                      <span className={cn('text-xs', submitStep === step ? 'text-white' : 'text-slate-500')}>
                        {step === 1 ? 'Candidate Details' : step === 2 ? 'Schedule Screening' : 'Upload CV'}
                      </span>
                      {step < 3 && <div className={cn('w-8 h-px', submitStep > step ? 'bg-blue-500' : 'bg-white/10')} />}
                    </div>
                  ))}
                </div>

                <div className="p-6 space-y-4">
                  {submitStep === 1 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm text-slate-300 mb-1.5">Candidate Name *</label>
                          <input className="input" placeholder="Full name" value={form.candidateName} onChange={e => setForm({...form, candidateName: e.target.value})} /></div>
                        <div><label className="block text-sm text-slate-300 mb-1.5">Contact No. *</label>
                          <input className="input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                        <div><label className="block text-sm text-slate-300 mb-1.5">Email *</label>
                          <input className="input" type="email" placeholder="candidate@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                        <div><label className="block text-sm text-slate-300 mb-1.5">Total Experience (yrs) *</label>
                          <input className="input" type="number" placeholder="e.g. 5" value={form.totalExp} onChange={e => setForm({...form, totalExp: e.target.value})} /></div>
                        <div><label className="block text-sm text-slate-300 mb-1.5">Relevant Experience (yrs) *</label>
                          <input className="input" type="number" placeholder="e.g. 3" value={form.relevantExp} onChange={e => setForm({...form, relevantExp: e.target.value})} /></div>
                        <div><label className="block text-sm text-slate-300 mb-1.5">100% comfortable with JD?</label>
                          <div className="flex gap-3 mt-2">
                            {['Yes', 'No'].map(v => (
                              <label key={v} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="jd" value={v} checked={form.jdComfort === v} onChange={() => setForm({...form, jdComfort: v})} className="accent-blue-500" />
                                <span className="text-sm text-slate-300">{v}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {submitStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Select Date</label>
                        <div className="grid grid-cols-3 gap-2">
                          {availableDates.map(d => (
                            <button key={d} onClick={() => { setSelectedDate(d); setSelectedSlot(''); }}
                              className={cn('glass rounded-xl p-3 text-sm font-medium transition-all', selectedDate === d ? 'border-blue-500 text-blue-400 bg-blue-500/10 border' : 'text-slate-300 hover:bg-white/[0.05]')}>
                              {formatDate(d)}
                            </button>
                          ))}
                        </div>
                      </div>
                      {selectedDate && (
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Select Time Slot</label>
                          <div className="grid grid-cols-3 gap-2">
                            {availableTimes.map(t => (
                              <button key={t} onClick={() => setSelectedSlot(t)}
                                className={cn('glass rounded-xl p-3 text-sm font-medium transition-all', selectedSlot === t ? 'border-blue-500 text-blue-400 bg-blue-500/10 border' : 'text-slate-300 hover:bg-white/[0.05]')}>
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {submitStep === 3 && (
                    <FileUpload onFileSelect={(f) => console.log('File selected:', f.name)} />
                  )}
                </div>

                <div className="p-6 pt-0 flex gap-3">
                  {submitStep > 1 && <button onClick={() => setSubmitStep(s => s - 1)} className="btn btn-ghost"><ChevronLeft size={16} /> Back</button>}
                  {submitStep < 3
                    ? <button onClick={() => setSubmitStep(s => s + 1)} className="btn btn-primary flex-1 justify-center">Next <ChevronRight size={16} /></button>
                    : <button onClick={handleSubmit} className="btn btn-primary flex-1 justify-center"><Upload size={16} /> Submit Candidate</button>
                  }
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
