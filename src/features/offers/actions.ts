'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  createOfferSchema,
  respondOfferSchema,
  createReservationSchema,
  isValidOfferTransition,
  isValidReservationTransition,
} from '@/lib/validation/offers';

export async function createOfferAction(data: {
  conversationId: string;
  listingId: string;
  sellerId: string;
  amount: number;
  message?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  const validated = createOfferSchema.safeParse(data);
  if (!validated.success) return { error: validated.error.issues[0].message };

  if (user.id === validated.data.sellerId) {
    return { error: 'You cannot make an offer on your own listing' };
  }

  // Set default expiration: 48 hours from now
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const offersTable = supabase.from('offers') as any;
  const { data: offer, error } = await offersTable
    .insert({
      conversation_id: validated.data.conversationId,
      listing_id: validated.data.listingId,
      buyer_id: user.id,
      seller_id: validated.data.sellerId,
      amount: validated.data.amount,
      status: 'sent',
      message: validated.data.message || null,
      expires_at: expiresAt.toISOString(),
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  // Post system notice to conversation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messagesTable = supabase.from('messages') as any;
  await messagesTable.insert({
    conversation_id: validated.data.conversationId,
    sender_id: user.id,
    body: `🏷️ New Offer Made: ₹${validated.data.amount.toLocaleString('en-IN')}${
      validated.data.message ? ` — "${validated.data.message}"` : ''
    }`,
    moderation_status: 'approved',
  });

  return { success: true, offerId: offer.id };
}

export async function respondToOfferAction(data: {
  offerId: string;
  response: 'accept' | 'reject' | 'counter' | 'withdraw';
  counterAmount?: number;
  message?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  const validated = respondOfferSchema.safeParse(data);
  if (!validated.success) return { error: validated.error.issues[0].message };

  // Fetch current offer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const offersTable = supabase.from('offers') as any;
  const { data: offer, error: fetchError } = await offersTable
    .select('id, conversation_id, listing_id, buyer_id, seller_id, amount, status')
    .eq('id', validated.data.offerId)
    .single();

  if (fetchError || !offer) return { error: 'Offer not found' };

  const isBuyer = offer.buyer_id === user.id;
  const isSeller = offer.seller_id === user.id;

  if (!isBuyer && !isSeller) {
    return { error: 'You are not a participant in this offer' };
  }

  let newStatus: string = offer.status;
  if (validated.data.response === 'accept') {
    newStatus = 'accepted';
  } else if (validated.data.response === 'reject') {
    newStatus = 'rejected';
  } else if (validated.data.response === 'counter') {
    newStatus = 'countered';
  } else if (validated.data.response === 'withdraw') {
    newStatus = 'withdrawn';
  }

  if (!isValidOfferTransition(offer.status, newStatus)) {
    return { error: `Cannot transition offer from '${offer.status}' to '${newStatus}'` };
  }

  const updatePayload: Record<string, unknown> = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (validated.data.response === 'counter' && validated.data.counterAmount) {
    updatePayload.amount = validated.data.counterAmount;
    if (validated.data.message) updatePayload.message = validated.data.message;
  }

  const { error: updateError } = await offersTable
    .update(updatePayload)
    .eq('id', validated.data.offerId);

  if (updateError) return { error: updateError.message };

  // If accepted, sync listing status to 'reserved'
  if (newStatus === 'accepted') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listingsTable = supabase.from('listings') as any;
    await listingsTable
      .update({ status: 'reserved', updated_at: new Date().toISOString() })
      .eq('id', offer.listing_id);
  }

  return { success: true };
}

export async function createReservationAction(data: {
  listingId: string;
  sellerId: string;
  offerId?: string;
  pickupZoneId: string;
  meetupDate: string;
  meetupTimeWindow:
    | '09:00 AM - 11:00 AM (Morning)'
    | '11:00 AM - 01:00 PM (Pre-lunch)'
    | '01:00 PM - 03:00 PM (Post-lunch)'
    | '03:00 PM - 05:00 PM (Afternoon)'
    | '05:00 PM - 07:00 PM (Evening)';
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  const validated = createReservationSchema.safeParse(data);
  if (!validated.success) return { error: validated.error.issues[0].message };

  // Set reservation expiry to end of meetup day
  const expiresAt = new Date(`${validated.data.meetupDate}T23:59:59Z`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reservationsTable = supabase.from('reservations') as any;
  const { data: reservation, error } = await reservationsTable
    .insert({
      listing_id: validated.data.listingId,
      buyer_id: user.id,
      seller_id: validated.data.sellerId,
      offer_id: validated.data.offerId || null,
      pickup_zone_id: validated.data.pickupZoneId,
      meetup_date: validated.data.meetupDate,
      meetup_time_window: validated.data.meetupTimeWindow,
      expires_at: expiresAt.toISOString(),
      status: 'confirmed',
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  // Lock listing status as reserved
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listingsTable = supabase.from('listings') as any;
  await listingsTable
    .update({ status: 'reserved', updated_at: new Date().toISOString() })
    .eq('id', validated.data.listingId);

  return { success: true, reservationId: reservation.id };
}

export async function cancelReservationAction(reservationId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resTable = supabase.from('reservations') as any;
  const { data: res, error: fetchError } = await resTable
    .select('id, listing_id, buyer_id, seller_id, status')
    .eq('id', reservationId)
    .single();

  if (fetchError || !res) return { error: 'Reservation not found' };
  if (res.buyer_id !== user.id && res.seller_id !== user.id) {
    return { error: 'You are not a participant in this reservation' };
  }

  if (!isValidReservationTransition(res.status, 'cancelled')) {
    return { error: `Cannot cancel a reservation in '${res.status}' state` };
  }

  const { error } = await resTable
    .update({ status: 'cancelled' })
    .eq('id', reservationId);

  if (error) return { error: error.message };

  // Re-open listing back to active
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listingsTable = supabase.from('listings') as any;
  await listingsTable
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('id', res.listing_id);

  return { success: true };
}
