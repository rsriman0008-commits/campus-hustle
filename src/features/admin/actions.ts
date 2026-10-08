'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { canModerateContent, canSuspendUsers } from '@/lib/authorization/roles';

async function verifyCallerRole(): Promise<{ userId: string; roles: string[] } | { error: string }> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  // Fetch caller's roles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rolesTable = supabase.from('user_roles') as any;
  const { data: roleRows } = await rolesTable
    .select('role')
    .eq('user_id', user.id);

  const roles = roleRows ? roleRows.map((r: { role: string }) => r.role) : ['student_user'];
  return { userId: user.id, roles };
}

export async function resolveReportAction(data: {
  reportId: string;
  resolution: 'resolved' | 'dismissed';
  notes?: string;
}) {
  const authCheck = await verifyCallerRole();
  if ('error' in authCheck) return { error: authCheck.error };

  if (!canModerateContent(authCheck.roles)) {
    return { error: 'Unauthorized: Moderator or Admin role required' };
  }

  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reportsTable = supabase.from('reports') as any;
  const { error } = await reportsTable
    .update({
      status: data.resolution,
      assigned_to: authCheck.userId,
      resolution: data.notes || `Marked as ${data.resolution} by moderator`,
      updated_at: new Date().toISOString(),
    })
    .eq('id', data.reportId);

  if (error) return { error: error.message };

  // Create audit log
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = supabase.from('audit_logs') as any;
  await auditTable.insert({
    actor_id: authCheck.userId,
    action: `report_${data.resolution}`,
    target_type: 'report',
    target_id: data.reportId,
    metadata: { notes: data.notes },
  });

  return { success: true };
}

export async function moderateListingAction(data: {
  listingId: string;
  action: 'approve' | 'pause' | 'remove';
  reason: string;
}) {
  const authCheck = await verifyCallerRole();
  if ('error' in authCheck) return { error: authCheck.error };

  if (!canModerateContent(authCheck.roles)) {
    return { error: 'Unauthorized: Moderator or Admin role required' };
  }

  const newStatus = data.action === 'approve' ? 'active' : data.action === 'pause' ? 'paused' : 'expired';

  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listingsTable = supabase.from('listings') as any;
  const { error } = await listingsTable
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', data.listingId);

  if (error) return { error: error.message };

  // Create audit log
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = supabase.from('audit_logs') as any;
  await auditTable.insert({
    actor_id: authCheck.userId,
    action: `listing_${data.action}`,
    target_type: 'listing',
    target_id: data.listingId,
    metadata: { reason: data.reason },
  });

  return { success: true };
}

export async function suspendUserAccountAction(data: {
  targetUserId: string;
  action: 'suspend' | 'reactivate';
  reason: string;
}) {
  const authCheck = await verifyCallerRole();
  if ('error' in authCheck) return { error: authCheck.error };

  if (!canSuspendUsers(authCheck.roles)) {
    return { error: 'Unauthorized: Campus Admin or Platform Admin role required' };
  }

  const newStatus = data.action === 'suspend' ? 'suspended' : 'active';

  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profilesTable = supabase.from('profiles') as any;
  const { error } = await profilesTable
    .update({
      account_status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', data.targetUserId);

  if (error) return { error: error.message };

  // Create audit log
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = supabase.from('audit_logs') as any;
  await auditTable.insert({
    actor_id: authCheck.userId,
    action: `user_${data.action}`,
    target_type: 'profile',
    target_id: data.targetUserId,
    metadata: { reason: data.reason },
  });

  return { success: true };
}
