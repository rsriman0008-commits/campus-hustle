import { z } from 'zod';

export const MAX_MESSAGE_LENGTH = 2000;

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
  body: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(MAX_MESSAGE_LENGTH, `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`)
    .transform((val) => val.trim()),
});

export const reportSchema = z.object({
  targetType: z.enum(['listing', 'user', 'message', 'review', 'service']),
  targetId: z.string().uuid('Invalid target ID'),
  reason: z
    .string()
    .min(3, 'Please select or describe a valid reason')
    .max(100, 'Reason too long'),
  details: z.string().max(1000, 'Details cannot exceed 1000 characters').optional(),
});

export const blockUserSchema = z.object({
  blockedId: z.string().uuid('Invalid user ID'),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type BlockUserInput = z.infer<typeof blockUserSchema>;
