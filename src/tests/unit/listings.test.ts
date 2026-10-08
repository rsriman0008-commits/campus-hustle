import { describe, it, expect } from 'vitest';
import {
  itemListingSchema,
  serviceListingSchema,
  isValidStatusTransition,
  MAX_IMAGES_PER_LISTING,
  MAX_IMAGE_SIZE_BYTES,
} from '@/lib/validation/listings';

describe('Listing Validation Unit Tests', () => {
  // Valid v4 UUIDs required by Zod's uuid() validator
  const VALID_CATEGORY_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const VALID_ZONE_ID = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

  describe('Item Listing Schema', () => {
    it('accepts valid item listing input', () => {
      const result = itemListingSchema.safeParse({
        title: 'CLRS Algorithms 3rd Edition',
        categoryId: VALID_CATEGORY_ID,
        condition: 'good',
        description: 'Used for one semester, minor pencil annotations, all pages intact',
        price: 480,
        pricingModel: 'negotiable',
        pickupZoneId: VALID_ZONE_ID,
      });
      expect(result.success).toBe(true);
    });

    it('rejects title that is too short', () => {
      const result = itemListingSchema.safeParse({
        title: 'AB',
        categoryId: VALID_CATEGORY_ID,
        condition: 'good',
        description: 'Used for one semester',
        price: 100,
        pickupZoneId: VALID_ZONE_ID,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 3 characters');
      }
    });

    it('rejects negative price', () => {
      const result = itemListingSchema.safeParse({
        title: 'Valid Title Here',
        categoryId: VALID_CATEGORY_ID,
        condition: 'new',
        description: 'A valid description here with enough characters',
        price: -100,
        pickupZoneId: VALID_ZONE_ID,
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid UUID for categoryId', () => {
      const result = itemListingSchema.safeParse({
        title: 'Valid Title Here',
        categoryId: 'not-a-valid-uuid',
        condition: 'good',
        description: 'A valid description here with enough characters',
        price: 100,
        pickupZoneId: VALID_ZONE_ID,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Listing Status Transitions', () => {
    it('allows valid transitions from active', () => {
      expect(isValidStatusTransition('active', 'paused')).toBe(true);
      expect(isValidStatusTransition('active', 'reserved')).toBe(true);
      expect(isValidStatusTransition('active', 'sold')).toBe(true);
    });

    it('rejects invalid transition from sold', () => {
      expect(isValidStatusTransition('sold', 'active')).toBe(false);
      expect(isValidStatusTransition('sold', 'reserved')).toBe(false);
    });

    it('rejects invalid transition from expired', () => {
      expect(isValidStatusTransition('expired', 'active')).toBe(false);
    });

    it('allows draft to active only', () => {
      expect(isValidStatusTransition('draft', 'active')).toBe(true);
      expect(isValidStatusTransition('draft', 'sold')).toBe(false);
    });
  });

  describe('Image Upload Constraints', () => {
    it('enforces maximum images per listing', () => {
      expect(MAX_IMAGES_PER_LISTING).toBe(5);
    });

    it('enforces maximum image size', () => {
      expect(MAX_IMAGE_SIZE_BYTES).toBe(5 * 1024 * 1024);
    });
  });

  describe('Service Listing Schema', () => {
    it('accepts valid service listing input', () => {
      const result = serviceListingSchema.safeParse({
        title: 'Python & DSA Tutoring for MCA Students',
        categoryId: VALID_CATEGORY_ID,
        description: 'Experienced MCA student offering tutoring for Python programming and data structures',
        price: 200,
        pricingModel: 'hourly',
        serviceMode: 'in_person',
      });
      expect(result.success).toBe(true);
    });

    it('rejects negative price', () => {
      const result = serviceListingSchema.safeParse({
        title: 'Web Development Help',
        categoryId: VALID_CATEGORY_ID,
        description: 'Helping with website development tasks for students',
        price: -50,
        pricingModel: 'fixed',
        serviceMode: 'online',
      });
      expect(result.success).toBe(false);
    });
  });
});

