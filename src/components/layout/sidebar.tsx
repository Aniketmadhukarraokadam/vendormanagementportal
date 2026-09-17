'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Search, FileText, FolderOpen, LogOut,
  ChevronRight, Users, Building2, Settings, BarChart3,
  Briefcase, Calendar, ChevronLeft,
} from 'lucide-react';
import { UserRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // Vendor
  { label: 'Dashboard', href: '/Vendor-dashboard', icon: LayoutDashboard, roles: ['vendor'] },
  { label: 'Browse Requirements', href: '/Vendor-dashboard/browse-requirements', icon: Search, roles: ['vendor'] },
  { label: 'My Submissions', href: '/Vendor-dashboard/submissions', icon: FileText, roles: ['vendor'] },
  { label: 'Documents', href: '/Vendor-dashboard/documents', icon: FolderOpen, roles: ['vendor'] },
  // HR + Admin
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['hr', 'admin'] },
  { label: 'Requirements', href: '/dashboard/requirements', icon: Briefcase, roles: ['hr', 'admin'] },
  { label: 'Submissions', href: '/dashboard/submissions', icon: FileText, roles: ['hr', 'admin'] },
  { label: 'Interviews', href: '/dashboard/interviews', icon: Calendar, roles: ['hr', 'admin'] },
  { label: 'Documents', href: '/dashboard/documents', icon: FolderOpen, roles: ['hr', 'admin'] },
  { label: 'Vendors', href: '/dashboard/vendors', icon: Building2, roles: ['admin'] },
  { label: 'Users', href: '/dashboard/users', icon: Users, roles: ['admin'] },
  { label: 'Reports', href: '/dashboard/reports', icon: BarChart3, roles: ['hr', 'admin'] },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['admin'] },
];

interface SidebarProps {
  role: UserRole;
  userName: string;
  userEmail: string;
}

export function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  const roleLabel = role === 'admin' ? 'Admin' : role === 'hr' ? 'HR Team' : 'Vendor';
  const roleColor = role === 'admin' ? 'text-purple-400 bg-purple-500/10' : role === 'hr' ? 'text-blue-400 bg-blue-500/10' : 'text-emerald-400 bg-emerald-500/10';

  return (
    <aside className={cn('sidebar flex flex-col', collapsed && 'collapsed')}>
      {/* Logo */}
      <div className={cn('p-5 border-b border-white/[0.07] flex items-center gap-3', collapsed && 'justify-center p-4')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 glow-blue">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-white text-sm leading-tight">MindCrew</div>
            <div className="text-[10px] text-slate-400">HireHub</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          // Exact match for dashboard, prefix match for sub-pages
          const isActive = item.href === '/dashboard' || item.href === '/Vendor-dashboard'
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className={cn('flex-shrink-0', isActive ? 'text-blue-400' : 'group-hover:text-white')} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isActive && <ChevronRight size={14} className="ml-auto text-blue-400/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="p-3 border-t border-white/[0.07] space-y-2">
        {!collapsed && (
          <div className="glass rounded-xl p-3">
            <div className="font-medium text-white text-sm truncate">{userName}</div>
            <div className="text-xs text-slate-400 truncate">{userEmail}</div>
            <span className={cn('badge mt-1.5 text-[10px]', roleColor)}>{roleLabel}</span>
          </div>
        )}
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={17} />
          {!collapsed && <span>Sign Out</span>}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center hover:bg-slate-600 transition-colors z-10 text-slate-300"
        style={{ position: 'absolute' }}
      >
        <ChevronLeft size={12} className={cn('transition-transform', collapsed && 'rotate-180')} />
      </button>
    </aside>
  );
}
