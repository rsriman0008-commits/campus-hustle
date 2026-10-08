'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { REVIEW_TAGS } from '@/lib/validation/reviews';

interface ReviewFormProps {
  searchParams: Promise<{ transactionId?: string }>;
}

export default function ReviewForm({ searchParams }: ReviewFormProps) {
  const router = useRouter();
  const params = use(searchParams);
  const transactionId = params.transactionId || 'tx-1';

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Item Exactly As Described',
    'Prompt & Punctual Meetup',
  ]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 5) return;
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setErrorMsg('Please select a star rating between 1 and 5');
      return;
    }

    setIsSubmitting(true);
    // In production: submitReviewAction({ transactionId, ... })
    console.info('Submitting review for transaction:', transactionId);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/history');
    }, 600);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to History
        </button>
        <h1 className="text-2xl font-bold text-white">Leave a Verified Review</h1>
        <p className="text-xs text-slate-400">
          Your feedback helps build trusted student reputations on campus.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
        </div>
      )}

      {/* Exchange Summary Pill */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
        <div>
          <p className="font-semibold text-white">Completed Exchange with Rahul M.</p>
          <p className="text-slate-400 text-[11px] mt-0.5">CLRS Algorithms 3rd Edition · ₹480</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
          <ShieldCheck className="w-3.5 h-3.5" /> Verified Transaction
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Star Rating Selector */}
        <div className="space-y-2 text-center py-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
            Overall Rating *
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold text-amber-400">
            {rating === 5 ? '5.0 — Exceptional Experience' :
             rating === 4 ? '4.0 — Very Good' :
             rating === 3 ? '3.0 — Average' :
             rating === 2 ? '2.0 — Below Expectations' : '1.0 — Poor'}
          </p>
        </div>

        {/* 2. Feedback Tag Chips */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
            Feedback Highlights <span className="text-slate-500 font-normal">(Select up to 5)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {REVIEW_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Written Comment */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
            Public Review Comments
          </label>
          <textarea
            rows={4}
            placeholder="Share details about the meetup, condition of item, and overall experience..."
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
          />
          <p className="text-[10px] text-slate-500 text-right">{comment.length}/1000</p>
        </div>

        {/* Privacy Note */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
          Reviews are associated with verified transactions to prevent fake feedback. Your university identity stays safe and private.
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full text-sm">
          Submit Verified Review
        </Button>
      </form>
    </div>
  );
}
