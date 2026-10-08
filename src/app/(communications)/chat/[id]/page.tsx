import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ChatWindow from './ChatWindow';

async function ChatLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) notFound();

  // In production: fetch conversation + messages + listing details with RLS
  const initialData = {
    conversationId: id,
    counterpart: {
      id: 'user-2',
      displayName: 'Rahul Menon',
      username: 'rahul_mca',
      verificationStatus: 'verified',
      avgRating: 4.7,
      completedTransactions: 12,
    },
    listing: {
      id: 'listing-1',
      title: 'Introduction to Algorithms — CLRS 3rd Edition',
      price: 480,
      status: 'active',
      pickupZone: 'Central Library Foyer',
    },
    messages: [
      {
        id: 'm-1',
        senderId: 'user-2',
        senderName: 'Rahul Menon',
        body: 'Hi! Thanks for reaching out. Yes, the CLRS 3rd edition is still available.',
        createdAt: '10:30 AM',
        isMe: false,
      },
      {
        id: 'm-2',
        senderId: 'user-me',
        senderName: 'Me',
        body: 'Great! Are the annotations easily erasable?',
        createdAt: '10:32 AM',
        isMe: true,
      },
      {
        id: 'm-3',
        senderId: 'user-2',
        senderName: 'Rahul Menon',
        body: 'Yes, only light 2B pencil notes in Chapter 4, nothing in pen or highlighter.',
        createdAt: '10:35 AM',
        isMe: false,
      },
      {
        id: 'm-4',
        senderId: 'user-2',
        senderName: 'Rahul Menon',
        body: 'I can meet at Central Library foyer tomorrow around 2 PM if that works for you!',
        createdAt: '10:36 AM',
        isMe: false,
      },
    ],
  };

  return <ChatWindow data={initialData} />;
}

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="max-w-3xl mx-auto py-4">
      <Suspense fallback={
        <div className="py-24 text-center text-slate-500 text-sm">
          Loading conversation...
        </div>
      }>
        <ChatLoader params={params} />
      </Suspense>
    </div>
  );
}
