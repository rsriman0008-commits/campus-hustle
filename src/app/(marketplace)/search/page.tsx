import { Suspense } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowUpDown, BookOpen, Laptop, Sofa, Shirt, GraduationCap, Package } from 'lucide-react';

const CATEGORY_FILTERS = [
  { slug: 'all', label: 'All' },
  { slug: 'books-textbooks', label: 'Books', icon: BookOpen },
  { slug: 'electronics', label: 'Electronics', icon: Laptop },
  { slug: 'furniture-hostel', label: 'Furniture', icon: Sofa },
  { slug: 'clothing', label: 'Clothing', icon: Shirt },
  { slug: 'tutoring-services', label: 'Tutoring', icon: GraduationCap },
];

const MOCK_RESULTS = [
  { id: 'l-1', title: 'Introduction to Algorithms — CLRS 3rd Ed.', price: 480, condition: 'good', category: 'Books', status: 'active', seller: 'Rahul M.', zone: 'Central Library' },
  { id: 'l-2', title: 'Adjustable Laptop Stand (Aluminium)', price: 650, condition: 'like_new', category: 'Electronics', status: 'active', seller: 'Priya K.', zone: 'Admin Block' },
  { id: 'l-3', title: 'Study Chair — Mesh Back', price: 950, condition: 'good', category: 'Furniture', status: 'active', seller: 'Arjun T.', zone: 'Boys Hostel Gate' },
  { id: 'l-4', title: 'Python Crash Course (2nd Ed.)', price: 200, condition: 'fair', category: 'Books', status: 'active', seller: 'Sneha R.', zone: 'Science Canteen' },
  { id: 'l-5', title: 'JBL Earbuds (Type-C)', price: 850, condition: 'like_new', category: 'Electronics', status: 'reserved', seller: 'Vikram D.', zone: 'Central Library' },
  { id: 'l-6', title: 'DSA Tutoring — 5 Sessions Bundle', price: 750, condition: null, category: 'Tutoring', status: 'active', seller: 'Ananya R.', zone: 'Online' },
];

const CONDITION_LABELS: Record<string, string> = {
  new: 'New', like_new: 'Like New', good: 'Good', fair: 'Fair',
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: 'Available', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  reserved: { label: 'Reserved', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
};

async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; condition?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? '';
  const activeCategory = params.category ?? 'all';
  const sort = params.sort ?? 'newest';

  const filtered = MOCK_RESULTS.filter((l) => {
    if (activeCategory !== 'all' && l.category.toLowerCase() !== activeCategory) return false;
    if (query && !l.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORY_FILTERS.map((cat) => (
          <Link
            key={cat.slug}
            href={`/search?q=${query}&category=${cat.slug}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
              activeCategory === cat.slug
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          {query && <> for &quot;<span className="text-white">{query}</span>&quot;</>}
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              className="bg-transparent text-xs text-slate-300 focus:outline-none"
              defaultValue={sort}
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
          <button className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 hover:border-slate-700 transition-all">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </button>
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-700 mx-auto" />
          <p className="text-base font-semibold text-slate-300">No listings found</p>
          <p className="text-xs text-slate-500">Try a different search term or remove some filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((listing) => {
            const sc = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG.active;
            return (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="group bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-slate-950/50 transition-all"
              >
                <div className="aspect-[4/3] bg-slate-800/60 flex items-center justify-center group-hover:bg-slate-800 transition-all">
                  <Package className="w-10 h-10 text-slate-600" />
                </div>

                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.color}`}>
                      {sc.label}
                    </span>
                    <span className="text-[10px] text-slate-500">{listing.category}</span>
                  </div>

                  <p className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                    {listing.title}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-emerald-400">
                      ₹{listing.price.toLocaleString('en-IN')}
                    </span>
                    {listing.condition && (
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                        {CONDITION_LABELS[listing.condition]}
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 truncate">
                    📍 {listing.zone} · by {listing.seller}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; condition?: string; minPrice?: string; maxPrice?: string }>;
}) {
  return (
    <div className="py-6 space-y-5">
      <form method="GET" action="/search" className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          name="q"
          type="text"
          placeholder="Search textbooks, electronics, tutoring, furniture..."
          className="w-full pl-12 pr-28 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all">
          Search
        </button>
      </form>

      <Suspense fallback={
        <div className="py-16 text-center text-slate-500 text-sm">
          Loading listings...
        </div>
      }>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
