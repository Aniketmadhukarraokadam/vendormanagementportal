'use client';
import { useState } from 'react';
import { Settings, Bell, Mail, Globe, Shield, Palette, Save, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'email', label: 'Email Templates', icon: Mail },
  { id: 'integrations', label: 'Integrations', icon: Globe },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    platformName: 'Mindcrew HireHub',
    tagline: 'Inspired Mind Creates Living',
    supportEmail: 'support@mindcrew.com',
    cvMaxSize: '5',
    defaultSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    meetProvider: 'google_meet',
    emailNotifications: true,
    vendorNotifications: true,
    hrNotifications: true,
    requireOTPForLogin: false,
    sessionTimeout: '24',
    primaryColor: '#3b82f6',
    accentColor: '#7c3aed',
    darkModeDefault: true,
  });

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">System Settings</h2>
        <p className="text-slate-400 text-sm">Configure platform-wide settings and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-52 flex-shrink-0 space-y-1">
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all', activeSection === s.id ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/[0.05]')}>
                <Icon size={16} /> {s.label}
              </button>
            );
          })}
        </div>

        {/* Settings content */}
        <div className="flex-1 glass rounded-2xl p-6">
          {activeSection === 'general' && (
            <div className="space-y-5">
              <h3 className="font-semibold text-white text-lg">General Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-slate-300 mb-1.5">Platform Name</label><input className="input" value={form.platformName} onChange={e => setForm({...form, platformName: e.target.value})} /></div>
                <div><label className="block text-sm text-slate-300 mb-1.5">Tagline</label><input className="input" value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} /></div>
                <div><label className="block text-sm text-slate-300 mb-1.5">Support Email</label><input className="input" type="email" value={form.supportEmail} onChange={e => setForm({...form, supportEmail: e.target.value})} /></div>
                <div><label className="block text-sm text-slate-300 mb-1.5">Max CV Upload Size (MB)</label><input className="input" type="number" min={1} max={20} value={form.cvMaxSize} onChange={e => setForm({...form, cvMaxSize: e.target.value})} /></div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Default Screening Time Slots</label>
                <div className="flex flex-wrap gap-2">
                  {form.defaultSlots.map(slot => (
                    <span key={slot} className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20">{slot}</span>
                  ))}
                  <button className="badge bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 transition-colors">+ Add Slot</button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Video Meeting Provider</label>
                <div className="flex gap-3">
                  {[['google_meet', '🎯 Google Meet'], ['zoom', '📹 Zoom'], ['teams', '💼 MS Teams']].map(([val, label]) => (
                    <button key={val} onClick={() => setForm({...form, meetProvider: val})}
                      className={cn('flex-1 glass rounded-xl p-3 text-sm font-medium transition-all', form.meetProvider === val ? 'border border-blue-500 text-blue-400 bg-blue-500/10' : 'text-slate-300 hover:bg-white/[0.05]')}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-5">
              <h3 className="font-semibold text-white text-lg">Notification Settings</h3>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email alerts for all platform events' },
                  { key: 'vendorNotifications', label: 'Vendor Notifications', desc: 'Notify vendors when requirements are posted or submission status changes' },
                  { key: 'hrNotifications', label: 'HR Notifications', desc: 'Notify HR team when new submissions arrive or documents are responded to' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="glass rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                    </div>
                    <button
                      onClick={() => setForm(prev => ({ ...prev, [key]: !(prev as any)[key] }))}
                      className={cn('relative w-12 h-6 rounded-full transition-colors', (form as any)[key] ? 'bg-blue-500' : 'bg-white/10')}
                    >
                      <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-all', (form as any)[key] ? 'left-7' : 'left-1')} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-5">
              <h3 className="font-semibold text-white text-lg">Security Settings</h3>
              <div className="space-y-4">
                <div className="glass rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Require OTP for Login</p>
                    <p className="text-xs text-slate-400 mt-0.5">Two-factor authentication via email OTP</p>
                  </div>
                  <button onClick={() => setForm(prev => ({ ...prev, requireOTPForLogin: !prev.requireOTPForLogin }))}
                    className={cn('relative w-12 h-6 rounded-full transition-colors', form.requireOTPForLogin ? 'bg-blue-500' : 'bg-white/10')}>
                    <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-all', form.requireOTPForLogin ? 'left-7' : 'left-1')} />
                  </button>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Session Timeout (hours)</label>
                  <input className="input max-w-xs" type="number" min={1} max={72} value={form.sessionTimeout} onChange={e => setForm({...form, sessionTimeout: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-5">
              <h3 className="font-semibold text-white text-lg">Appearance Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.primaryColor} onChange={e => setForm({...form, primaryColor: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer" />
                    <input className="input" value={form.primaryColor} onChange={e => setForm({...form, primaryColor: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.accentColor} onChange={e => setForm({...form, accentColor: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer" />
                    <input className="input" value={form.accentColor} onChange={e => setForm({...form, primaryColor: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="glass rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Default Dark Mode</p>
                  <p className="text-xs text-slate-400 mt-0.5">Enable dark mode for all users by default</p>
                </div>
                <button onClick={() => setForm(prev => ({ ...prev, darkModeDefault: !prev.darkModeDefault }))}
                  className={cn('relative w-12 h-6 rounded-full transition-colors', form.darkModeDefault ? 'bg-blue-500' : 'bg-white/10')}>
                  <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-all', form.darkModeDefault ? 'left-7' : 'left-1')} />
                </button>
              </div>
            </div>
          )}

          {(activeSection === 'email' || activeSection === 'integrations') && (
            <div className="space-y-4">
              <h3 className="font-semibold text-white text-lg capitalize">{sections.find(s => s.id === activeSection)?.label}</h3>
              <div className="py-12 text-center">
                <div className="text-4xl mb-3">🚧</div>
                <p className="text-slate-400">This section is coming soon.</p>
                <p className="text-slate-500 text-sm mt-1">Configuration options will be available in the next release.</p>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="mt-6 pt-6 border-t border-white/[0.07] flex items-center gap-3">
            <button onClick={handleSave} className={cn('btn flex-shrink-0', saved ? 'bg-emerald-500 text-white' : 'btn-primary')}>
              {saved ? <><RefreshCw size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
            </button>
            <button className="btn btn-ghost">Discard Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
