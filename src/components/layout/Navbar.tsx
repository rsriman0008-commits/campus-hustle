import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  Store,
  MessageSquare,
  PlusCircle,
  Search,
  Bell,
  User,
  Tag,
  Bookmark,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface DemoSession {
  email: string;
  displayName: string;
  role: string;
}

async function getSession(): Promise<DemoSession | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get('ch_demo_session')?.value;
    if (!raw) return null;
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

function AvatarInitial({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs select-none">
      {initials || <User className="w-4 h-4" />}
    </div>
  );
}

export const Navbar = async () => {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 border-b border-slate-200/80 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Campus Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                Campus Hustle
                <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  PU Only
                </span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium">Pondicherry University Marketplace</p>
            </div>
          </Link>
        </div>

        {/* Global Search Bar — Only shown when authenticated */}
        {session && (
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search textbooks, calculators, tutoring, hostel items..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all shadow-xs"
            />
          </div>
        )}

        {/* Action Links */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {session ? (
            <>
              {/* Post Listing CTA */}
              <Link
                href="/listings/new"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                Post Listing
              </Link>

              {/* Offers */}
              <Link
                href="/offers"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                title="Offers & Swaps"
              >
                <Tag className="w-5 h-5" />
              </Link>

              {/* Notifications */}
              <Link
                href="/notifications"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
              </Link>

              {/* Messages */}
              <Link
                href="/chat"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                title="Messages"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>

              <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

              {/* Profile Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 transition-all"
                  aria-label="User menu"
                >
                  <AvatarInitial name={session.displayName} />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {session.displayName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {session.email}
                    </p>
                    <span className="mt-1 inline-block text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Verified PU User
                    </span>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    My Profile & History
                  </Link>

                  <Link
                    href="/seller/dashboard"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-500" />
                    Seller Dashboard
                  </Link>

                  <Link
                    href="/saved"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-slate-500" />
                    Saved Items
                  </Link>

                  <Link
                    href="/safety"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    Safety Centre
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <form action="/api/auth/signout" method="POST">
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition-all shadow-xs"
              >
                Join PU
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
