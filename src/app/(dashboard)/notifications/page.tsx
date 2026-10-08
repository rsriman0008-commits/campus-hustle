import { cookies } from 'next/headers';
import Link from 'next/link';
import {
  Bell,
  ShoppingBag,
  MessageSquare,
  Tag,
  Star,
  CheckCircle2,
  Clock,
  Info,
  ArrowRight,
} from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

interface Notification {
  id: string;
  type: 'offer' | 'message' | 'review' | 'listing' | 'system';
  title: string;
  body: string;
  href: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'offer',
    title: 'New offer on your listing',
    body: 'Riya M. offered ₹350 for "Engineering Mathematics Vol 2"',
    href: '/offers',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'message',
    title: 'New message from Karthik',
    body: '"Is the calculator still available?"',
    href: '/chat',
    time: '22 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'listing',
    title: 'Price drop alert',
    body: '"Casio fx-991ES Plus" dropped from ₹800 to ₹650',
    href: '/listings/calc-101',
    time: '1 hr ago',
    read: false,
  },
  {
    id: '4',
    type: 'review',
    title: 'You got a 5-star review!',
    body: 'Priya gave you a 5-star rating for the Physics textbook sale.',
    href: '/profile',
    time: '2 hrs ago',
    read: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'Safety reminder',
    body: 'Always meet buyers in the designated Campus Pickup Zones.',
    href: '/safety',
    time: 'Yesterday',
    read: true,
  },
];

const iconMap = {
  offer: Tag,
  message: MessageSquare,
  review: Star,
  listing: ShoppingBag,
  system: Info,
};

const colorMap = {
  offer: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  message: 'text-blue-700 bg-blue-50 border-blue-200',
  review: 'text-amber-700 bg-amber-50 border-amber-200',
  listing: 'text-purple-700 bg-purple-50 border-purple-200',
  system: 'text-slate-700 bg-slate-100 border-slate-200',
};

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get('ch_demo_session')?.value;
  const session = raw ? JSON.parse(raw) : null;

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Sign in to see notifications</h2>
          <p className="text-xs text-slate-500 mt-1">
            Stay updated on offers, messages, and campus activity.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          Sign In <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read);
  const read = MOCK_NOTIFICATIONS.filter((n) => n.read);

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <BackButton fallbackUrl="/" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {unread.length > 0 ? `${unread.length} new notifications` : 'All caught up!'}
          </p>
        </div>
        {unread.length > 0 && (
          <button className="text-xs text-emerald-700 font-bold hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <section className="space-y-2.5">
          <p className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" /> New
          </p>
          <div className="space-y-2.5">
            {unread.map((n) => {
              const Icon = iconMap[n.type];
              return (
                <Link
                  key={n.id}
                  href={n.href}
                  className="flex items-start gap-3.5 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-slate-300 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${colorMap[n.type]}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">{n.time}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-2" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Earlier */}
      {read.length > 0 && (
        <section className="space-y-2.5">
          <p className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Earlier
          </p>
          <div className="space-y-2.5">
            {read.map((n) => {
              const Icon = iconMap[n.type];
              return (
                <Link
                  key={n.id}
                  href={n.href}
                  className="flex items-start gap-3.5 p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl hover:bg-slate-100/80 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 opacity-75 ${colorMap[n.type]}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-950 transition-colors">
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
