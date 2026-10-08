import Link from 'next/link';
import {
  ShieldAlert, Users, Package, FileText, CheckCircle2,
  Clock, ArrowRight, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const STATS = [
  { label: 'Pending Reports', value: 3, icon: ShieldAlert, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { label: 'Verified Students', value: '1,248', icon: Users, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Active Listings', value: '412', icon: Package, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
  { label: 'Safe Meetups', value: '890', icon: CheckCircle2, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
];

const RECENT_REPORTS = [
  {
    id: 'rep-1',
    type: 'listing',
    title: 'Duplicate / Spam Textbook Listing',
    reporter: 'ananya_cs',
    target: 'Introduction to Algorithms copy',
    reason: 'Duplicate listing spamming search results',
    time: '25 mins ago',
    status: 'pending',
  },
  {
    id: 'rep-2',
    type: 'user',
    title: 'No-Show at Central Library Safe Zone',
    reporter: 'rahul_mca',
    target: 'vikram_phy',
    reason: 'Buyer failed to appear during scheduled daylight window',
    time: '2 hours ago',
    status: 'under_review',
  },
  {
    id: 'rep-3',
    type: 'message',
    title: 'Requested off-platform contact information',
    reporter: 'sneha_r',
    target: 'arjun_t',
    reason: 'Attempted to move chat to external non-verified phone line',
    time: 'Yesterday',
    status: 'pending',
  },
];

const RECENT_AUDIT_LOGS = [
  { id: 'aud-1', actor: 'campus_admin_1', action: 'Approved verified domain: pondiuni.ac.in', time: '1 hour ago' },
  { id: 'aud-2', actor: 'moderator_2', action: 'Resolved report #rep-92 (Inappropriate pricing)', time: '3 hours ago' },
  { id: 'aud-3', actor: 'campus_admin_1', action: 'Added safe pickup zone: Science Complex Canteen', time: 'Yesterday' },
];

export default function AdminDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> Campus Admin Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pondicherry University Moderation, Safety Oversight & Academic Settings.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/reports">
            <Button size="sm" className="gap-1.5 text-xs">
              <ShieldAlert className="w-3.5 h-3.5" /> Moderation Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${s.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Moderation Queue Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-bold text-white">Pending Moderation Queue</h2>
          </div>
          <Link href="/admin/reports" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
            View all reports <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-slate-800/60">
          {RECENT_REPORTS.map((rep) => (
            <div key={rep.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-800/30 transition-all">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {rep.type}
                  </span>
                  <p className="font-semibold text-sm text-white truncate">{rep.title}</p>
                </div>
                <p className="text-xs text-slate-400">{rep.reason}</p>
                <p className="text-[10px] text-slate-500">
                  Reported by <strong className="text-slate-400">@{rep.reporter}</strong> against <strong className="text-slate-400">{rep.target}</strong> · {rep.time}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href="/admin/reports">
                  <Button size="sm" variant="outline" className="text-xs">
                    Review
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Audit Log Stream */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-400" />
          <h2 className="text-sm font-bold text-white">Recent Privileged Audit Logs</h2>
        </div>

        <div className="space-y-2">
          {RECENT_AUDIT_LOGS.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 truncate">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-emerald-400 font-mono text-[11px]">{log.actor}</span>
                <span className="text-slate-300 truncate">{log.action}</span>
              </div>
              <span className="text-slate-500 text-[10px] shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
