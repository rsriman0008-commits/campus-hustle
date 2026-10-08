import Link from 'next/link';
import { MessageSquare, ShieldCheck, Package, Clock } from 'lucide-react';

interface ConversationSummary {
  id: string;
  counterpart: {
    displayName: string;
    username: string;
    verificationStatus: string;
  };
  listing: {
    title: string;
    price: number;
    status: string;
  };
  lastMessage: {
    body: string;
    createdAt: string;
    isUnread: boolean;
  };
}

const MOCK_CONVERSATIONS: ConversationSummary[] = [
  {
    id: 'c-1',
    counterpart: {
      displayName: 'Rahul Menon',
      username: 'rahul_mca',
      verificationStatus: 'verified',
    },
    listing: {
      title: 'Introduction to Algorithms — CLRS 3rd Edition',
      price: 480,
      status: 'active',
    },
    lastMessage: {
      body: 'Yes, I can meet at Central Library foyer tomorrow around 2 PM!',
      createdAt: '10 mins ago',
      isUnread: true,
    },
  },
  {
    id: 'c-2',
    counterpart: {
      displayName: 'Priya Krishnan',
      username: 'priya_k',
      verificationStatus: 'verified',
    },
    listing: {
      title: 'Adjustable Laptop Stand (Aluminium)',
      price: 650,
      status: 'active',
    },
    lastMessage: {
      body: 'Would you be open to ₹600 for a quick pickup today?',
      createdAt: '2 hours ago',
      isUnread: false,
    },
  },
  {
    id: 'c-3',
    counterpart: {
      displayName: 'Vikram Das',
      username: 'vikram_phy',
      verificationStatus: 'verified',
    },
    listing: {
      title: 'Casio Scientific Calculator fx-991ES Plus',
      price: 320,
      status: 'sold',
    },
    lastMessage: {
      body: 'Thanks for the calculator! Leaving a review now.',
      createdAt: 'Yesterday',
      isUnread: false,
    },
  },
];

export default function ChatInboxPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Campus Messages</h1>
          <p className="text-xs text-slate-400 mt-1">Direct buyer-seller messaging for Pondicherry University exchanges.</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-3.5 h-3.5" /> End-to-End PU Verified
        </div>
      </div>

      {MOCK_CONVERSATIONS.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-700 mx-auto" />
          <h2 className="text-base font-semibold text-slate-300">No active conversations</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you contact a seller or a buyer inquires about your listing, conversation threads will appear here.
          </p>
          <Link href="/search" className="inline-block pt-2">
            <button className="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all">
              Browse Listings
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-800/60 shadow-xl">
          {MOCK_CONVERSATIONS.map((conv) => (
            <Link
              key={conv.id}
              href={`/chat/${conv.id}`}
              className="flex items-start gap-4 p-4 hover:bg-slate-800/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-lg font-bold text-slate-950 shrink-0">
                {conv.counterpart.displayName.charAt(0)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <p className="font-semibold text-sm text-white group-hover:text-emerald-300 transition-colors">
                      {conv.counterpart.displayName}
                    </p>
                    {conv.counterpart.verificationStatus === 'verified' && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" /> {conv.lastMessage.createdAt}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium truncate">
                  <Package className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{conv.listing.title}</span>
                  <span className="text-slate-500 shrink-0">· ₹{conv.listing.price}</span>
                </div>

                <p className={`text-xs truncate ${conv.lastMessage.isUnread ? 'text-slate-100 font-semibold' : 'text-slate-400'}`}>
                  {conv.lastMessage.body}
                </p>
              </div>

              {conv.lastMessage.isUnread && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 self-center ring-4 ring-emerald-500/20" />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
