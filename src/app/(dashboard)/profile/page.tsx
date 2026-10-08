'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Star, History, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';

interface SellingRecord {
  id: string;
  title: string;
  price: number;
  buyer: string;
  date: string;
  type: 'item' | 'service';
  status: 'Completed' | 'In Progress';
}

interface BuyingRecord {
  id: string;
  title: string;
  price: number;
  seller: string;
  date: string;
  pickupZone: string;
  status: 'Completed' | 'Reserved';
}

const MOCK_SELLING_HISTORY: SellingRecord[] = [
  {
    id: 's-1',
    title: 'Casio Scientific Calculator fx-991ES',
    price: 900,
    buyer: 'Riya M. (Maths Dept)',
    date: '04 Oct 2026',
    type: 'item',
    status: 'Completed',
  },
  {
    id: 's-2',
    title: 'Python & Data Structures 1-on-1 Tutoring (2 hrs)',
    price: 500,
    buyer: 'Anand K. (CS Dept)',
    date: '01 Oct 2026',
    type: 'service',
    status: 'Completed',
  },
];

const MOCK_BUYING_HISTORY: BuyingRecord[] = [
  {
    id: 'b-1',
    title: 'Engineering Mathematics Vol 2 (HK Dass)',
    price: 350,
    seller: 'Priya M. (Maths Dept)',
    date: '02 Oct 2026',
    pickupZone: 'Central Library Entrance',
    status: 'Completed',
  },
  {
    id: 'b-2',
    title: 'Chemistry Lab Coat (Size L)',
    price: 180,
    seller: 'Ananya V. (Chem Dept)',
    date: '28 Sep 2026',
    pickupZone: 'Science Block Gate',
    status: 'Completed',
  },
];

export default function ProfilePage() {
  const [activeDashboardTab, setActiveDashboardTab] = useState<'selling' | 'buying'>('selling');

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Back nav */}
      <BackButton fallbackUrl="/" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Profile & Activity</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Your Pondicherry University account overview, verified credentials, and exchange history.
        </p>
      </div>

      {/* SECTION 1: PERSONAL & VERIFICATION DETAILS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl font-bold">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Arun Kumar</h2>
                <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> PU Verified
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                24301001@pondiuni.edu.in
              </p>
              <p className="text-xs text-slate-600 mt-1 italic">
                &ldquo;2nd year M.Tech CS student. Selling books, calculators, and offering Python tutoring.&rdquo;
              </p>
            </div>
          </div>

          <Link href="/onboarding">
            <Button variant="outline" size="sm">
              Edit Details
            </Button>
          </Link>
        </div>

        {/* Trust Passport Stats */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-center">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Trust Passport</span>
            <span className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> 4.9 / 5.0
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Exchanges Done</span>
            <span className="text-sm font-bold text-emerald-700 mt-0.5 block">12 Deals</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Response Time</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">~1 Hour</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: ACADEMIC DETAILS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
          <GraduationCap className="w-4 h-4 text-emerald-600" /> Academic Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-800">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-0.5">School</span>
            School of Engineering & Technology
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-0.5">Department</span>
            Department of Computer Science
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-0.5">Course / Programme</span>
            M.Tech Computer Science & Engineering
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-0.5">Year of Study & Graduation</span>
            Year 2 (Expected Graduation: 2026)
          </div>
        </div>
      </div>

      {/* SECTION 3: DASHBOARD (SELLING HISTORY & BUYING HISTORY) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <History className="w-4 h-4 text-slate-600" /> Campus Activity Dashboard
          </h2>

          {/* Dashboard Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveDashboardTab('selling')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                activeDashboardTab === 'selling'
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Selling History ({MOCK_SELLING_HISTORY.length})
            </button>
            <button
              onClick={() => setActiveDashboardTab('buying')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                activeDashboardTab === 'buying'
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Buying History ({MOCK_BUYING_HISTORY.length})
            </button>
          </div>
        </div>

        {/* TAB 1: SELLING HISTORY */}
        {activeDashboardTab === 'selling' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Private record of items you have sold or services provided on campus.
            </p>
            {MOCK_SELLING_HISTORY.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                      {item.type === 'item' ? 'Item Sold' : 'Service Delivered'}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">{item.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{item.title}</h4>
                  <p className="text-xs text-slate-600">Sold to: {item.buyer}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-sm font-extrabold text-emerald-700">
                    +₹{item.price}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">✓ {item.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: BUYING HISTORY */}
        {activeDashboardTab === 'buying' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Private record of items and services you have purchased on campus.
            </p>
            {MOCK_BUYING_HISTORY.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200">
                      Purchased
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">{item.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{item.title}</h4>
                  <p className="text-xs text-slate-600">Seller: {item.seller}</p>
                  <p className="text-[11px] text-slate-500">Zone: {item.pickupZone}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-sm font-bold text-slate-900">
                    -₹{item.price}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">✓ {item.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
