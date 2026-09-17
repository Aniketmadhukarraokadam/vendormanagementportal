'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { HaikeiBackground } from '@/components/ui/haikei-background';
import { User } from '@/types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('hirehub_user');
    if (!stored) { router.push('/'); return; }
    const u: User = JSON.parse(stored);
    if (u.role === 'vendor') { router.push('/Vendor-dashboard'); return; }
    setUser(u);
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      <HaikeiBackground variant="polygon" opacity={0.12} />
      <Sidebar role={user.role} userName={user.name} userEmail={user.email} />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header title="Dashboard" userEmail={user.email} userRole={user.role} />
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
