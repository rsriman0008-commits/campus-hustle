import { describe, it, expect } from 'vitest';
import { sendMessageSchema, reportSchema, blockUserSchema, MAX_MESSAGE_LENGTH } from '@/lib/validation/chat';

describe('Chat & Communication Validation Unit Tests', () => {
  const VALID_UUID_1 = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const VALID_UUID_2 = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

  describe('Send Message Validation', () => {
    it('accepts valid message body and trims whitespace', () => {
      const result = sendMessageSchema.safeParse({
        conversationId: VALID_UUID_1,
        body: '  Is this book still available?  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body).toBe('Is this book still available?');
      }
    });

    it('rejects empty message body', () => {
      const result = sendMessageSchema.safeParse({
        conversationId: VALID_UUID_1,
        body: '',
      });
      expect(result.success).toBe(false);
    });

    it('rejects message exceeding max length limit', () => {
      const longMessage = 'A'.repeat(MAX_MESSAGE_LENGTH + 5);
      const result = sendMessageSchema.safeParse({
        conversationId: VALID_UUID_1,
        body: longMessage,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('cannot exceed');
      }
    });

    it('rejects invalid conversation UUID', () => {
      const result = sendMessageSchema.safeParse({
        conversationId: 'invalid-conv-id',
        body: 'Hello',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Report Target Validation', () => {
    it('accepts valid report submission', () => {
      const result = reportSchema.safeParse({
        targetType: 'listing',
        targetId: VALID_UUID_1,
        reason: 'Prohibited or inappropriate campus item',
        details: 'Seller is listing unapproved items.',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid target type', () => {
      const result = reportSchema.safeParse({
        targetType: 'invalid_type',
        targetId: VALID_UUID_1,
        reason: 'Some reason',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Block User Validation', () => {
    it('accepts valid blockedId UUID', () => {
      const result = blockUserSchema.safeParse({
        blockedId: VALID_UUID_2,
      });
      expect(result.success).toBe(true);
    });

    it('rejects non-UUID blockedId', () => {
      const result = blockUserSchema.safeParse({
        blockedId: 'not-a-uuid',
      });
      expect(result.success).toBe(false);
    });
  });
});
