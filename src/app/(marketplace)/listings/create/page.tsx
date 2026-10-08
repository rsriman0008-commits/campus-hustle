'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Package, Tag, MapPin, AlertCircle, ArrowRight, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const CATEGORIES = [
  { id: 'cat-books', name: 'Books & Textbooks' },
  { id: 'cat-electronics', name: 'Electronics & Gadgets' },
  { id: 'cat-furniture', name: 'Furniture & Hostel Essentials' },
  { id: 'cat-clothing', name: 'Clothing & Apparel' },
  { id: 'cat-tickets', name: 'Event Tickets & Passes' },
  { id: 'cat-other', name: 'Other Permitted Items' },
];

const CONDITIONS = [
  { value: 'new', label: 'New', desc: 'Unused, sealed if applicable' },
  { value: 'like_new', label: 'Like New', desc: 'Used once or twice, perfect condition' },
  { value: 'good', label: 'Good', desc: 'Minor signs of use, fully functional' },
  { value: 'fair', label: 'Fair', desc: 'Visible wear, works as expected' },
];

const PICKUP_ZONES = [
  { id: 'zone-library', name: 'Central Library Foyer' },
  { id: 'zone-gate', name: 'Silver Jubilee Gate Security Foyer' },
  { id: 'zone-canteen', name: 'Science Complex Canteen' },
  { id: 'zone-admin', name: 'Administrative Building Foyer' },
  { id: 'zone-girls-hostel', name: 'Girls Hostel Security Desk' },
  { id: 'zone-boys-hostel', name: 'Boys Hostel Security Desk' },
];

interface ImagePreview {
  url: string;
  name: string;
  size: number;
  error?: string;
}

export default function CreateItemListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<ImagePreview[]>([]);

  // Form state
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [pickupZoneId, setPickupZoneId] = useState('');

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    const newPreviews: ImagePreview[] = files.map((f) => {
      if (!allowed.includes(f.type)) return { url: '', name: f.name, size: f.size, error: 'Invalid type. Use JPEG, PNG, or WebP.' };
      if (f.size > maxSize) return { url: '', name: f.name, size: f.size, error: 'File exceeds 5MB limit.' };
      return { url: URL.createObjectURL(f), name: f.name, size: f.size };
    });

    setImages((prev) => [...prev, ...newPreviews].slice(0, 5));
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !categoryId || !condition || !description.trim() || !price || !pickupZoneId) {
      setError('Please complete all required fields');
      return;
    }
    if (parseFloat(price) < 0) {
      setError('Price cannot be negative');
      return;
    }
    setIsSubmitting(true);
    // In production: call createItemListingAction server action via form action
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    router.push('/seller/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Post an Item for Sale</h1>
        <p className="text-xs text-slate-400 mt-1">Sell textbooks, electronics, furniture, or any permitted campus item.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-400" /> Photos <span className="text-slate-500 font-normal">(up to 5)</span>
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-800 group">
                {img.error ? (
                  <div className="w-full h-full bg-rose-950/40 flex items-center justify-center p-1">
                    <span className="text-[9px] text-rose-400 text-center">{img.error}</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-950/80 text-slate-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="aspect-square rounded-xl border border-dashed border-slate-700 hover:border-emerald-500 flex items-center justify-center cursor-pointer transition-all bg-slate-900/40 hover:bg-emerald-950/20">
                <div className="flex flex-col items-center gap-1 text-slate-500">
                  <Upload className="w-4 h-4" />
                  <span className="text-[9px]">Add</span>
                </div>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={handleImageAdd} />
              </label>
            )}
          </div>
          <p className="text-[10px] text-slate-500">JPEG, PNG, WebP only · Max 5MB per image · First image is the cover</p>
        </div>

        {/* Basic Info */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" /> Item Details
          </h2>

          <Input
            label="Item Title *"
            placeholder="e.g. Introduction to Algorithms (3rd Ed.) — Thomas Cormen"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            helperText={`${title.length}/120 characters`}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 tracking-wide uppercase">Category *</label>
            <select
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 tracking-wide uppercase">Condition *</label>
            <div className="grid grid-cols-2 gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCondition(c.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    condition === c.value
                      ? 'border-emerald-500 bg-emerald-950/40 text-white'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-semibold">{c.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 tracking-wide uppercase">Description *</label>
            <textarea
              rows={4}
              placeholder="Describe the item honestly — edition, included extras, reason for selling, any damage..."
              className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-800 text-slate-100 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <p className="text-[10px] text-slate-500 text-right">{description.length}/2000</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" /> Pricing
          </h2>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <Input
                label="Asking Price (₹) *"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 450"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="pt-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setIsNegotiable(!isNegotiable)}
                  className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${isNegotiable ? 'bg-emerald-600' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${isNegotiable ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-xs text-slate-400 group-hover:text-slate-300">Negotiable</span>
              </label>
            </div>
          </div>
        </div>

        {/* Pickup Zone */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" /> Campus Pickup Zone *
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {PICKUP_ZONES.map((zone) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => setPickupZoneId(zone.id)}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  pickupZoneId === zone.id
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                {zone.name}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            Only safe campus zones are listed. Exact personal addresses are not supported.
          </p>
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full gap-2 text-sm">
          Publish Listing <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
