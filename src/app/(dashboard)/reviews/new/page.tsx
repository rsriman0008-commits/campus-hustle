import { Suspense } from 'react';
import ReviewForm from './ReviewForm';

function ReviewLoader({
  searchParams,
}: {
  searchParams: Promise<{ transactionId?: string }>;
}) {
  return <ReviewForm searchParams={searchParams} />;
}

export default function NewReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ transactionId?: string }>;
}) {
  return (
    <div className="max-w-xl mx-auto py-8">
      <Suspense fallback={
        <div className="py-24 text-center text-slate-500 text-sm">
          Loading review form...
        </div>
      }>
        <ReviewLoader searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
