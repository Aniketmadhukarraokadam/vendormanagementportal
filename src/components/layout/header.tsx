'use client';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Bell, Sun, Moon, ChevronDown, User, KeyRound, LogOut } from 'lucide-react';
import Link from 'next/link';
import { mockNotifications } from '@/lib/mock-data';
import { timeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  userEmail: string;
  userRole: string;
}

export function Header({ title, userEmail, userRole }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const unread = mockNotifications.filter(n => !n.isRead).length;
  const [notifications, setNotifications] = useState(mockNotifications.slice(0, 8));

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const notifTypeIcon: Record<string, string> = {
    new_requirement: '💼',
    submission_update: '📋',
    screening_scheduled: '📅',
    document: '📁',
  };

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-xs">
      {/* Left: title */}
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors relative shadow-xs"
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Notification panel */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-96 modal-content animate-fade-in z-50 shadow-2xl">
              <div className="p-4 border-b border-white/[0.07] flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <p className="text-xs text-slate-400">{unread} unread</p>
                </div>
                <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Mark all read
                </button>
              </div>
              <div className="divide-y divide-white/[0.04] max-h-96 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={cn('p-4 hover:bg-white/[0.03] transition-colors cursor-pointer', !n.isRead && 'border-l-2 border-blue-500')}>
                    <div className="flex gap-3">
                      <span className="text-xl flex-shrink-0">{notifTypeIcon[n.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-medium', !n.isRead ? 'text-white' : 'text-slate-300')}>
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[11px] text-slate-500 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-xs"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
              {userEmail[0].toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs text-slate-800 font-semibold truncate max-w-[150px]">{userEmail}</div>
              <div className="text-[10px] text-slate-500 font-medium capitalize">{userRole}</div>
            </div>
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-52 bg-white border border-slate-200 rounded-xl animate-fade-in z-50 shadow-xl p-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all">
                <User size={15} className="text-slate-500" /> Profile Settings
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all">
                <KeyRound size={15} className="text-slate-500" /> Change Password
              </button>
              <div className="border-t border-slate-100 my-1" />
              <Link href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all">
                <LogOut size={15} /> Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close dropdowns */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-20" onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}
    </header>
  );
}
