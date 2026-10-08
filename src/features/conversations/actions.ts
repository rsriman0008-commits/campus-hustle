'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { sendMessageSchema, reportSchema, blockUserSchema } from '@/lib/validation/chat';

export async function getOrCreateConversationAction(listingId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  // Fetch listing details to find owner
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listingsTable = supabase.from('listings') as any;
  const { data: listing, error: listingError } = await listingsTable
    .select('id, owner_id, status')
    .eq('id', listingId)
    .single();

  if (listingError || !listing) return { error: 'Listing not found' };
  if (listing.owner_id === user.id) {
    return { error: 'You cannot start a conversation with yourself for your own listing' };
  }

  // Check if a conversation between these users for this listing already exists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convMembersTable = supabase.from('conversation_members') as any;
  const { data: existingMemberships } = await convMembersTable
    .select('conversation_id')
    .eq('user_id', user.id);

  if (existingMemberships && existingMemberships.length > 0) {
    const convIds = existingMemberships.map((m: { conversation_id: string }) => m.conversation_id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const convsTable = supabase.from('conversations') as any;
    const { data: existingConv } = await convsTable
      .select('id, listing_id')
      .in('id', convIds)
      .eq('listing_id', listingId)
      .maybeSingle();

    if (existingConv) {
      redirect(`/chat/${existingConv.id}`);
    }
  }

  // Create new conversation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convsTable = supabase.from('conversations') as any;
  const { data: newConv, error: createError } = await convsTable
    .insert({
      listing_id: listingId,
      status: 'active',
    })
    .select('id')
    .single();

  if (createError || !newConv) return { error: createError?.message || 'Failed to create conversation' };

  // Add both members
  await convMembersTable.insert([
    { conversation_id: newConv.id, user_id: user.id },
    { conversation_id: newConv.id, user_id: listing.owner_id },
  ]);

  redirect(`/chat/${newConv.id}`);
}

export async function sendMessageAction(conversationId: string, body: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  const validated = sendMessageSchema.safeParse({ conversationId, body });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  // Verify membership
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const membersTable = supabase.from('conversation_members') as any;
  const { data: membership } = await membersTable
    .select('conversation_id')
    .eq('conversation_id', conversationId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!membership) {
    return { error: 'You are not a participant in this conversation' };
  }

  // Insert message
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messagesTable = supabase.from('messages') as any;
  const { error: msgError } = await messagesTable.insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: validated.data.body,
    moderation_status: 'approved',
  });

  if (msgError) return { error: msgError.message };

  // Update conversation timestamp
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convsTable = supabase.from('conversations') as any;
  await convsTable
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return { success: true };
}

export async function blockUserAction(blockedId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  const validated = blockUserSchema.safeParse({ blockedId });
  if (!validated.success) return { error: validated.error.issues[0].message };

  if (user.id === validated.data.blockedId) {
    return { error: 'You cannot block yourself' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blockedTable = supabase.from('blocked_users') as any;
  const { error } = await blockedTable.upsert({
    blocker_id: user.id,
    blocked_id: validated.data.blockedId,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function reportAbuseAction(targetType: string, targetId: string, reason: string, details?: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  const validated = reportSchema.safeParse({ targetType, targetId, reason, details });
  if (!validated.success) return { error: validated.error.issues[0].message };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reportsTable = supabase.from('reports') as any;
  const { error } = await reportsTable.insert({
    reporter_id: user.id,
    target_type: validated.data.targetType,
    target_id: validated.data.targetId,
    reason: validated.data.reason,
    details: validated.data.details || null,
    status: 'pending',
  });

  if (error) return { error: error.message };
  return { success: true };
}
