'use client';

import { useState } from 'react';
import { ShoppingBag, Store, Wrench, Package, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';

type HistoryTab = 'purchases' | 'sales' | 'services';
type TxStatus = 'completed' | 'cancelled' | 'pending' | 'disputed';

interface HistoryEntry {
  id: string;
  title: string;
  agreedPrice: number;
  status: TxStatus;
  date: string;
  counterpart: string;
  pickupZone: string;
  reviewDone: boolean;
}

const MOCK_PURCHASES: HistoryEntry[] = [
  { id: 'tx-1', title: 'Data Structures & Algorithms (2nd Ed.)', agreedPrice: 280, status: 'completed', date: '2026-09-20', counterpart: 'Rahul M.', pickupZone: 'Central Library Foyer', reviewDone: true },
  { id: 'tx-2', title: 'Mechanical Keyboard (60%)', agreedPrice: 1400, status: 'completed', date: '2026-09-05', counterpart: 'Priya K.', pickupZone: 'Science Complex Canteen', reviewDone: false },
  { id: 'tx-3', title: 'Python Crash Course Book', agreedPrice: 150, status: 'cancelled', date: '2026-08-18', counterpart: 'Arjun T.', pickupZone: 'Admin Building Foyer', reviewDone: false },
];

const MOCK_SALES: HistoryEntry[] = [
  { id: 'tx-4', title: 'Office Chair (Adjustable)', agreedPrice: 950, status: 'completed', date: '2026-09-28', counterpart: 'Sneha R.', pickupZone: 'Boys Hostel Gate', reviewDone: true },
  { id: 'tx-5', title: 'Scientific Calculator (Casio FX)', agreedPrice: 320, status: 'completed', date: '2026-09-10', counterpart: 'Vikram D.', pickupZone: 'Central Library Foyer', reviewDone: true },
];

const MOCK_SERVICES: HistoryEntry[] = [
  { id: 'tx-6', title: 'Web Dev Tutoring — 3 Sessions', agreedPrice: 600, status: 'completed', date: '2026-09-15', counterpart: 'Aditya P.', pickupZone: 'Online', reviewDone: false },
];

const statusConfig: Record<TxStatus, { label: string; icon: React.ReactNode; color: string }> = {
  completed: { label: 'Completed', icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  cancelled: { label: 'Cancelled', icon: <XCircle className="w-3.5 h-3.5" />, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  pending: { label: 'Pending', icon: <Clock className="w-3.5 h-3.5" />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  disputed: { label: 'Disputed', icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
};

function HistoryCard({ entry, showReviewPrompt }: { entry: HistoryEntry; showReviewPrompt?: boolean }) {
  const sc = statusConfig[entry.status];
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white truncate">{entry.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">with {entry.counterpart} · {entry.date}</p>
        </div>
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.color}`}>
          {sc.icon} {sc.label}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-lg font-bold text-white">₹{entry.agreedPrice.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <Package className="w-3 h-3" /> {entry.pickupZone}
          </p>
        </div>

        <div className="flex gap-2">
          {showReviewPrompt && entry.status === 'completed' && !entry.reviewDone && (
            <button className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all">
              Leave Review
            </button>
          )}
          {entry.status === 'completed' && entry.reviewDone && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Reviewed
            </span>
          )}
          <button className="text-xs text-slate-500 hover:text-rose-400 transition-colors px-2 py-1.5 rounded-xl hover:bg-rose-500/10">
            Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<HistoryTab>('purchases');

  const tabs: { key: HistoryTab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'purchases', label: 'Purchases', icon: <ShoppingBag className="w-4 h-4" />, count: MOCK_PURCHASES.length },
    { key: 'sales', label: 'Sales', icon: <Store className="w-4 h-4" />, count: MOCK_SALES.length },
    { key: 'services', label: 'Services', icon: <Wrench className="w-4 h-4" />, count: MOCK_SERVICES.length },
  ];

  const dataMap: Record<HistoryTab, HistoryEntry[]> = {
    purchases: MOCK_PURCHASES,
    sales: MOCK_SALES,
    services: MOCK_SERVICES,
  };

  const entries = dataMap[activeTab];

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Transaction History</h1>
        <p className="text-xs text-slate-400 mt-1">
          Your complete private history. This data is never shared publicly — only you can see this page.
        </p>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
        <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>This page is <span className="text-emerald-400 font-semibold">strictly private</span>. Public profiles only show aggregate counts (e.g. &quot;14 completed transactions&quot;) — never individual details.</span>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-2xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-xl transition-all ${
              activeTab === tab.key
                ? 'bg-slate-800 text-emerald-400 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* History Entries */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-10 text-center">
            <Package className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-400">No {activeTab} yet</p>
            <p className="text-xs text-slate-600 mt-1">Completed transactions will appear here.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <HistoryCard
              key={entry.id}
              entry={entry}
              showReviewPrompt={activeTab === 'purchases'}
            />
          ))
        )}
      </div>
    </div>
  );
}
