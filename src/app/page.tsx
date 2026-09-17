'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { mockUsers, mockCredentials, demoAccounts } from '@/lib/mock-data';
import { HaikeiBackground } from '@/components/ui/haikei-background';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Real backend authentication via database
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('hirehub_user', JSON.stringify(data.user));
      setLoading(false);

      if (data.user.role === 'vendor') router.push('/Vendor-dashboard');
      else router.push('/dashboard');
    } catch (err: any) {
      // Fallback check against mock credentials
      const cred = mockCredentials[email.toLowerCase()];
      if (cred && cred.password === password) {
        const fallbackUser = mockUsers.find(u => u.id === cred.userId);
        if (fallbackUser) {
          localStorage.setItem('hirehub_user', JSON.stringify(fallbackUser));
          setLoading(false);
          if (fallbackUser.role === 'vendor') router.push('/Vendor-dashboard');
          else router.push('/dashboard');
          return;
        }
      }
      setError(err.message || 'Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 60% 0%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.1) 0%, transparent 40%), hsl(222, 47%, 6%)' }}>
      {/* Haikei Generative SVG Wave & Blob Layers */}
      <HaikeiBackground variant="waves" opacity={0.45} />
      <HaikeiBackground variant="blobs" opacity={0.3} />

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-16 relative overflow-hidden">
        {/* Haikei Polygon Geometric Accent */}
        <HaikeiBackground variant="polygon" opacity={0.25} />
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        {/* Glow orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center glow-blue">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">MindCrew</div>
              <div className="text-slate-400 text-sm">HireHub Platform</div>
            </div>
          </div>

          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            Inspired Mind<br />
            <span className="gradient-text">Creates Living</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            Connect top talent with great opportunities. Manage vendor relationships, streamline candidate submissions, and accelerate your hiring pipeline.
          </p>

          {/* Features */}
          <div className="mt-12 space-y-4">
            {[
              { icon: '🎯', text: '236+ Active Job Requirements' },
              { icon: '🤝', text: 'Multi-vendor candidate management' },
              { icon: '📅', text: 'Smart screening slot booking' },
              { icon: '🔒', text: 'Secure document exchange' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <span className="text-xl">{f.icon}</span>
                <span className="text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <div className="text-xl font-bold text-white">MindCrew HireHub</div>
              <div className="text-slate-400 text-xs">Inspired Mind Creates Living</div>
            </div>
          </div>

          {/* Card */}
          <div className="glass-strong p-8 rounded-2xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">Sign In</h1>
              <p className="text-slate-400 text-sm">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300" htmlFor="email">
                  Username or Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="Enter your username or email"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input pl-10 pr-10"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 accent-blue-500"
                  />
                  <span className="text-sm text-slate-400">Keep me signed in</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full justify-center py-3 text-base"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In <ArrowRight size={16} />
                  </div>
                )}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-8 pt-6 border-t border-white/[0.07]">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Demo Accounts</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.role}
                    onClick={() => fillDemo(acc.email, acc.password)}
                    className="glass rounded-xl p-3 text-center hover:bg-white/[0.06] transition-all group"
                  >
                    <div className={`text-xs font-semibold ${acc.color} mb-0.5`}>{acc.role}</div>
                    <div className="text-[10px] text-slate-500">Click to fill</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 space-y-1">
            <p className="text-xs text-slate-500">Need help? Contact your system administrator</p>
            <p className="text-xs text-slate-600">© 2024 Mindcrew HireHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
