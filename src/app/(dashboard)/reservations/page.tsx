'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar, MapPin, ShieldCheck, Clock, MessageSquare,
  AlertTriangle, CheckCircle2, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ReservationItem {
  id: string;
  listingId: string;
  listingTitle: string;
  agreedPrice: number;
  role: 'buyer' | 'seller';
  counterpart: {
    displayName: string;
    username: string;
    verificationStatus: string;
  };
  pickupZone: {
    name: string;
    description: string;
  };
  meetupDate: string;
  meetupTimeWindow: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

const MOCK_RESERVATIONS: ReservationItem[] = [
  {
    id: 'res-1',
    listingId: 'listing-1',
    listingTitle: 'Introduction to Algorithms — CLRS 3rd Edition',
    agreedPrice: 480,
    role: 'buyer',
    counterpart: {
      displayName: 'Rahul Menon',
      username: 'rahul_mca',
      verificationStatus: 'verified',
    },
    pickupZone: {
      name: 'Ananda Rangapillai Central Library',
      description: 'High-visibility entrance foyer with CCTV monitoring and security desk.',
    },
    meetupDate: 'Tomorrow, Oct 9',
    meetupTimeWindow: '01:00 PM - 03:00 PM (Post-lunch)',
    status: 'confirmed',
  },
  {
    id: 'res-2',
    listingId: 'listing-2',
    listingTitle: 'Adjustable Study Chair (Mesh Back)',
    agreedPrice: 950,
    role: 'seller',
    counterpart: {
      displayName: 'Sneha Roy',
      username: 'sneha_cs',
      verificationStatus: 'verified',
    },
    pickupZone: {
      name: 'Boys Hostel Complex Security Desk',
      description: 'Well-lit central security gate area.',
    },
    meetupDate: 'Friday, Oct 11',
    meetupTimeWindow: '05:00 PM - 07:00 PM (Evening)',
    status: 'confirmed',
  },
];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r))
    );
    setCancellingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Campus Meetup Reservations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Confirmed student exchanges scheduled at verified Pondicherry University safe zones.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-3.5 h-3.5" /> Campus Safe Zones Only
        </div>
      </div>

      {/* Safety Guidelines Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-semibold">
          <AlertTriangle className="w-4 h-4" />
          <span>Campus Exchange Protocol</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Always meet at the designated pickup zone during your daylight window. Inspect the item thoroughly in person before completing the exchange. Never share bank PINs or passwords.
        </p>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {reservations.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <Calendar className="w-12 h-12 text-slate-700 mx-auto" />
            <h2 className="text-base font-semibold text-slate-300">No scheduled meetups</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When you accept an offer or agree to a meetup time, your scheduled exchange will appear here.
            </p>
          </div>
        ) : (
          reservations.map((res) => {
            const isConfirmed = res.status === 'confirmed';
            return (
              <div
                key={res.id}
                className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4 hover:border-slate-700 transition-all shadow-xl"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {res.role === 'buyer' ? 'Buying' : 'Selling'}
                      </span>
                      <h2 className="text-base font-bold text-white">{res.listingTitle}</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Exchange with{' '}
                      <Link
                        href={`/profile/${res.counterpart.username}`}
                        className="text-emerald-400 font-medium hover:underline"
                      >
                        {res.counterpart.displayName}
                      </Link>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-emerald-400">₹{res.agreedPrice}</p>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isConfirmed
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                      }`}
                    >
                      {isConfirmed ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Confirmed
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Cancelled
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Meetup Details Card */}
                <div className="grid sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold text-slate-300">Date & Window:</span>
                    </div>
                    <p className="text-white font-medium pl-5">{res.meetupDate}</p>
                    <p className="text-slate-400 pl-5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {res.meetupTimeWindow}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      <span className="font-semibold text-slate-300">Designated Safe Zone:</span>
                    </div>
                    <p className="text-white font-medium pl-5">{res.pickupZone.name}</p>
                    <p className="text-slate-500 text-[10px] pl-5">{res.pickupZone.description}</p>
                  </div>
                </div>

                {/* Actions */}
                {isConfirmed && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <Link href={`/chat`}>
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <MessageSquare className="w-3.5 h-3.5" /> Open Chat
                      </Button>
                    </Link>

                    {cancellingId === res.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-rose-400 font-medium">Cancel meetup?</span>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancel(res.id)}
                          className="text-xs"
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCancellingId(null)}
                          className="text-xs"
                        >
                          Keep
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCancellingId(res.id)}
                        className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
