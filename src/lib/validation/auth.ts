import { z } from 'zod';

export const APPROVED_EMAIL_DOMAINS = ['pondiuni.edu.in', 'pondiuni.ac.in'] as const;

export const emailSchema = z
  .string()
  .min(1, 'Email address is required')
  .email('Invalid email address format')
  .refine(
    (email) => {
      const domain = email.split('@')[1]?.toLowerCase();
      return domain ? APPROVED_EMAIL_DOMAINS.includes(domain as (typeof APPROVED_EMAIL_DOMAINS)[number]) : false;
    },
    {
      message: 'Registration is restricted strictly to Pondicherry University emails (@pondiuni.edu.in or @pondiuni.ac.in).',
    }
  );

export const registerSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export const basicProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name cannot exceed 50 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional()
    .or(z.literal('')),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
});

export const academicProfileSchema = z.object({
  schoolId: z.string().min(1, 'Please select your School'),
  departmentId: z.string().min(1, 'Please select your Department'),
  programmeId: z.string().min(1, 'Please select your Programme/Course'),
  yearOfStudy: z.number().min(1).max(6, 'Year of study must be between 1 and 6'),
  expectedGraduationYear: z
    .number()
    .min(2024, 'Graduation year must be 2024 or later')
    .max(2032, 'Invalid graduation year'),
});

export const roleSelectionSchema = z.object({
  roles: z
    .array(z.enum(['buyer', 'seller', 'service_provider']))
    .min(1, 'You must select at least one role (Buyer is included by default)'),
});

export const sellerSetupSchema = z.object({
  shopName: z.string().min(2, 'Shop name must be at least 2 characters'),
  sellerType: z.enum(['individual', 'student_business', 'club_organization']),
  description: z.string().optional(),
  responseTime: z.string().default('within_few_hours'),
  pickupPreferences: z.string().optional(),
});

export const serviceProviderSetupSchema = z.object({
  providerName: z.string().min(2, 'Provider name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  pricingModel: z.enum(['fixed', 'hourly', 'custom', 'contact_for_price']),
  availability: z.string().optional(),
  serviceMode: z.enum(['in_person', 'online', 'hybrid']),
  serviceZone: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BasicProfileInput = z.infer<typeof basicProfileSchema>;
export type AcademicProfileInput = z.infer<typeof academicProfileSchema>;
export type RoleSelectionInput = z.infer<typeof roleSelectionSchema>;
export type SellerSetupInput = z.infer<typeof sellerSetupSchema>;
export type ServiceProviderSetupInput = z.infer<typeof serviceProviderSetupSchema>;
