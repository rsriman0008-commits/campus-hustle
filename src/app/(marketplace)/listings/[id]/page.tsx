import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ListingDetailClient from './ListingDetailClient';

const getMockListing = (id: string) => ({
  id,
  title: 'Introduction to Algorithms — CLRS 3rd Edition',
  description: `Selling my CLRS copy — excellent condition with some pencil annotations in Chapter 4 (easily erasable). Used for one semester of Algorithm Analysis. All pages intact, spine is tight.

Includes: Original book only.

Reason for selling: Finished my algorithms course.`,
  price: 480,
  pricingModel: 'negotiable',
  condition: 'good',
  status: 'active',
  listingType: 'item',
  category: 'Books & Textbooks',
  pickupZone: 'Central Library Foyer',
  createdAt: '2026-10-01',
  seller: {
    displayName: 'Rahul Menon',
    username: 'rahul_mca',
    verificationStatus: 'verified',
    avgRating: 4.7,
    reviewCount: 8,
    completedTransactions: 12,
    responseTime: '~1 hr',
  },
});

async function ListingDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) notFound();

  const listing = getMockListing(id);
  return <ListingDetailClient listing={listing} />;
}

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <Suspense fallback={
        <div className="py-24 text-center text-slate-500 text-sm font-medium">
          Loading listing details...
        </div>
      }>
        <ListingDetailContent params={params} />
      </Suspense>
    </div>
  );
}
