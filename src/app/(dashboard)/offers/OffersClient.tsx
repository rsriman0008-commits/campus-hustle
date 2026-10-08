'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Inbox,
  MessageSquare,
  X,
  ArrowRight
} from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';

interface Offer {
  id: string;
  direction: 'sent' | 'received';
  listingTitle: string;
  listingImage: string;
  listingId: string;
  offerAmount: number;
  originalPrice: number;
  otherParty: string;
  status: OfferStatus;
  time: string;
  message?: string;
  counterAmount?: number;
}

const INITIAL_OFFERS: Offer[] = [
  {
    id: 'o1',
    direction: 'received',
    listingTitle: 'Engineering Mathematics Vol 2',
    listingImage: '📚',
    listingId: 'book-202',
    offerAmount: 350,
    originalPrice: 480,
    otherParty: 'Riya M.',
    status: 'pending',
    time: '5 min ago',
    message: "I need it urgently before tomorrow's exam!",
  },
  {
    id: 'o2',
    direction: 'sent',
    listingTitle: 'Casio fx-991ES Plus Calculator',
    listingImage: '🖩',
    listingId: 'calc-101',
    offerAmount: 600,
    originalPrice: 750,
    otherParty: 'Deepak R.',
    status: 'countered',
    time: '1 hr ago',
    message: '',
    counterAmount: 680,
  },
  {
    id: 'o3',
    direction: 'sent',
    listingTitle: 'Data Structures by Cormen',
    listingImage: '📖',
    listingId: 'listing-303',
    offerAmount: 500,
    originalPrice: 550,
    otherParty: 'Arun S.',
    status: 'accepted',
    time: 'Yesterday',
    message: '',
  },
  {
    id: 'o4',
    direction: 'received',
    listingTitle: 'Physics Lab Coat (XL)',
    listingImage: '🥼',
    listingId: 'coat-404',
    offerAmount: 80,
    originalPrice: 200,
    otherParty: 'Meena T.',
    status: 'rejected',
    time: '2 days ago',
    message: 'Best price?',
  },
];

