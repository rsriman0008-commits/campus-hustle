'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Search, Trash2, Package, ArrowRight, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';

type SavedTab = 'listings' | 'searches';

interface SavedListing {
  id: string;
  title: string;
  price: number;
  category: string;
  seller: string;
  status: 'active' | 'reserved' | 'sold';
  zone: string;
}

interface SavedSearch {
  id: string;
  query: string;
  category: string;
  maxPrice: number;
  alertEnabled: boolean;
  createdAt: string;
}

const MOCK_SAVED_LISTINGS: SavedListing[] = [
  { id: 'calc-101', title: 'Casio fx-991ES Plus Scientific Calculator', price: 900, category: 'Electronics', seller: 'Arun S.', status: 'active', zone: 'Central Library Entrance' },
  { id: 'book-202', title: 'Engineering Mathematics Vol 2 (HK Dass)', price: 350, category: 'Books', seller: 'Priya M.', status: 'active', zone: 'Student Union Gate' },
];

const MOCK_SAVED_SEARCHES: SavedSearch[] = [
  { id: 's-1', query: 'Scientific Calculator', category: 'Electronics', maxPrice: 500, alertEnabled: true, createdAt: '2 days ago' },
  { id: 's-2', query: 'Python Tutoring', category: 'Tutoring', maxPrice: 300, alertEnabled: true, createdAt: '1 week ago' },
];

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState<SavedTab>('listings');
  const [listings, setListings] = useState(MOCK_SAVED_LISTINGS);
  const [searches, setSearches] = useState(MOCK_SAVED_SEARCHES);

  const removeListing = (id: string) => {
    setListings(listings.filter((l) => l.id !== id));
  };

  const removeSearch = (id: string) => {
    setSearches(searches.filter((s) => s.id !== id));
  };

  const toggleAlert = (id: string) => {
    setSearches(
      searches.map((s) => (s.id === id ? { ...s, alertEnabled: !s.alertEnabled } : s))
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <BackButton fallbackUrl="/" />
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Saved Items & Searches
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">Keep track of items you want and set alerts for new campus listings.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'listings'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Heart className="w-3.5 h-3.5" /> Saved Listings ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('searches')}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'searches'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-3.5 h-3.5" /> Saved Searches ({searches.length})
        </button>
      </div>

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <div className="space-y-3">
          {listings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
              <Package className="w-10 h-10 text-slate-400 mx-auto" />
              <h2 className="text-sm font-bold text-slate-800">No saved listings</h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Tap the heart icon on any listing card to save it for quick access later.
              </p>
              <Link href="/search" className="inline-block pt-2">
                <Button size="sm" className="gap-1.5 text-xs">
                  Browse Listings <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          ) : (
            listings.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <Link href={`/listings/${item.id}`} className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors truncate block">
                      {item.title}
                    </Link>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      📍 {item.zone} · by {item.seller}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-base font-extrabold text-emerald-700">₹{item.price}</span>
                  <button
                    onClick={() => removeListing(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Searches Tab */}
      {activeTab === 'searches' && (
        <div className="space-y-3">
          {searches.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
              <Search className="w-10 h-10 text-slate-400 mx-auto" />
              <h2 className="text-sm font-bold text-slate-800">No saved searches</h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Save your frequent search queries to receive alerts when new matching items are posted.
              </p>
            </div>
          ) : (
            searches.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/search?q=${encodeURIComponent(s.query)}`} className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors truncate">
                      &ldquo;{s.query}&rdquo;
                    </Link>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md border border-slate-200">{s.category}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Max price: ₹{s.maxPrice} · Saved {s.createdAt}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAlert(s.id)}
                    className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      s.alertEnabled
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" /> {s.alertEnabled ? 'Alerts On' : 'Alerts Off'}
                  </button>
                  <button
                    onClick={() => removeSearch(s.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
