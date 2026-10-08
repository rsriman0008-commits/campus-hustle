'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { submitReviewSchema } from '@/lib/validation/reviews';

export async function confirmTransactionCompletionAction(transactionId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  // Fetch transaction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txTable = supabase.from('transactions') as any;
  const { data: tx, error: fetchError } = await txTable
    .select('id, listing_id, buyer_id, provider_or_seller_id, status')
    .eq('id', transactionId)
    .single();

  if (fetchError || !tx) return { error: 'Transaction not found' };

  if (tx.buyer_id !== user.id && tx.provider_or_seller_id !== user.id) {
    return { error: 'You are not a participant in this transaction' };
  }

  // Update transaction status
  const { error: updateError } = await txTable
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', transactionId);

  if (updateError) return { error: updateError.message };

  // Sync listing status to sold
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listingsTable = supabase.from('listings') as any;
  await listingsTable
    .update({ status: 'sold', updated_at: new Date().toISOString() })
    .eq('id', tx.listing_id);

  return { success: true };
}

export async function submitReviewAction(data: {
  transactionId: string;
  revieweeId: string;
  rating: number;
  tags?: string[];
  comment?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  const validated = submitReviewSchema.safeParse(data);
  if (!validated.success) return { error: validated.error.issues[0].message };

  // Rule 1: No self reviews
  if (user.id === validated.data.revieweeId) {
    return { error: 'You cannot submit a review for yourself' };
  }

  // Rule 2: Verify transaction completed and user was a participant
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txTable = supabase.from('transactions') as any;
  const { data: tx, error: txError } = await txTable
    .select('id, buyer_id, provider_or_seller_id, status')
    .eq('id', validated.data.transactionId)
    .single();

  if (txError || !tx) return { error: 'Transaction not found' };

  const isBuyer = tx.buyer_id === user.id;
  const isSeller = tx.provider_or_seller_id === user.id;

  if (!isBuyer && !isSeller) {
    return { error: 'You can only review transactions you personally completed' };
  }

  // Rule 3: No duplicate reviews by the same user for this transaction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviewsTable = supabase.from('reviews') as any;
  const { data: existingReview } = await reviewsTable
    .select('id')
    .eq('transaction_id', validated.data.transactionId)
    .eq('reviewer_id', user.id)
    .maybeSingle();

  if (existingReview) {
    return { error: 'You have already submitted a review for this transaction' };
  }

  // Insert review
  const { error: insertError } = await reviewsTable.insert({
    transaction_id: validated.data.transactionId,
    reviewer_id: user.id,
    reviewee_id: validated.data.revieweeId,
    rating: validated.data.rating,
    tags: validated.data.tags || [],
    comment: validated.data.comment || null,
    moderation_status: 'approved',
  });

  if (insertError) return { error: insertError.message };

  redirect('/history');
}
