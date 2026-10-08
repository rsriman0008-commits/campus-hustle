export type PlatformRole = 'student_user' | 'moderator' | 'campus_admin' | 'platform_admin';

export const ADMIN_ROLES: PlatformRole[] = ['campus_admin', 'platform_admin'];
export const MODERATION_ROLES: PlatformRole[] = ['moderator', 'campus_admin', 'platform_admin'];

export function hasRole(userRoles: string[], role: PlatformRole): boolean {
  return userRoles.includes(role);
}

export function canModerateContent(userRoles: string[]): boolean {
  return userRoles.some((r) => MODERATION_ROLES.includes(r as PlatformRole));
}

export function canManageAcademicData(userRoles: string[]): boolean {
  return userRoles.some((r) => ADMIN_ROLES.includes(r as PlatformRole));
}

export function canSuspendUsers(userRoles: string[]): boolean {
  return userRoles.some((r) => ADMIN_ROLES.includes(r as PlatformRole));
}

export function canAccessAdminWorkspace(userRoles: string[]): boolean {
  return canModerateContent(userRoles);
}
