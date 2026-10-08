import { describe, it, expect } from 'vitest';

describe('Phase 0 Baseline Test Suite', () => {
  it('verifies that the test engine is functional', () => {
    expect(true).toBe(true);
  });

  it('validates basic domain calculation rules', () => {
    const approvedDomains = ['pondiuni.edu.in', 'pondiuni.ac.in'];
    const isApprovedDomain = (email: string) => {
      const domain = email.split('@')[1];
      return approvedDomains.includes(domain);
    };

    expect(isApprovedDomain('student@pondiuni.edu.in')).toBe(true);
    expect(isApprovedDomain('faculty@pondiuni.ac.in')).toBe(true);
    expect(isApprovedDomain('user@gmail.com')).toBe(false);
  });
});
