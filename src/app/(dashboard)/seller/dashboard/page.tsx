import Link from 'next/link';
import { PlusCircle, Package, Eye, Pencil, Pause, Trash2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';

type ListingStatus = 'active' | 'paused' | 'reserved' | 'sold' | 'expired';

interface DashboardListing {
  id: string;
  title: string;
  price: number;
  status: ListingStatus;
  views: number;
  createdAt: string;
  category: string;
}

const STATUS_CONFIG: Record<ListingStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'Active', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800' },
  paused: { label: 'Paused', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800' },
  reserved: { label: 'Reserved', bg: 'bg-sky-50 border-sky-200', text: 'text-sky-800' },
  sold: { label: 'Sold', bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700' },
  expired: { label: 'Expired', bg: 'bg-rose-50 border-rose-200', text: 'text-rose-800' },
};

const MOCK_LISTINGS: DashboardListing[] = [
  { id: 'calc-101', title: 'Introduction to Algorithms — CLRS 3rd Ed.', price: 480, status: 'active', views: 34, createdAt: '2026-10-01', category: 'Books' },
  { id: 'l-2', title: 'Adjustable Study Chair (Used 1 Year)', price: 950, status: 'reserved', views: 71, createdAt: '2026-09-20', category: 'Furniture' },
  { id: 'l-3', title: 'Casio Scientific Calculator fx-991ES Plus', price: 320, status: 'sold', views: 88, createdAt: '2026-09-10', category: 'Electronics' },
];

export default function SellerDashboardPage() {
  const activeCount = MOCK_LISTINGS.filter((l) => l.status === 'active').length;
  const reservedCount = MOCK_LISTINGS.filter((l) => l.status === 'reserved').length;
  const soldCount = MOCK_LISTINGS.filter((l) => l.status === 'sold').length;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <BackButton fallbackUrl="/" />
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Seller Dashboard</h1>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Pondicherry University Verified Seller
          </div>
        </div>
        <Link href="/listings/new">
          <Button className="gap-2 text-xs">
            <PlusCircle className="w-4 h-4" /> Post New Listing
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs">
          <p className="text-3xl font-extrabold text-emerald-700">{activeCount}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Active Listings</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs">
          <p className="text-3xl font-extrabold text-sky-700">{reservedCount}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Reserved Items</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs">
          <p className="text-3xl font-extrabold text-slate-700">{soldCount}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Completed Sales</p>
        </div>
      </div>

      {/* Listings Table / Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">My Listings ({MOCK_LISTINGS.length})</h2>
        </div>

        {MOCK_LISTINGS.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Package className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No listings posted yet</p>
            <p className="text-xs text-slate-500">Create your first listing to start selling to fellow PU students.</p>
            <Link href="/listings/new" className="inline-block pt-2">
              <Button size="sm" className="gap-2">
                <PlusCircle className="w-4 h-4" /> Post First Listing
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {MOCK_LISTINGS.map((listing) => {
              const sc = STATUS_CONFIG[listing.status];
              return (
                <div key={listing.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/80 transition-colors">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <Package className="w-5 h-5 stroke-[2]" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/listings/${listing.id}`}
                      className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1"
                    >
                      {listing.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border ${sc.bg} ${sc.text}`}>
                        {sc.label}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{listing.category}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-0.5">
                        <Eye className="w-3.5 h-3.5" /> {listing.views} views
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <p className="text-base font-extrabold text-emerald-700 shrink-0">
                    ₹{listing.price.toLocaleString('en-IN')}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/listings/${listing.id}`}>
                      <button
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="View Listing"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    {listing.status === 'active' && (
                      <>
                        <button
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-xl text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                          title="Pause Listing"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
