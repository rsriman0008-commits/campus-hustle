'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Camera, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BackButton } from '@/components/ui/BackButton';

const SERVICE_TYPES = [
  'Tutoring & Exam Prep',
  'Hostel Tech Support & OS Formatting',
  'Assignment & Project Help',
  'Graphic Design & Poster Creation',
  'Lab Practical Support',
  'Language Translation & Proofreading',
  'Other Student Service',
];

const SERVICE_LOCATIONS = [
  'Central Library & Online (Google Meet)',
  'Hostel Common Room / Study Area',
  'Science Complex Foyer',
  'Student Union Discussion Zone',
  'Online Only (Remote Support)',
];

export default function CreateServiceListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State for Service Seller Requirements
  const [serviceType, setServiceType] = useState('Tutoring & Exam Prep');
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Central Library & Online (Google Meet)');
  const [price, setPrice] = useState('250');
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.length < 3) {
      setErrorMsg('Please enter a service title (at least 3 characters).');
      return;
    }
    if (!overview.trim()) {
      setErrorMsg('Please enter a quick service overview summary.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please enter complete service scope & experience details.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg('Please enter a valid rate/price in ₹.');
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
            <Wrench className="w-5 h-5 text-sky-600" /> Offer a Student Service
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specify type of service, description, location, rate, overview &amp; optional banner image.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Type of Service */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Type of Service *
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {SERVICE_TYPES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Title */}
          <Input
            label="Service Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Python & Data Structures 1-on-1 Tutoring"
            helperText="Clear title highlighting your core skill"
          />

          {/* 3. Overview */}
          <Input
            label="Quick Overview *"
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="e.g. Personalized coding sessions covering Python, trees, and exam questions"
            helperText="Shown in service cards across campus feed"
          />

          {/* 4. Full Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Service Scope &amp; Experience Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Taught by 2nd year MCA student with 9.4 CGPA. Includes practice problems, code reviews, and flexible scheduling."
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* 5. Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Location / Mode *
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {SERVICE_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  📍 {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Pricing */}
          <Input
            label="Rate / Price (₹ per hour or flat rate) *"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="250"
            helperText="Hourly or flat rate for students"
          />

          {/* 7. Image Option */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Service Banner Photo Option
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center space-y-2 bg-slate-50">
              <Camera className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600">
                {imageUploaded ? '✓ Banner image attached' : 'Upload custom poster or work sample (optional)'}
              </p>
              <button
                type="button"
                onClick={() => setImageUploaded((v) => !v)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {imageUploaded ? 'Remove Image' : 'Attach Sample Banner'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" variant="blue" className="w-full gap-2 mt-4" isLoading={isSubmitting}>
            Post Service Listing <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
