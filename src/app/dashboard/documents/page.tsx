'use client';
import { useState } from 'react';
import { Upload, Search, Download, Eye, Check, X, FolderOpen, Plus } from 'lucide-react';
import { DocumentStatusBadge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/file-upload';
import { mockDocuments, mockVendors } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { VendorDocument } from '@/types';
import { MetricCard } from '@/components/ui/metric-card';
import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_ICONS: Record<string, string> = { contract: '📋', nda: '🔒', compliance: '✅', other: '📄' };

export default function HRDocumentsPage() {
  const [docs, setDocs] = useState(mockDocuments);
  const [search, setSearch] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState<VendorDocument | null>(null);
  const [form, setForm] = useState({ vendorId: '', name: '', type: 'contract' as VendorDocument['type'] });
  const [saved, setSaved] = useState(false);

  const filtered = docs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase())
  );

  const total = docs.length;
  const pending = docs.filter(d => d.status === 'pending_response').length;
  const responded = docs.filter(d => d.status === 'responded').length;
  const approved = docs.filter(d => d.status === 'approved').length;

  const approveDoc = (id: string) => setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
  const rejectDoc = (id: string) => setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d));

  const handleUpload = async () => {
    await new Promise(r => setTimeout(r, 600));
    const newDoc: VendorDocument = {
      id: `d${Date.now()}`, vendorId: form.vendorId, name: form.name, type: form.type,
      uploadedBy: 'HR Team', status: 'pending_response', createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10)
    };
    setDocs(prev => [newDoc, ...prev]);
    setSaved(true);
    setTimeout(() => { setUploadOpen(false); setSaved(false); setForm({ vendorId: '', name: '', type: 'contract' }); }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Document Management</h2>
          <p className="text-slate-400 text-sm">Manage documents and vendor compliance</p>
        </div>
        <button onClick={() => setUploadOpen(true)} className="btn btn-primary"><Upload size={16} /> Upload Document</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard title="Total Documents" value={total} icon={FolderOpen} iconColor="text-blue-400" />
        <MetricCard title="Pending Response" value={pending} icon={Clock} iconColor="text-amber-400" />
        <MetricCard title="Responded" value={responded} icon={CheckCircle2} iconColor="text-teal-400" />
        <MetricCard title="Approved" value={approved} icon={Check} iconColor="text-emerald-400" />
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" placeholder="Search documents..." />
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.07]">
          <h3 className="font-semibold text-white">Documents <span className="text-slate-400 font-normal text-sm">({filtered.length})</span></h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Document</th><th>Vendor</th><th>Type</th><th>Uploaded By</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{TYPE_ICONS[doc.type]}</span>
                      <div className="font-medium text-white">{doc.name}</div>
                    </div>
                  </td>
                  <td className="text-slate-300 text-sm">{mockVendors.find(v => v.id === doc.vendorId)?.companyName || '—'}</td>
                  <td className="text-slate-300 capitalize">{doc.type}</td>
                  <td className="text-slate-400 text-sm">{doc.uploadedBy}</td>
                  <td><DocumentStatusBadge status={doc.status} /></td>
                  <td className="text-slate-400 text-sm">{formatDate(doc.createdAt)}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setViewDoc(doc)} className="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400"><Eye size={13} /></button>
                      <button className="w-7 h-7 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 flex items-center justify-center text-slate-400"><Download size={13} /></button>
                      {doc.status === 'responded' && (
                        <>
                          <button onClick={() => approveDoc(doc.id)} className="w-7 h-7 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400" title="Approve"><Check size={13} /></button>
                          <button onClick={() => rejectDoc(doc.id)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400" title="Reject"><X size={13} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadOpen && (
        <div className="modal-overlay" onClick={() => setUploadOpen(false)}>
          <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
            {saved ? (
              <div className="p-8 text-center"><div className="text-4xl mb-4">✅</div><h3 className="text-lg font-bold text-white">Document Uploaded!</h3><p className="text-slate-400 text-sm mt-2">Vendor has been notified.</p></div>
            ) : (
              <>
                <div className="p-6 border-b border-white/[0.07] flex items-center justify-between">
                  <h3 className="font-bold text-white">Upload Document for Vendor</h3>
                  <button onClick={() => setUploadOpen(false)}><X size={18} className="text-slate-400" /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div><label className="block text-sm text-slate-300 mb-1.5">Select Vendor</label>
                    <select className="input" value={form.vendorId} onChange={e => setForm({...form, vendorId: e.target.value})}>
                      <option value="">— Select vendor —</option>
                      {mockVendors.filter(v => v.isActive).map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-sm text-slate-300 mb-1.5">Document Name</label>
                    <input className="input" placeholder="e.g. NDA 2026" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                  <div><label className="block text-sm text-slate-300 mb-1.5">Document Type</label>
                    <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value as VendorDocument['type']})}>
                      {['contract', 'nda', 'compliance', 'other'].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                    </select>
                  </div>
                  <FileUpload onFileSelect={(f) => console.log(f.name)} label="Upload Document File" />
                </div>
                <div className="p-6 pt-0 flex gap-3">
                  <button onClick={() => setUploadOpen(false)} className="btn btn-ghost flex-1 justify-center">Cancel</button>
                  <button onClick={handleUpload} className="btn btn-primary flex-1 justify-center"><Upload size={15} /> Upload & Notify Vendor</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
