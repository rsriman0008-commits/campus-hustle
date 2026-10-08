import { z } from 'zod';

export const LISTING_STATUS = ['draft', 'active', 'reserved', 'sold', 'paused', 'expired'] as const;
export const LISTING_TYPES = ['item', 'service', 'rental'] as const;
export const PRICING_MODELS = ['fixed', 'negotiable', 'hourly', 'contact_for_price'] as const;
export const ITEM_CONDITIONS = ['new', 'like_new', 'good', 'fair'] as const;
export const MAX_IMAGES_PER_LISTING = 5;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const itemListingSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  categoryId: z.string().uuid('Please select a valid category'),
  condition: z.enum(['new', 'like_new', 'good', 'fair'], {
    message: 'Please select the item condition',
  }),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  price: z
    .number('Price must be a number')
    .min(0, 'Price cannot be negative')
    .max(100000, 'Price cannot exceed ₹1,00,000'),
  pricingModel: z.enum(['fixed', 'negotiable', 'hourly', 'contact_for_price']).default('fixed'),
  pickupZoneId: z.string().uuid('Please select a pickup zone'),
  availableUntil: z.string().optional(),
});

export const serviceListingSchema = z.object({
  title: z
    .string()
    .min(3, 'Service name must be at least 3 characters')
    .max(120, 'Service name cannot exceed 120 characters'),
  categoryId: z.string().uuid('Please select a valid category'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  price: z
    .number('Price must be a number')
    .min(0, 'Price cannot be negative')
    .max(50000, 'Price cannot exceed ₹50,000'),
  pricingModel: z.enum(['fixed', 'hourly', 'contact_for_price']).default('fixed'),
  serviceMode: z.enum(['in_person', 'online', 'hybrid']).default('in_person'),
  pickupZoneId: z.string().uuid('Please select a service zone').optional(),
  availability: z.string().max(200).optional(),
});

export const listingStatusTransitions: Record<string, string[]> = {
  draft: ['active'],
  active: ['paused', 'reserved', 'sold', 'expired'],
  paused: ['active', 'expired'],
  reserved: ['active', 'sold', 'expired'],
  sold: [],
  expired: [],
};

export function isValidStatusTransition(from: string, to: string): boolean {
  const allowed = listingStatusTransitions[from] ?? [];
  return allowed.includes(to);
}

export type ItemListingInput = z.infer<typeof itemListingSchema>;
export type ServiceListingInput = z.infer<typeof serviceListingSchema>;
