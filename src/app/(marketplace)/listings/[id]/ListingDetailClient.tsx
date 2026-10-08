'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, MapPin, MessageSquare, Heart, Flag, Tag, Package,
  Clock, Star, AlertTriangle, X
} from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

interface Seller {
  displayName: string;
  username: string;
  verificationStatus: string;
  avgRating: number;
  reviewCount: number;
  completedTransactions: number;
  responseTime: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  pricingModel: string;
  condition: string;
  status: string;
  category: string;
  pickupZone: string;
  seller: Seller;
}

export default function ListingDetailClient({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState(String(Math.round(listing.price * 0.9)));
  const [offerMsg, setOfferMsg] = useState('');
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleChatWithSeller = () => {
    // Redirect directly to chat page with pre-filled context
    router.push(`/chat?listingId=${listing.id}&seller=${encodeURIComponent(listing.seller.displayName)}`);
  };

  const handleMakeOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(offerPrice);
    if (isNaN(amount) || amount <= 0) return;

    setIsSubmittingOffer(true);
    setTimeout(() => {
      setIsSubmittingOffer(false);
      setShowOfferModal(false);
      setToast(`Offer of ₹${amount} sent to ${listing.seller.displayName}! Redirecting to offers...`);
      setTimeout(() => {
        router.push('/offers');
      }, 1200);
    }, 500);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    setToast(!isSaved ? 'Listing saved to your saved items!' : 'Removed from saved items.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <BackButton fallbackUrl="/" />
      {/* Toast Notification */}
      {toast && (
        <div className="p-3 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-between animate-in fade-in">
          <span>✓ {toast}</span>
          <button onClick={() => setToast(null)} className="p-1 hover:bg-emerald-800 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: Image & Details left, Seller Card right */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left (3 cols): Media & Details */}
        <div className="lg:col-span-3 space-y-4">
          {/* Main Photo Box */}
          <div className="aspect-[4/3] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-slate-600 relative">
            <Package className="w-16 h-16 stroke-[1.5]" />
            <span className="text-xs text-slate-500 font-medium mt-2">Campus Verified Listing Photo</span>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Available
            </span>
            <span className="text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
              {listing.category}
            </span>
            <span className="text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
              Good Condition
            </span>
          </div>

          {/* Title & Price */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">{listing.title}</h1>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-emerald-700">₹{listing.price}</span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                🏷️ Negotiable
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</h2>
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{listing.description}</p>
          </div>

          {/* Pickup Zone */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Campus Pickup Zone</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">{listing.pickupZone}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                All meetups happen at safe, CCTV-monitored public campus locations.
              </p>
            </div>
          </div>

          {/* Safety Box */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>Always meet at the designated campus zone during daylight hours. Never share personal phone numbers or home addresses.</span>
          </div>
        </div>

        {/* Right (2 cols): Seller Profile & Action Buttons */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 sticky top-20">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seller Profile</h2>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-lg font-bold">
                {listing.seller.displayName.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{listing.seller.displayName}</h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> PU Verified Student
                </div>
              </div>
            </div>

            {/* Seller Ratings */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                <div className="flex items-center justify-center gap-0.5 text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                  <span className="text-xs font-bold text-slate-900">{listing.seller.avgRating}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{listing.seller.reviewCount} reviews</p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                <p className="text-xs font-extrabold text-slate-900">{listing.seller.completedTransactions}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Deals Done</p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                <div className="flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{listing.seller.responseTime}</p>
              </div>
            </div>

            {/* WORKING ACTION BUTTONS */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {/* 1. Chat with Seller */}
              <button
                onClick={handleChatWithSeller}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" /> Chat with Seller
              </button>

              {/* 2. Make an Offer */}
              <button
                onClick={() => setShowOfferModal(true)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" /> Make an Offer
              </button>

              {/* 3. Save Listing */}
              <button
                onClick={toggleSave}
                className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 stroke-rose-600' : ''}`} />
                {isSaved ? 'Saved to Wishlist' : 'Save Listing'}
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button className="w-full text-[11px] font-medium text-slate-400 hover:text-rose-600 transition-colors flex items-center justify-center gap-1 py-1">
                <Flag className="w-3 h-3" /> Report this listing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAKE AN OFFER MODAL */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleMakeOfferSubmit}
            className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" /> Make an Offer
              </h3>
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
              <p><span className="font-bold text-slate-700">Listing:</span> {listing.title}</p>
              <p><span className="font-bold text-slate-700">Original Price:</span> ₹{listing.price}</p>
              <p><span className="font-bold text-slate-700">Seller:</span> {listing.seller.displayName}</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Your Offer Price (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                max={listing.price * 2}
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 text-sm font-bold rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Optional Message for Seller
              </label>
              <input
                type="text"
                placeholder="e.g. Can collect today near library!"
                value={offerMsg}
                onChange={(e) => setOfferMsg(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 text-slate-900 text-xs font-medium rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingOffer}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmittingOffer ? 'Sending...' : 'Submit Offer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
