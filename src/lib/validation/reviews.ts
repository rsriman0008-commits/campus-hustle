import { z } from 'zod';

export const REVIEW_TAGS = [
  'Item Exactly As Described',
  'Prompt & Punctual Meetup',
  'Polite & Friendly',
  'Great Communication',
  'Fair Pricing',
  'Smooth Safe Zone Exchange',
  'Highly Recommended',
] as const;

export const submitReviewSchema = z.object({
  transactionId: z.string().uuid('Invalid transaction ID'),
  revieweeId: z.string().uuid('Invalid reviewee ID'),
  rating: z
    .number('Rating must be a number')
    .min(1, 'Minimum rating is 1 star')
    .max(5, 'Maximum rating is 5 stars')
    .int('Rating must be an integer'),
  tags: z.array(z.string()).max(5, 'Select up to 5 feedback tags').default([]),
  comment: z
    .string()
    .max(1000, 'Comment cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
});

export interface UserMetrics {
  verificationStatus: string;
  avgRating: number;
  reviewCount: number;
  completedTransactions: number;
  responseTime?: string;
  sellerType?: string;
}

export interface TrustBadge {
  id: string;
  label: string;
  description: string;
  icon: 'shield' | 'star' | 'bolt' | 'award' | 'users';
  color: string;
}

export function computeTrustBadges(metrics: UserMetrics): TrustBadge[] {
  const badges: TrustBadge[] = [];

  // 1. Campus Affiliation Badge
  if (metrics.verificationStatus === 'verified') {
    badges.push({
      id: 'verified_pu',
      label: 'Verified PU Student',
      description: 'Affiliation verified via official Pondicherry University credentials',
      icon: 'shield',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    });
  }

  // 2. Rating Badge
  if (metrics.reviewCount >= 5 && metrics.avgRating >= 4.5) {
    badges.push({
      id: 'top_rated',
      label: 'Top Rated (4.5+ ★)',
      description: `Maintained a ${metrics.avgRating.toFixed(1)} rating across ${metrics.reviewCount} student reviews`,
      icon: 'star',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    });
  }

  // 3. Milestone Badge
  if (metrics.completedTransactions >= 10) {
    badges.push({
      id: 'power_trader',
      label: 'Campus Power Trader',
      description: `Successfully completed ${metrics.completedTransactions}+ safe campus exchanges`,
      icon: 'award',
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    });
  }

  // 4. Response Time Badge
  if (metrics.responseTime === 'instant' || metrics.responseTime === 'within_few_hours') {
    badges.push({
      id: 'fast_responder',
      label: 'Fast Responder',
      description: 'Consistently replies to chat inquiries within a few hours',
      icon: 'bolt',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    });
  }

  // 5. Club / Organization Badge
  if (metrics.sellerType === 'club_organization') {
    badges.push({
      id: 'official_club',
      label: 'Campus Club / Society',
      description: 'Official student organization account approved for campus listings',
      icon: 'users',
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
    });
  }

  return badges;
}

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;
