import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ShieldCheck, Star, Clock, Package, MessageSquare, Flag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

async function ProfileContent({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  if (!username) notFound();

  const profile = {
    displayName: 'Ananya Roy',
    username,
    bio: 'MCA student. Selling books, offering coding help.',
    verificationStatus: 'verified' as const,
    school: 'School of Engineering & Technology',
    department: 'Department of Computer Science',
    programme: 'Master of Computer Applications (MCA)',
    yearOfStudy: 2,
    completedTransactions: 14,
    avgRating: 4.8,
    reviewCount: 11,
    responseTime: 'Usually within 1 hour',
    activeListings: 3,
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl font-bold text-slate-950 shrink-0">
            {profile.displayName.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white">{profile.displayName}</h1>
              {profile.verificationStatus === 'verified' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" /> PU Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">@{profile.username}</p>
            {profile.bio && (
              <p className="text-sm text-slate-300 mt-2">{profile.bio}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              {profile.programme} · Year {profile.yearOfStudy}
            </p>
          </div>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="font-bold text-white">{profile.avgRating.toFixed(1)}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{profile.reviewCount} reviews</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Package className="w-4 h-4 text-teal-400" />
              <span className="font-bold text-white">{profile.completedTransactions}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Completed</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white text-xs truncate">~1 hr</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Response</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Package className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">{profile.activeListings}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Active</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 mt-4">
          <Button className="flex-1 gap-2 text-sm">
            <MessageSquare className="w-4 h-4" /> Send Message
          </Button>
          <Button variant="outline" className="gap-2 text-xs px-3">
            <Flag className="w-3.5 h-3.5" /> Report
          </Button>
        </div>
      </div>

      {/* Active Listings placeholder */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide px-1">
          Active Listings ({profile.activeListings})
        </h2>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center text-sm text-slate-400">
          Listings will appear here once the listings engine is connected.
        </div>
      </div>
    </div>
  );
}

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <Suspense fallback={
        <div className="py-24 text-center text-slate-500 text-sm">
          Loading student profile...
        </div>
      }>
        <ProfileContent params={params} />
      </Suspense>
    </div>
  );
}
