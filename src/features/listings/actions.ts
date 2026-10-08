'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { itemListingSchema, serviceListingSchema, isValidStatusTransition } from '@/lib/validation/listings';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES, MAX_IMAGES_PER_LISTING } from '@/lib/validation/listings';

const PU_CAMPUS_ID = '00000000-0000-0000-0000-000000000001';

export async function createItemListingAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  const raw = {
    title: formData.get('title') as string,
    categoryId: formData.get('categoryId') as string,
    condition: formData.get('condition') as string,
    description: formData.get('description') as string,
    price: Number(formData.get('price')),
    pricingModel: (formData.get('pricingModel') as string) || 'fixed',
    pickupZoneId: formData.get('pickupZoneId') as string,
    availableUntil: (formData.get('availableUntil') as string) || undefined,
  };

  const validated = itemListingSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listingsTable = supabase.from('listings') as any;
  const { data: listing, error } = await listingsTable
    .insert({
      owner_id: user.id,
      campus_id: PU_CAMPUS_ID,
      listing_type: 'item',
      category_id: validated.data.categoryId,
      title: validated.data.title,
      description: validated.data.description,
      price: validated.data.price,
      currency: 'INR',
      pricing_model: validated.data.pricingModel,
      condition: validated.data.condition,
      status: 'active',
      pickup_zone_id: validated.data.pickupZoneId,
      available_until: validated.data.availableUntil || null,
      published_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  redirect(`/listings/${listing.id}`);
}

export async function createServiceListingAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  const raw = {
    title: formData.get('title') as string,
    categoryId: formData.get('categoryId') as string,
    description: formData.get('description') as string,
    price: Number(formData.get('price')),
    pricingModel: (formData.get('pricingModel') as string) || 'fixed',
    serviceMode: (formData.get('serviceMode') as string) || 'in_person',
    pickupZoneId: (formData.get('pickupZoneId') as string) || undefined,
    availability: (formData.get('availability') as string) || undefined,
  };

  const validated = serviceListingSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listingsTable = supabase.from('listings') as any;
  const { data: listing, error } = await listingsTable
    .insert({
      owner_id: user.id,
      campus_id: PU_CAMPUS_ID,
      listing_type: 'service',
      category_id: validated.data.categoryId,
      title: validated.data.title,
      description: validated.data.description,
      price: validated.data.price,
      currency: 'INR',
      pricing_model: validated.data.pricingModel,
      status: 'active',
      pickup_zone_id: validated.data.pickupZoneId || null,
      published_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  redirect(`/listings/${listing.id}`);
}

export async function updateListingStatusAction(listingId: string, newStatus: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  // Fetch current listing to verify ownership and current status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listingsTable = supabase.from('listings') as any;
  const { data: listing, error: fetchError } = await listingsTable
    .select('id, owner_id, status')
    .eq('id', listingId)
    .single();

  if (fetchError || !listing) return { error: 'Listing not found' };
  if (listing.owner_id !== user.id) return { error: 'You do not have permission to modify this listing' };
  if (!isValidStatusTransition(listing.status, newStatus)) {
    return { error: `Cannot transition listing from '${listing.status}' to '${newStatus}'` };
  }

  const { error } = await listingsTable
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', listingId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteListingAction(listingId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listingsTable = supabase.from('listings') as any;
  const { data: listing, error: fetchError } = await listingsTable
    .select('id, owner_id, status')
    .eq('id', listingId)
    .single();

  if (fetchError || !listing) return { error: 'Listing not found' };
  if (listing.owner_id !== user.id) return { error: 'You do not have permission to delete this listing' };
  if (['reserved', 'sold'].includes(listing.status)) {
    return { error: 'Cannot delete a reserved or sold listing. Please resolve the transaction first.' };
  }

  const { error } = await listingsTable.delete().eq('id', listingId);
  if (error) return { error: error.message };

  redirect('/seller/dashboard');
}

export async function uploadListingImageAction(listingId: string, file: File): Promise<{ path?: string; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication required' };

  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    return { error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  // Validate file size
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { error: `Image must be smaller than ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB` };
  }

  // Verify listing ownership before allowing upload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listingsTable = supabase.from('listings') as any;
  const { data: listing } = await listingsTable
    .select('owner_id')
    .eq('id', listingId)
    .single();

  if (!listing || listing.owner_id !== user.id) {
    return { error: 'You do not have permission to upload images for this listing' };
  }

  // Check current image count
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imagesTable = supabase.from('listing_images') as any;
  const { count } = await imagesTable
    .select('id', { count: 'exact' })
    .eq('listing_id', listingId);

  if ((count ?? 0) >= MAX_IMAGES_PER_LISTING) {
    return { error: `Maximum ${MAX_IMAGES_PER_LISTING} images allowed per listing` };
  }

  // Random path to prevent enumeration
  const ext = file.type === 'image/webp' ? 'webp' : file.type === 'image/png' ? 'png' : 'jpg';
  const randomName = `${crypto.randomUUID()}.${ext}`;
  const storagePath = `listings/${listingId}/${randomName}`;

  const { error: uploadError } = await supabase.storage
    .from('listing-images')
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) return { error: uploadError.message };

  // Record image in DB
  await imagesTable.insert({
    listing_id: listingId,
    storage_path: storagePath,
    position: count ?? 0,
    scan_status: 'pending',
  });

  return { path: storagePath };
}
