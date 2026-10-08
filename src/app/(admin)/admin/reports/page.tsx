'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert, CheckCircle2, XCircle, ArrowLeft,
  AlertTriangle, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ReportItem {
  id: string;
  targetType: 'listing' | 'user' | 'message';
  targetId: string;
  targetName: string;
  reporterName: string;
  reason: string;
  details: string;
  time: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

const MOCK_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    targetType: 'listing',
    targetId: 'l-9',
    targetName: 'Duplicate / Spam Textbook Listing (Introduction to Algorithms)',
    reporterName: 'ananya_cs',
    reason: 'Duplicate listing spamming search results',
    details: 'User has posted the exact same book 4 times under slightly modified titles.',
    time: '25 mins ago',
    status: 'pending',
  },
  {
    id: 'rep-2',
    targetType: 'user',
    targetId: 'u-12',
    targetName: 'vikram_phy (Vikram Das)',
    reporterName: 'rahul_mca',
    reason: 'Buyer failed to show up at Central Library safe zone',
    details: 'Scheduled for 1 PM yesterday, never showed up and blocked in chat.',
    time: '2 hours ago',
    status: 'pending',
  },
  {
    id: 'rep-3',
    targetType: 'message',
    targetId: 'm-44',
    targetName: 'Message from arjun_t',
    reporterName: 'sneha_r',
    reason: 'Attempted to solicit off-platform direct contact',
    details: 'Requested personal WhatsApp number instead of using campus chat.',
    time: 'Yesterday',
    status: 'pending',
  },
];

export default function ModerationQueuePage() {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [filterType, setFilterType] = useState<string>('all');
  const [feedback, setFeedback] = useState<string>('');

  const handleResolve = (reportId: string, resolution: 'resolved' | 'dismissed', actionText: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: resolution } : r))
    );
    setFeedback(`Report #${reportId} marked as ${resolution}: ${actionText}`);
    setTimeout(() => setFeedback(''), 4000);
  };

  const filtered = reports.filter((r) => {
    if (filterType === 'all') return true;
    return r.targetType === filterType;
  });

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" /> Moderation Action Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review reported campus listings, message violations, and user conduct.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-2xl text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {['all', 'listing', 'user', 'message'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl font-medium capitalize transition-all ${
                filterType === type
                  ? 'bg-slate-800 text-emerald-400 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {feedback}
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {filtered.map((rep) => {
          const isPending = rep.status === 'pending';
          return (
            <div
              key={rep.id}
              className={`bg-slate-900/70 border rounded-3xl p-6 backdrop-blur-xl space-y-4 transition-all shadow-xl ${
                isPending ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      {rep.targetType}
                    </span>
                    <h2 className="text-base font-bold text-white">{rep.targetName}</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Reported by <strong className="text-slate-300">@{rep.reporterName}</strong> · {rep.time}
                  </p>
                </div>

                <span
                  className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                    rep.status === 'pending'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      : rep.status === 'resolved'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                      : 'text-slate-400 bg-slate-500/10 border-slate-700'
                  }`}
                >
                  {rep.status}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-rose-400 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Violation: {rep.reason}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{rep.details}</p>
              </div>

              {isPending && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResolve(rep.id, 'dismissed', 'Report dismissed (no violation found)')}
                    className="text-xs"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Dismiss
                  </Button>

                  {rep.targetType === 'listing' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleResolve(rep.id, 'resolved', 'Listing removed from marketplace')}
                      className="text-xs"
                    >
                      Remove Listing
                    </Button>
                  )}

                  {rep.targetType === 'user' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleResolve(rep.id, 'resolved', 'User issued temporary suspension')}
                      className="text-xs"
                    >
                      Suspend User
                    </Button>
                  )}

                  {rep.targetType === 'message' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleResolve(rep.id, 'resolved', 'User issued formal safety warning')}
                      className="text-xs"
                    >
                      Issue Warning
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
