'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  TreePine, LayoutDashboard, Trees, FileText,
  Tag, LogOut, ChevronRight, Settings
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/trees', label: 'Trees', icon: Trees },
  { href: '/admin/submissions', label: 'Submissions', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-forest-950 text-white flex flex-col min-h-screen sticky top-0 h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-forest-800">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-forest-600 rounded-xl flex items-center justify-center">
            <TreePine className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-none">KAT Admin</div>
            <div className="text-[10px] text-forest-400 mt-0.5">Administration Panel</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-forest-700 text-white'
                  : 'text-forest-300 hover:text-white hover:bg-forest-800/50'
              }`}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* View Public Site */}
      <div className="p-4 border-t border-forest-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2.5 text-sm text-forest-300 hover:text-white transition-colors"
        >
          <TreePine className="w-4 h-4" />
          View Public Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-forest-300 hover:text-red-400 transition-colors rounded-xl hover:bg-red-900/10"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
