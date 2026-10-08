import { describe, it, expect } from 'vitest';
import { emailSchema, registerSchema, basicProfileSchema, academicProfileSchema } from '@/lib/validation/auth';

describe('Auth & Domain Validation Unit Tests', () => {
  it('accepts valid Pondicherry University email domains', () => {
    expect(emailSchema.safeParse('student123@pondiuni.edu.in').success).toBe(true);
    expect(emailSchema.safeParse('faculty@pondiuni.ac.in').success).toBe(true);
  });

  it('rejects non-Pondicherry University email domains', () => {
    const result1 = emailSchema.safeParse('user@gmail.com');
    expect(result1.success).toBe(false);
    if (!result1.success) {
      expect(result1.error.issues[0].message).toContain('restricted strictly to Pondicherry University');
    }

    const result2 = emailSchema.safeParse('student@otheruniv.edu.in');
    expect(result2.success).toBe(false);
  });

  it('validates password requirements during registration', () => {
    expect(
      registerSchema.safeParse({
        email: 'student@pondiuni.edu.in',
        password: 'Password123',
      }).success
    ).toBe(true);

    expect(
      registerSchema.safeParse({
        email: 'student@pondiuni.edu.in',
        password: 'weak',
      }).success
    ).toBe(false);
  });

  it('validates basic profile setup rules', () => {
    expect(
      basicProfileSchema.safeParse({
        displayName: 'John Doe',
        username: 'johndoe_pu',
        bio: 'Computer Science student',
      }).success
    ).toBe(true);

    expect(
      basicProfileSchema.safeParse({
        displayName: 'A', // too short
      }).success
    ).toBe(false);
  });

  it('validates academic profile setup requirements', () => {
    expect(
      academicProfileSchema.safeParse({
        schoolId: '10000000-0000-0000-0000-000000000001',
        departmentId: '20000000-0000-0000-0000-000000000001',
        programmeId: '30000000-0000-0000-0000-000000000001',
        yearOfStudy: 2,
        expectedGraduationYear: 2026,
      }).success
    ).toBe(true);
  });
});
