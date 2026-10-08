import { describe, it, expect } from 'vitest';
import { submitReviewSchema, computeTrustBadges } from '@/lib/validation/reviews';

describe('Reviews & Trust Badges Unit Tests', () => {
  const VALID_UUID_1 = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const VALID_UUID_2 = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

  describe('Submit Review Validation', () => {
    it('accepts valid 5-star review with tags and comment', () => {
      const result = submitReviewSchema.safeParse({
        transactionId: VALID_UUID_1,
        revieweeId: VALID_UUID_2,
        rating: 5,
        tags: ['Item Exactly As Described', 'Prompt & Punctual Meetup'],
        comment: 'Great exchange at Central Library. Book was in mint condition!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects rating below 1 or above 5', () => {
      expect(
        submitReviewSchema.safeParse({
          transactionId: VALID_UUID_1,
          revieweeId: VALID_UUID_2,
          rating: 0,
        }).success
      ).toBe(false);

      expect(
        submitReviewSchema.safeParse({
          transactionId: VALID_UUID_1,
          revieweeId: VALID_UUID_2,
          rating: 6,
        }).success
      ).toBe(false);
    });

    it('rejects non-integer ratings', () => {
      expect(
        submitReviewSchema.safeParse({
          transactionId: VALID_UUID_1,
          revieweeId: VALID_UUID_2,
          rating: 4.5,
        }).success
      ).toBe(false);
    });
  });

  describe('Trust Badge Computation Engine', () => {
    it('awards Verified PU Student badge when verified', () => {
      const badges = computeTrustBadges({
        verificationStatus: 'verified',
        avgRating: 0,
        reviewCount: 0,
        completedTransactions: 0,
      });

      expect(badges.some((b) => b.id === 'verified_pu')).toBe(true);
    });

    it('awards Top Rated badge when review count >= 5 and rating >= 4.5', () => {
      const badges = computeTrustBadges({
        verificationStatus: 'verified',
        avgRating: 4.8,
        reviewCount: 12,
        completedTransactions: 15,
      });

      expect(badges.some((b) => b.id === 'top_rated')).toBe(true);
      expect(badges.some((b) => b.id === 'power_trader')).toBe(true);
    });

    it('does not award Top Rated badge if review count is below 5', () => {
      const badges = computeTrustBadges({
        verificationStatus: 'verified',
        avgRating: 5.0,
        reviewCount: 3, // insufficient reviews
        completedTransactions: 3,
      });

      expect(badges.some((b) => b.id === 'top_rated')).toBe(false);
    });
  });
});
