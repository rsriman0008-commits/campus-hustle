import { Suspense } from 'react';
import Link from 'next/link';

import { Package, ArrowLeft, ArrowUpDown, SlidersHorizontal, BookOpen, Laptop, Sofa, Shirt, GraduationCap, Ticket, Code2, Palette } from 'lucide-react';

const CATEGORIES_MAP: Record<string, { name: string; icon: React.ElementType; description: string }> = {
  'books': { name: 'Books & Textbooks', icon: BookOpen, description: 'Course textbooks, reference books, lab manuals, and novels.' },
  'books-textbooks': { name: 'Books & Textbooks', icon: BookOpen, description: 'Course textbooks, reference books, lab manuals, and novels.' },
  'electronics': { name: 'Electronics & Gadgets', icon: Laptop, description: 'Calculators, laptops, headphones, chargers, and tech accessories.' },
  'furniture': { name: 'Furniture & Hostel Essentials', icon: Sofa, description: 'Study chairs, desks, lamps, mattresses, and hostel gear.' },
  'furniture-hostel': { name: 'Furniture & Hostel Essentials', icon: Sofa, description: 'Study chairs, desks, lamps, mattresses, and hostel gear.' },
  'clothing': { name: 'Clothing & Apparel', icon: Shirt, description: 'Lab coats, college jackets, traditional wear, and casual apparel.' },
  'tutoring': { name: 'Tutoring & Academic Services', icon: GraduationCap, description: 'Peer tutoring for Python, DSA, Physics, Chemistry, and Math.' },
  'tutoring-services': { name: 'Tutoring & Academic Services', icon: GraduationCap, description: 'Peer tutoring for Python, DSA, Physics, Chemistry, and Math.' },
  'tech-help': { name: 'Tech Help & Coding', icon: Code2, description: 'Software troubleshooting, web dev help, and project assistance.' },
  'design': { name: 'Design & Creative Services', icon: Palette, description: 'Poster design, presentation formatting, and video editing.' },
  'tickets': { name: 'Event Tickets & Passes', icon: Ticket, description: 'Campus fest passes, workshop tickets, and cultural events.' },
};

const MOCK_LISTINGS = [
  { id: 'l-1', title: 'Introduction to Algorithms — CLRS 3rd Ed.', price: 480, condition: 'good', category: 'books', type: 'item', seller: 'Rahul M.', zone: 'Central Library Foyer' },
  { id: 'l-2', title: 'Adjustable Laptop Stand (Aluminium)', price: 650, condition: 'like_new', category: 'electronics', type: 'swap', seller: 'Priya K.', zone: 'Admin Block' },
  { id: 'l-3', title: 'Study Chair — Mesh Back', price: 950, condition: 'good', category: 'furniture', type: 'item', seller: 'Arjun T.', zone: 'Boys Hostel Gate' },
  { id: 'l-4', title: 'Python Crash Course (2nd Ed.)', price: 200, condition: 'fair', category: 'books', type: 'item', seller: 'Sneha R.', zone: 'Science Canteen' },
  { id: 'l-5', title: 'JBL Earbuds (Type-C)', price: 850, condition: 'like_new', category: 'electronics', type: 'item', seller: 'Vikram D.', zone: 'Central Library Foyer' },
  { id: 'l-6', title: 'DSA Tutoring — 5 Sessions Bundle', price: 750, condition: null, category: 'tutoring', type: 'service', seller: 'Ananya R.', zone: 'Online / Library' },
];

async function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoryInfo = CATEGORIES_MAP[slug.toLowerCase()] || {
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    icon: Package,
    description: 'Browse campus items and services in this category.',
  };

  const Icon = categoryInfo.icon;
  const filtered = MOCK_LISTINGS.filter(
    (l) => l.category === slug.toLowerCase() || slug.toLowerCase().includes(l.category)
  );

  return (
    <div className="space-y-6 py-6">
      {/* Category Header */}
      <div className="space-y-2">
        <Link href="/search" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Search & Categories
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{categoryInfo.name}</h1>
            <p className="text-xs text-slate-400">{categoryInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <p className="text-xs text-slate-400">
          Showing <span className="text-white font-semibold">{filtered.length}</span> listing{filtered.length !== 1 ? 's' : ''} in Pondicherry University
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /> Sort: Newest
          </div>
          <button className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400 hover:border-slate-700">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-700 mx-auto" />
          <h2 className="text-base font-semibold text-slate-300">No listings in {categoryInfo.name} yet</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Be the first student to post a listing in this category for Pondicherry University!
          </p>
          <Link href="/listings/create" className="inline-block pt-2">
            <button className="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all">
              Post Listing
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={item.type === 'service' ? `/services/${item.id}` : `/listings/${item.id}`}
              className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 hover:shadow-xl transition-all space-y-3"
            >
              <div className="aspect-[4/3] bg-slate-800/60 rounded-xl flex items-center justify-center group-hover:bg-slate-800 transition-all">
                <Package className="w-10 h-10 text-slate-600" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.type}
                  </span>
                  <span className="text-sm font-black text-emerald-400">₹{item.price}</span>
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-400">📍 {item.zone} · by {item.seller}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={
      <div className="py-24 text-center text-slate-500 text-sm">
        Loading category listings...
      </div>
    }>
      <CategoryContent params={params} />
    </Suspense>
  );
}
