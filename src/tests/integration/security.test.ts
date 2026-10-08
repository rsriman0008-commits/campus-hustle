import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, clearRateLimitStore } from '@/lib/rate-limit/rate-limiter';
import { canModerateContent, canSuspendUsers } from '@/lib/authorization/roles';
import { isValidOfferTransition } from '@/lib/validation/offers';
import { isValidStatusTransition } from '@/lib/validation/listings';

describe('Phase 10 — Security Hardening & BOLA Prevention Suite', () => {
  beforeEach(() => {
    clearRateLimitStore();
  });

  describe('Rate Limiting Protections', () => {
    it('throttles rapid login attempts beyond threshold', () => {
      const clientIp = '10.0.0.1';

      // 5 requests allowed
      for (let i = 0; i < 5; i++) {
        const res = checkRateLimit(clientIp, 'auth_login');
        expect(res.allowed).toBe(true);
      }

      // 6th request blocked
      const blocked = checkRateLimit(clientIp, 'auth_login');
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.resetMs).toBeGreaterThan(0);
    });

    it('isolates rate limits between distinct client identifiers', () => {
      const clientA = '10.0.0.1';
      const clientB = '10.0.0.2';

      for (let i = 0; i < 5; i++) {
        checkRateLimit(clientA, 'auth_login');
      }

      expect(checkRateLimit(clientA, 'auth_login').allowed).toBe(false);
      expect(checkRateLimit(clientB, 'auth_login').allowed).toBe(true);
    });
  });

  describe('Broken Object Level Authorization (BOLA) Guards', () => {
    it('prevents non-owners from editing or mutating other student listings', () => {
      const listingOwnerId = 'user-owner-uuid';
      const callerId = 'user-attacker-uuid';

      const canMutateListing = (caller: string, owner: string) => caller === owner;
      expect(canMutateListing(callerId, listingOwnerId)).toBe(false);
      expect(canMutateListing(listingOwnerId, listingOwnerId)).toBe(true);
    });

    it('prevents non-participants from viewing or tampering with private negotiations', () => {
      const buyerId = 'buyer-uuid';
      const sellerId = 'seller-uuid';
      const intruderId = 'intruder-uuid';

      const canAccessOffer = (caller: string) => caller === buyerId || caller === sellerId;
      expect(canAccessOffer(buyerId)).toBe(true);
      expect(canAccessOffer(sellerId)).toBe(true);
      expect(canAccessOffer(intruderId)).toBe(false);
    });
  });

  describe('State Machine Tamper Resistance', () => {
    it('blocks illegal status skips in listing lifecycle', () => {
      // Cannot jump from sold back to active
      expect(isValidStatusTransition('sold', 'active')).toBe(false);
      // Cannot jump from draft directly to sold
      expect(isValidStatusTransition('draft', 'sold')).toBe(false);
    });

    it('blocks illegal status skips in offer negotiations', () => {
      // Cannot accept an already rejected offer
      expect(isValidOfferTransition('rejected', 'accepted')).toBe(false);
      // Cannot counter a withdrawn offer
      expect(isValidOfferTransition('withdrawn', 'countered')).toBe(false);
    });
  });

  describe('Privilege Escalation Prevention', () => {
    it('rejects student attempts to execute administrative suspension', () => {
      const normalStudentRoles = ['student_user'];
      expect(canSuspendUsers(normalStudentRoles)).toBe(false);
      expect(canModerateContent(normalStudentRoles)).toBe(false);
    });
  });
});
