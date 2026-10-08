import { z } from 'zod';

export const OFFER_STATUSES = [
  'sent',
  'countered',
  'accepted',
  'rejected',
  'withdrawn',
  'expired',
  'cancelled',
] as const;

export const RESERVATION_STATUSES = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'expired',
] as const;

export const MEETUP_TIME_WINDOWS = [
  '09:00 AM - 11:00 AM (Morning)',
  '11:00 AM - 01:00 PM (Pre-lunch)',
  '01:00 PM - 03:00 PM (Post-lunch)',
  '03:00 PM - 05:00 PM (Afternoon)',
  '05:00 PM - 07:00 PM (Evening)',
] as const;

export const createOfferSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
  listingId: z.string().uuid('Invalid listing ID'),
  sellerId: z.string().uuid('Invalid seller ID'),
  amount: z
    .number('Offer amount must be a number')
    .min(1, 'Offer amount must be at least ₹1')
    .max(100000, 'Offer amount cannot exceed ₹1,00,000'),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
});

export const respondOfferSchema = z.object({
  offerId: z.string().uuid('Invalid offer ID'),
  response: z.enum(['accept', 'reject', 'counter', 'withdraw']),
  counterAmount: z
    .number('Counter amount must be a number')
    .min(1, 'Counter amount must be at least ₹1')
    .max(100000, 'Counter amount cannot exceed ₹1,00,000')
    .optional(),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
});

export const createReservationSchema = z.object({
  listingId: z.string().uuid('Invalid listing ID'),
  sellerId: z.string().uuid('Invalid seller ID'),
  offerId: z.string().uuid('Invalid offer ID').optional(),
  pickupZoneId: z.string().uuid('Please select a safe campus pickup zone'),
  meetupDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Meetup date must be in YYYY-MM-DD format')
    .refine((dateStr) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(dateStr);
      return selected >= today;
    }, { message: 'Meetup date must be today or in the future' }),
  meetupTimeWindow: z.enum([
    '09:00 AM - 11:00 AM (Morning)',
    '11:00 AM - 01:00 PM (Pre-lunch)',
    '01:00 PM - 03:00 PM (Post-lunch)',
    '03:00 PM - 05:00 PM (Afternoon)',
    '05:00 PM - 07:00 PM (Evening)',
  ], { message: 'Please select a valid campus daylight time window' }),
});

export const offerTransitions: Record<string, string[]> = {
  sent: ['countered', 'accepted', 'rejected', 'withdrawn', 'expired'],
  countered: ['countered', 'accepted', 'rejected', 'withdrawn', 'expired'],
  accepted: ['cancelled'],
  rejected: [],
  withdrawn: [],
  expired: [],
  cancelled: [],
};

export function isValidOfferTransition(from: string, to: string): boolean {
  const allowed = offerTransitions[from] ?? [];
  return allowed.includes(to);
}

export const reservationTransitions: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled', 'expired'],
  confirmed: ['completed', 'cancelled', 'expired'],
  completed: [],
  cancelled: [],
  expired: [],
};

export function isValidReservationTransition(from: string, to: string): boolean {
  const allowed = reservationTransitions[from] ?? [];
  return allowed.includes(to);
}

export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type RespondOfferInput = z.infer<typeof respondOfferSchema>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
