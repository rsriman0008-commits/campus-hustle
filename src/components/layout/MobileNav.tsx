'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/listings/new', label: 'Create', icon: PlusCircle, fab: true },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/profile', label: 'Profile', icon: User },
];

export const MobileNav = () => {
  const pathname = usePathname();

  // Hide mobile nav completely on auth entry pages
  if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/login/') || pathname.startsWith('/register/')) {
    return null;
  }

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-slate-200/80 backdrop-blur-md px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map(({ href, label, icon: Icon, fab }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

          if (fab) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center p-0.5"
                aria-label={label}
              >
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md -mt-4 transition-transform active:scale-95">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-tighter mt-1">
                  {label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-700 bg-emerald-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
              aria-label={label}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-tighter">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
