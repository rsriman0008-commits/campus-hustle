'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Camera, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BackButton } from '@/components/ui/BackButton';

const ITEM_TYPES = [
  'Electronics & Calculators',
  'Textbooks & Study Material',
  'Hostel Furniture & Lamp',
  'Lab Coats & Goggles',
  'Clothing & Accessories',
  'Sports & Fitness',
  'Other Campus Item',
];

const PICKUP_ZONES = [
  'Central Library Main Entrance',
  'Student Union Gate',
  'Subramania Bharati Hostel Block',
  'Science Block Gate',
  'Administrative Building',
  'Campus Cafeteria Zone',
];

export default function CreateItemListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State for Seller Requirements
  const [itemType, setItemType] = useState('Electronics & Calculators');
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [description, setDescription] = useState('');
  const [pickupZone, setPickupZone] = useState('Central Library Main Entrance');
  const [price, setPrice] = useState('900');
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.length < 3) {
      setErrorMsg('Please enter a descriptive item title (at least 3 characters).');
      return;
    }
    if (!overview.trim()) {
      setErrorMsg('Please enter a quick overview summary.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please enter full item condition details.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg('Please enter a valid price in ₹.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/');
    }, 600);
  };

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      <BackButton fallbackUrl="/" />

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" /> Sell an Item on Campus
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specify item type, title, overview, detailed condition, pickup zone &amp; photos.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Item Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Type of Item *
            </label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {ITEM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Title */}
          <Input
            label="Item Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Casio fx-991ES Plus Scientific Calculator"
            helperText="Clear title so buyers can find your item in search"
          />

          {/* 3. Overview */}
          <Input
            label="Quick Overview *"
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="e.g. Dual-powered 417-function calculator required for CS/EE exams"
            helperText="Short 1-line summary shown on search cards"
          />

          {/* 4. Full Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Detailed Description &amp; Condition *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Perfect working condition. Used for 1 semester in M.Tech CS. No scratches on screen. Comes with original slip lid."
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* 5. Pickup Zone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Pickup Zone (Safe Campus Meetup) *
            </label>
            <select
              value={pickupZone}
              onChange={(e) => setPickupZone(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {PICKUP_ZONES.map((z) => (
                <option key={z} value={z}>
                  📍 {z}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Selling Price */}
          <Input
            label="Price (₹) *"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="900"
            helperText="Fair campus pricing encourages faster offers"
          />

          {/* 7. Image Upload Option */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Item Photo Option
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center space-y-2 bg-slate-50">
              <Camera className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600">
                {imageUploaded ? '✓ Photo selected: calculator_front.jpg' : 'Upload photo of your item (optional for demo)'}
              </p>
              <button
                type="button"
                onClick={() => setImageUploaded((v) => !v)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {imageUploaded ? 'Remove Photo' : 'Attach Sample Photo'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" variant="primary" className="w-full gap-2 mt-4" isLoading={isSubmitting}>
            Post Item Listing <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