const statusConfig: Record<OfferStatus, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  pending: { label: 'Pending Response', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', icon: Clock },
  accepted: { label: 'Offer Accepted', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon: CheckCircle2 },
  rejected: { label: 'Offer Declined', bg: 'bg-rose-50 border-rose-200', text: 'text-rose-800', icon: XCircle },
  countered: { label: 'Counter-Offered', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon: Tag },
  expired: { label: 'Expired', bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', icon: Clock },
};

export default function OffersClient() {
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [counterModalOffer, setCounterModalOffer] = useState<Offer | null>(null);
  const [counterInput, setCounterInput] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleAccept = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'accepted' } : o))
    );
    const target = offers.find((o) => o.id === offerId);
    showNotification(`Accepted offer from ${target?.otherParty || 'buyer'}! Tap below to open chat.`);
  };

  const handleDecline = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'rejected' } : o))
    );
    showNotification('Offer declined.');
  };

  const handleOpenCounter = (offer: Offer) => {
    setCounterModalOffer(offer);
    setCounterInput(String(Math.round((offer.offerAmount + offer.originalPrice) / 2)));
  };

  const handleSubmitCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterModalOffer) return;
    const amount = Number(counterInput);
    if (isNaN(amount) || amount <= 0) return;

    setOffers((prev) =>
      prev.map((o) =>
        o.id === counterModalOffer.id
          ? { ...o, status: 'countered', counterAmount: amount }
          : o
      )
    );
    showNotification(`Counteroffer of ₹${amount} sent to ${counterModalOffer.otherParty}!`);
    setCounterModalOffer(null);
  };

  const received = offers.filter((o) => o.direction === 'received');
  const sent = offers.filter((o) => o.direction === 'sent');
  const pendingCount = received.filter((o) => o.status === 'pending').length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      {/* Toast banner */}
      {toastMsg && (
        <div className="p-3 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-between animate-in fade-in">
          <span>✓ {toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="p-1 hover:bg-emerald-800 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Back nav */}
      <BackButton fallbackUrl="/" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Offers & Negotiation</h1>
        <p className="text-xs text-slate-500 mt-1">
          {pendingCount > 0
            ? `${pendingCount} offer${pendingCount > 1 ? 's' : ''} waiting for your response`
            : 'Track all your sent and received offers'}
        </p>
      </div>

      {/* Received Offers */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
          <Inbox className="w-3.5 h-3.5 text-emerald-600" /> Received Offers ({received.length})
        </h2>

        {received.map((offer) => {
          const sc = statusConfig[offer.status];
          const StatusIcon = sc.icon;
          const discount = Math.round(
            ((offer.originalPrice - offer.offerAmount) / offer.originalPrice) * 100
          );

          return (
            <div
              key={offer.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                  {offer.listingImage}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-0.5">
                        {offer.otherParty} offered you:
                      </p>
                      <Link
                        href={`/listings/${offer.listingId}`}
                        className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1"
                      >
                        {offer.listingTitle}
                      </Link>
                    </div>
                    <span
                      className={`shrink-0 flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${sc.bg} ${sc.text}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {sc.label}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2.5 mt-2">
                    <span className="text-xl font-extrabold text-emerald-700">₹{offer.offerAmount}</span>
                    <span className="text-xs text-slate-400 line-through">₹{offer.originalPrice}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      -{discount}% OFF
                    </span>
                  </div>

                  {offer.message && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                      &ldquo;{offer.message}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* DYNAMIC ACTIONS FOR PENDING RECEIVED OFFERS */}
              {offer.status === 'pending' && (
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleAccept(offer.id)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accept Offer
                  </button>

                  <button
                    onClick={() => handleOpenCounter(offer)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Counter
                  </button>

                  <button
                    onClick={() => handleDecline(offer.id)}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              )}

              {/* ACCEPTED STATE DIRECT CHAT LINK */}
              {offer.status === 'accepted' && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    ✓ Offer Accepted!
                  </span>
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat & Arrange Meetup <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* COUNTERED STATE */}
              {offer.status === 'countered' && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-700">
                    You counter-offered ₹{offer.counterAmount}
                  </span>
                  <Link
                    href="/chat"
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 underline flex items-center gap-1"
                  >
                    Chat in inbox <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Sent Offers */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-blue-600" /> Sent Offers ({sent.length})
        </h2>

        {sent.map((offer) => {
          const sc = statusConfig[offer.status];
          const StatusIcon = sc.icon;

          return (
            <div
              key={offer.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                  {offer.listingImage}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-0.5">
                        You offered to {offer.otherParty}:
                      </p>
                      <Link
                        href={`/listings/${offer.listingId}`}
                        className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1"
                      >
                        {offer.listingTitle}
                      </Link>
                    </div>
                    <span
                      className={`shrink-0 flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${sc.bg} ${sc.text}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {sc.label}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-lg font-bold text-slate-900">₹{offer.offerAmount}</span>
                    <span className="text-xs text-slate-400 line-through">₹{offer.originalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={`/listings/${offer.listingId}`}
                  className="font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
                >
                  View listing details <ChevronRight className="w-3 h-3" />
                </Link>
                <Link
                  href="/chat"
                  className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  Open Chat
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* COUNTEROFFER MODAL */}
      {counterModalOffer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitCounter}
            className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Counteroffer to {counterModalOffer.otherParty}
              </h3>
              <button
                type="button"
                onClick={() => setCounterModalOffer(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p><span className="font-bold">Item:</span> {counterModalOffer.listingTitle}</p>
              <p><span className="font-bold">Listed Price:</span> ₹{counterModalOffer.originalPrice}</p>
              <p><span className="font-bold">Their Offer:</span> ₹{counterModalOffer.offerAmount}</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Your Counter Price (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={counterInput}
                onChange={(e) => setCounterInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 text-sm font-bold rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCounterModalOffer(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
              >
                Send Counteroffer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
