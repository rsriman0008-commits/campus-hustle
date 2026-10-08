'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User, Search, Filter, Bell, MessageSquare, Tag, PlusCircle,
  Package, Wrench, MapPin, ArrowRight, Grid, X, Sparkles
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Textbooks', slug: 'textbooks' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Furniture', slug: 'furniture' },
  { name: 'Lab Coats', slug: 'clothing' },
  { name: 'Tutoring', slug: 'tutoring' },
  { name: 'Tech Support', slug: 'tech' },
];

const MOCK_ITEMS = [
  {
    id: 'calc-101',
    title: 'Casio fx-991ES Plus Scientific Calculator',
    type: 'Electronics',
    overview: 'Dual powered 417-function scientific calculator required for engineering exams.',
    description: 'Perfect working condition. Used for 1 semester in M.Tech CS. Clear screen.',
    pickupZone: 'Central Library Entrance',
    price: 900,
    image: '🖩',
    seller: 'Arun S. (CS Dept)',
  },
  {
    id: 'book-202',
    title: 'Engineering Mathematics Vol 2 (HK Dass)',
    type: 'Textbooks',
    overview: 'Essential reference textbook for 2nd & 3rd semester engineering & maths students.',
    description: 'No torn pages. Minimal pencil highlighting. Includes solved question papers.',
    pickupZone: 'Student Union Gate',
    price: 350,
    image: '📚',
    seller: 'Priya M. (Maths Dept)',
  },
];

const MOCK_SERVICES = [
  {
    id: 'serv-201',
    title: 'Python & Data Structures 1-on-1 Tutoring',
    serviceType: 'Tutoring',
    overview: 'Personalized coding sessions covering Python basics, arrays, trees, and interview problems.',
    description: 'Taught by 2nd year MCA student with 9.4 CGPA. Flexible schedule.',
    location: 'Central Library or Online (Google Meet)',
    price: 250,
    unit: '/ hr',
    image: '💻',
    provider: 'Karthik R. (MCA Dept)',
  },
  {
    id: 'serv-202',
    title: 'Hostel Laptop OS & Software Formatting',
    serviceType: 'Tech Support',
    overview: 'Complete Windows/Linux installation, virus cleanup, and RAM upgrades.',
    description: 'Same-day service at hostel. Dual-boot Linux setup for lab practicals.',
    location: 'Subramania Bharati Hostel Block B',
    price: 300,
    unit: 'flat rate',
    image: '🛠️',
    provider: 'Deepak K. (IT Dept)',
  },
];

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'items' | 'services'>('all');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="space-y-8 pb-8">
      {/* Sleek Minimalist Hero Banner */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" /> Pondicherry University Verified Network
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Buy, sell & offer student services.<br />
              <span className="text-emerald-700">Safely inside Pondicherry University.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Connect with fellow PU students for textbooks, calculators, hostel gear, and tutoring. Safe meetup zones across campus.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            Post Listing / Service
          </button>
        </div>

        {/* Action Pills Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <Link
            href="/profile"
            className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-slate-600" /> My Profile
          </Link>

          <button
            onClick={() => setShowFilterDrawer(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Grid className="w-3.5 h-3.5 text-slate-600" /> Categories
          </button>

          <button
            onClick={() => setActiveTab('items')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'items'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> Items ({MOCK_ITEMS.length})
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'services'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" /> Services ({MOCK_SERVICES.length})
          </button>

          <Link
            href="/offers"
            className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1.5 border border-blue-200"
          >
            <Tag className="w-3.5 h-3.5" /> Offers & Swaps
          </Link>

          <Link
            href="/chat"
            className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 border border-emerald-200"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Chat Inbox
          </Link>

          <Link
            href="/notifications"
            className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5 text-slate-600" /> Notifications
          </Link>
        </div>
      </section>

      {/* Main Search Input & Category Pills */}
      <section className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search calculator, engineering maths, tutoring, tech help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-xl placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
            />
          </div>
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* FILTER DRAWER / MODAL */}
      {showFilterDrawer && (
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-emerald-600" /> Filter Options
            </h3>
            <button onClick={() => setShowFilterDrawer(false)} className="p-1 hover:bg-slate-100 rounded-lg">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-1 font-bold">Listing Type</label>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as 'all' | 'items' | 'services')}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
              >
                <option value="all">All Listings & Services</option>
                <option value="items">Items for Sale</option>
                <option value="services">Student Services</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-bold">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-bold">Max Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 1000"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: LIST OF ITEMS */}
      {(activeTab === 'all' || activeTab === 'items') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-600" /> Items for Sale
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              {MOCK_ITEMS.length} Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_ITEMS.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                        {item.type}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{item.title}</h3>
                    </div>
                    <span className="text-xl font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      ₹{item.price}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs border border-slate-100">
                    <p className="font-semibold text-slate-800"><span className="text-[10px] font-bold uppercase text-slate-400 block">Overview</span> {item.overview}</p>
                    <p className="text-slate-600">{item.description}</p>
                    <p className="font-bold text-emerald-700 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> Pickup Zone: {item.pickupZone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="font-semibold text-slate-600">Seller: {item.seller}</span>
                  <Link
                    href={`/listings/${item.id}`}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-xs"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: LIST OF SERVICES */}
      {(activeTab === 'all' || activeTab === 'services') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-sky-600" /> Student Services
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              {MOCK_SERVICES.length} Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_SERVICES.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                        {service.serviceType}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{service.title}</h3>
                    </div>
                    <span className="text-xl font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                      ₹{service.price} <span className="text-xs font-medium text-slate-500">{service.unit}</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs border border-slate-100">
                    <p className="font-semibold text-slate-800"><span className="text-[10px] font-bold uppercase text-slate-400 block">Overview</span> {service.overview}</p>
                    <p className="text-slate-600">{service.description}</p>
                    <p className="font-bold text-sky-700 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> Location: {service.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="font-semibold text-slate-600">Provider: {service.provider}</span>
                  <Link
                    href={`/services/${service.id}`}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-xs"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CREATE CHOICE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                What would you like to post?
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/listings/new"
                onClick={() => setShowCreateModal(false)}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all space-y-2 block text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs uppercase text-slate-900">Sell an Item</h4>
                <p className="text-[11px] text-slate-500">
                  Calculators, books, lab coats, furniture.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:underline pt-1">
                  Post Item <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/services/new"
                onClick={() => setShowCreateModal(false)}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-sky-500 hover:bg-sky-50/50 transition-all space-y-2 block text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                  <Wrench className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs uppercase text-slate-900">Offer a Service</h4>
                <p className="text-[11px] text-slate-500">
                  Tutoring, laptop repair, coding help.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:underline pt-1">
                  Post Service <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
