import { cookies } from 'next/headers';
import Link from 'next/link';
import { Tag, ArrowRight } from 'lucide-react';
import OffersClient from './OffersClient';

export default async function OffersPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get('ch_demo_session')?.value;
  const session = raw ? JSON.parse(raw) : null;

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Sign in to manage offers</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track offers you have sent and received on campus listings.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          Sign In <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return <OffersClient />;
}
