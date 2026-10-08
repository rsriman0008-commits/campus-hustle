import { describe, it, expect } from 'vitest';
import {
  createOfferSchema,
  respondOfferSchema,
  createReservationSchema,
  isValidOfferTransition,
  isValidReservationTransition,
} from '@/lib/validation/offers';

describe('Offers & Reservations Validation Unit Tests', () => {
  const VALID_UUID_1 = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const VALID_UUID_2 = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
  const VALID_UUID_3 = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';

  describe('Create Offer Schema', () => {
    it('accepts valid offer creation input', () => {
      const result = createOfferSchema.safeParse({
        conversationId: VALID_UUID_1,
        listingId: VALID_UUID_2,
        sellerId: VALID_UUID_3,
        amount: 400,
        message: 'Can pick up tomorrow!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects zero or negative offer amounts', () => {
      const result = createOfferSchema.safeParse({
        conversationId: VALID_UUID_1,
        listingId: VALID_UUID_2,
        sellerId: VALID_UUID_3,
        amount: 0,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Respond to Offer Schema', () => {
    it('accepts valid accept response', () => {
      const result = respondOfferSchema.safeParse({
        offerId: VALID_UUID_1,
        response: 'accept',
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid counter response with amount', () => {
      const result = respondOfferSchema.safeParse({
        offerId: VALID_UUID_1,
        response: 'counter',
        counterAmount: 450,
        message: 'Lowest I can do is ₹450',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Create Reservation Schema', () => {
    it('accepts valid reservation for today/future date and valid time window', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);
      const dateStr = futureDate.toISOString().split('T')[0];

      const result = createReservationSchema.safeParse({
        listingId: VALID_UUID_1,
        sellerId: VALID_UUID_2,
        pickupZoneId: VALID_UUID_3,
        meetupDate: dateStr,
        meetupTimeWindow: '01:00 PM - 03:00 PM (Post-lunch)',
      });
      expect(result.success).toBe(true);
    });

    it('rejects past meetup date', () => {
      const result = createReservationSchema.safeParse({
        listingId: VALID_UUID_1,
        sellerId: VALID_UUID_2,
        pickupZoneId: VALID_UUID_3,
        meetupDate: '2020-01-01',
        meetupTimeWindow: '01:00 PM - 03:00 PM (Post-lunch)',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('today or in the future');
      }
    });
  });

  describe('Offer State Machine Transitions', () => {
    it('allows transitions from sent to countered, accepted, or rejected', () => {
      expect(isValidOfferTransition('sent', 'countered')).toBe(true);
      expect(isValidOfferTransition('sent', 'accepted')).toBe(true);
      expect(isValidOfferTransition('sent', 'rejected')).toBe(true);
      expect(isValidOfferTransition('sent', 'withdrawn')).toBe(true);
    });

    it('rejects invalid transitions from rejected', () => {
      expect(isValidOfferTransition('rejected', 'accepted')).toBe(false);
      expect(isValidOfferTransition('rejected', 'countered')).toBe(false);
    });
  });

  describe('Reservation State Machine Transitions', () => {
    it('allows valid transitions from pending to confirmed or cancelled', () => {
      expect(isValidReservationTransition('pending', 'confirmed')).toBe(true);
      expect(isValidReservationTransition('pending', 'cancelled')).toBe(true);
      expect(isValidReservationTransition('confirmed', 'completed')).toBe(true);
    });

    it('rejects transitions from completed', () => {
      expect(isValidReservationTransition('completed', 'pending')).toBe(false);
      expect(isValidReservationTransition('completed', 'cancelled')).toBe(false);
    });
  });
});
