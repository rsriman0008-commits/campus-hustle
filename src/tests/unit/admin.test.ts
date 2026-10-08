import { describe, it, expect } from 'vitest';
import {
  canModerateContent,
  canManageAcademicData,
  canSuspendUsers,
  canAccessAdminWorkspace,
} from '@/lib/authorization/roles';

describe('Admin & Moderation RBAC Unit Tests', () => {
  describe('Permission Matrix Checks', () => {
    it('restricts normal student_users from moderation and admin actions', () => {
      const studentRoles = ['student_user'];
      expect(canModerateContent(studentRoles)).toBe(false);
      expect(canManageAcademicData(studentRoles)).toBe(false);
      expect(canSuspendUsers(studentRoles)).toBe(false);
      expect(canAccessAdminWorkspace(studentRoles)).toBe(false);
    });

    it('grants moderators content moderation access but restricts user suspension and academic edits', () => {
      const moderatorRoles = ['student_user', 'moderator'];
      expect(canModerateContent(moderatorRoles)).toBe(true);
      expect(canAccessAdminWorkspace(moderatorRoles)).toBe(true);
      expect(canManageAcademicData(moderatorRoles)).toBe(false);
      expect(canSuspendUsers(moderatorRoles)).toBe(false);
    });

    it('grants campus_admin and platform_admin full administrative authority', () => {
      const campusAdminRoles = ['student_user', 'campus_admin'];
      expect(canModerateContent(campusAdminRoles)).toBe(true);
      expect(canManageAcademicData(campusAdminRoles)).toBe(true);
      expect(canSuspendUsers(campusAdminRoles)).toBe(true);
      expect(canAccessAdminWorkspace(campusAdminRoles)).toBe(true);

      const platformAdminRoles = ['platform_admin'];
      expect(canModerateContent(platformAdminRoles)).toBe(true);
      expect(canManageAcademicData(platformAdminRoles)).toBe(true);
      expect(canSuspendUsers(platformAdminRoles)).toBe(true);
    });
  });
});
