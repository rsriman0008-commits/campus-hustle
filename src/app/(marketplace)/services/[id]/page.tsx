import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ShieldCheck, MessageSquare, Heart, Flag, Wrench, Clock, Star, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

async function ServiceDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) notFound();

  const service = {
    id,
    title: 'Python Programming & Data Structures Tutoring',
    description: `Experienced 2nd-year MCA student offering 1-on-1 and small group tutoring sessions for Python, Data Structures & Algorithms, and DBMS.

What you get:
• Concept walkthroughs with clean notes
• Hands-on coding assistance for lab assignments
• Practice problem sets & exam preparation

Suitable for MCA, M.Tech, M.Sc Computer Science & B.Tech students.`,
    price: 250,
    pricingModel: 'Per Hour (₹/hr)',
    serviceMode: 'In Person / Hybrid',
    serviceZone: 'Ananda Rangapillai Central Library & Computer Labs',
    availability: 'Weekdays 4:00 PM – 8:00 PM & Weekends',
    category: 'Tutoring & Academic Services',
    provider: {
      displayName: 'Rahul Menon',
      username: 'rahul_mca',
      verificationStatus: 'verified',
      avgRating: 4.9,
      reviewCount: 14,
      completedServices: 18,
      responseTime: '~1 hr',
    },
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-3 space-y-4">
          <div className="aspect-[4/3] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
            <Wrench className="w-16 h-16 text-cyan-400" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Service
            </span>
            <span className="text-xs text-slate-500 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
              {service.category}
            </span>
          </div>

          <div>
            <h1 className="text-xl font-bold text-white leading-snug">{service.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-black text-emerald-400">₹{service.price}</span>
              <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
                {service.pricingModel}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Service Description</h2>
            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{service.description}</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Availability & Location</h2>
            <div className="text-xs space-y-1">
              <p className="text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> <strong>Schedule:</strong> {service.availability}
              </p>
              <p className="text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> <strong>Zone:</strong> {service.serviceZone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <AlertTriangle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>All student service handoffs and tutoring sessions happen in safe campus environments.</span>
          </div>
        </div>

        {/* Right Provider Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3 sticky top-20">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Service Provider</h2>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-lg font-bold text-slate-950">
                {service.provider.displayName.charAt(0)}
              </div>
              <div>
                <Link
                  href={`/profile/${service.provider.username}`}
                  className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                >
                  {service.provider.displayName}
                </Link>
                {service.provider.verificationStatus === 'verified' && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <ShieldCheck className="w-3 h-3" /> PU Verified
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-950/60 rounded-xl p-2">
                <div className="flex items-center justify-center gap-0.5 text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span className="text-xs font-bold text-white">{service.provider.avgRating}</span>
                </div>
                <p className="text-[9px] text-slate-500">{service.provider.reviewCount} reviews</p>
              </div>
              <div className="bg-slate-950/60 rounded-xl p-2">
                <p className="text-xs font-bold text-white">{service.provider.completedServices}</p>
                <p className="text-[9px] text-slate-500">Done</p>
              </div>
              <div className="bg-slate-950/60 rounded-xl p-2">
                <p className="text-xs font-bold text-white text-[10px]">{service.provider.responseTime}</p>
                <p className="text-[9px] text-slate-500">Reply</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Link href={`/chat`}>
                <Button className="w-full gap-2 text-sm">
                  <MessageSquare className="w-4 h-4" /> Chat with Provider
                </Button>
              </Link>
              <Button variant="outline" className="w-full gap-2 text-xs">
                <Wrench className="w-3.5 h-3.5" /> Request Service
              </Button>
              <Button variant="ghost" className="w-full gap-2 text-xs">
                <Heart className="w-3.5 h-3.5" /> Save Service
              </Button>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button className="w-full text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center justify-center gap-1 py-1">
                <Flag className="w-3.5 h-3.5" /> Report service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="py-24 text-center text-slate-500 text-sm">
        Loading service details...
      </div>
    }>
      <ServiceDetailContent params={params} />
    </Suspense>
  );
}
