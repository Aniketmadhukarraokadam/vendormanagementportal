'use client';
import { useState } from 'react';
import { FolderOpen, CheckCircle2, Clock, Download, Upload, Eye, X, AlertCircle } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { DocumentStatusBadge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/file-upload';
import { mockDocuments } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { VendorDocument } from '@/types';
import { cn } from '@/lib/utils';

const TYPE_ICONS: Record<string, string> = {
  contract: '📋',
  nda: '🔒',
  compliance: '✅',
  other: '📄',
};

export default function VendorDocumentsPage() {
  const [docs, setDocs] = useState(mockDocuments.filter(d => d.vendorId === 'v1'));
  const [responseModal, setResponseModal] = useState<VendorDocument | null>(null);
  const [responseSuccess, setResponseSuccess] = useState(false);
  const [search, setSearch] = useState('');

  const total = docs.length;
  const responded = docs.filter(d => d.status === 'responded' || d.status === 'approved').length;
  const pending = docs.filter(d => d.status === 'pending_response').length;

  const filtered = docs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleUploadResponse = async () => {
    await new Promise(r => setTimeout(r, 800));
    setDocs(prev => prev.map(d => d.id === responseModal?.id ? { ...d, status: 'responded' } : d));
    setResponseSuccess(true);
    setTimeout(() => { setResponseModal(null); setResponseSuccess(false); }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Total Documents" value={total} icon={FolderOpen} iconColor="text-blue-400" />
        <MetricCard title="Responses Uploaded" value={responded} icon={CheckCircle2} iconColor="text-emerald-400" />
        <MetricCard title="Pending Responses" value={pending} icon={Clock} iconColor="text-amber-400" />
      </div>

      {/* Pending alert */}
      {pending > 0 && (
        <div className="glass rounded-2xl p-4 flex items-start gap-3 border border-amber-500/20 bg-amber-500/5">
          <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-400">Action Required</p>
            <p className="text-xs text-slate-400 mt-0.5">You have {pending} document{pending > 1 ? 's' : ''} awaiting your response. Please review and upload your response at the earliest.</p>
          </div>
        </div>
      )}

      {/* Documents table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.07] flex items-center justify-between gap-4">
          <h3 className="font-semibold text-white">Documents</h3>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input max-w-xs text-sm py-2" placeholder="Search documents..." />
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Uploaded By</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{TYPE_ICONS[doc.type] || '📄'}</span>
                      <div>
                        <div className="font-medium text-white">{doc.name}</div>
                        <div className="text-xs text-slate-500 capitalize">{doc.type.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-slate-300 capitalize">{doc.type.replace('_', ' ')}</td>
                  <td className="text-slate-300">{doc.uploadedBy}</td>
                  <td><DocumentStatusBadge status={doc.status} /></td>
                  <td className="text-slate-400 text-sm">{formatDate(doc.createdAt)}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400 transition-colors" title="View">
                        <Eye size={13} />
                      </button>
                      <button className="w-7 h-7 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 flex items-center justify-center text-slate-400 transition-colors" title="Download">
                        <Download size={13} />
                      </button>
                      {doc.status === 'pending_response' && (
                        <button
                          onClick={() => { setResponseModal(doc); setResponseSuccess(false); }}
                          className="btn btn-primary py-1 px-3 text-xs"
                          title="Upload Response"
                        >
                          <Upload size={12} /> Respond
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500">
                  <FolderOpen size={40} className="mx-auto mb-2 opacity-30" />
                  <p>No documents found.</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Response Modal */}
      {responseModal && (
        <div className="modal-overlay" onClick={() => setResponseModal(null)}>
          <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
            {responseSuccess ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-bold text-white mb-2">Response Uploaded!</h3>
                <p className="text-slate-400 text-sm">Your response has been submitted to the HR team.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-white/[0.07] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">Upload Response</h3>
                    <p className="text-sm text-slate-400 mt-0.5">{responseModal.name}</p>
                  </div>
                  <button onClick={() => setResponseModal(null)} className="text-slate-400 hover:text-white p-1"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="glass rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">{TYPE_ICONS[responseModal.type]}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{responseModal.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{responseModal.type} • Uploaded by {responseModal.uploadedBy}</p>
                    </div>
                  </div>
                  <FileUpload onFileSelect={(f) => console.log(f.name)} label="Upload Your Signed / Response Document" />
                  <div className="flex gap-3">
                    <button onClick={() => setResponseModal(null)} className="btn btn-ghost flex-1 justify-center">Cancel</button>
                    <button onClick={handleUploadResponse} className="btn btn-primary flex-1 justify-center"><Upload size={15} /> Submit Response</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
