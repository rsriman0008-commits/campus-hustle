'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Send, ShieldCheck, MapPin, Tag, Calendar, MoreVertical,
  Flag, Ban, Package, ArrowLeft, Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChatWindowProps {
  data: {
    conversationId: string;
    counterpart: {
      id: string;
      displayName: string;
      username: string;
      verificationStatus: string;
      avgRating: number;
      completedTransactions: number;
    };
    listing: {
      id: string;
      title: string;
      price: number;
      status: string;
      pickupZone: string;
    };
    messages: {
      id: string;
      senderId: string;
      senderName: string;
      body: string;
      createdAt: string;
      isMe: boolean;
    }[];
  };
}

export default function ChatWindow({ data }: ChatWindowProps) {
  const [messages, setMessages] = useState(data.messages);
  const [inputBody, setInputBody] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState(data.listing.price.toString());
  const [actionSuccess, setActionSuccess] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBody.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      senderId: 'user-me',
      senderName: 'Me',
      body: inputBody.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputBody('');
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) return;

    const offerMsg = {
      id: `m-offer-${Date.now()}`,
      senderId: 'user-me',
      senderName: 'Me',
      body: `🏷️ Made an official offer: ₹${amount.toLocaleString('en-IN')}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages((prev) => [...prev, offerMsg]);
    setShowOfferModal(false);
    setActionSuccess(`Offer for ₹${amount} sent to ${data.counterpart.displayName}!`);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[82vh] backdrop-blur-xl relative">
      {/* 1. Header with Student Trust Summary */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
        <div className="flex items-center gap-3">
          <Link href="/chat" className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm font-bold text-slate-950 shrink-0">
            {data.counterpart.displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Link href={`/profile/${data.counterpart.username}`} className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                {data.counterpart.displayName}
              </Link>
              {data.counterpart.verificationStatus === 'verified' && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-0.5 text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" /> {data.counterpart.avgRating}
              </span>
              <span>·</span>
              <span>{data.counterpart.completedTransactions} completed</span>
            </div>
          </div>
        </div>

        {/* Counterpart Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-1.5 z-50 text-xs">
              <button
                onClick={() => {
                  setShowMenu(false);
                  setActionSuccess('Report submitted for moderation review.');
                  setTimeout(() => setActionSuccess(''), 4000);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Flag className="w-3.5 h-3.5" /> Report User / Chat
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  setActionSuccess(`${data.counterpart.displayName} has been blocked.`);
                  setTimeout(() => setActionSuccess(''), 4000);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" /> Block User
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Pinned Listing Context & Negotiation Bar */}
      <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        <Link href={`/listings/${data.listing.id}`} className="flex items-center gap-2 min-w-0 flex-1 hover:text-emerald-300 transition-colors">
          <Package className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-white truncate">{data.listing.title}</span>
          <span className="text-emerald-400 font-bold shrink-0">₹{data.listing.price}</span>
        </Link>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowOfferModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-colors"
          >
            <Tag className="w-3 h-3" /> Make Offer
          </button>
          <Link
            href={`/listings/${data.listing.id}`}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
          >
            <Calendar className="w-3 h-3" /> Meetup
          </Link>
        </div>
      </div>

      {/* Feedback Banner */}
      {actionSuccess && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 text-xs text-emerald-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> {actionSuccess}
        </div>
      )}

      {/* Safety Notice */}
      <div className="px-4 py-1.5 bg-slate-950/60 text-[10px] text-slate-400 flex items-center justify-between gap-2 border-b border-slate-800/40">
        <span className="flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" /> Safe Zone: <strong className="text-slate-300">{data.listing.pickupZone}</strong>
        </span>
        <span className="text-slate-500 hidden sm:inline">Never share UPI PIN or phone numbers</span>
      </div>

      {/* 3. Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                msg.isMe
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-xs shadow-md shadow-emerald-950/30'
                  : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-bl-xs shadow-md'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.body}</p>
              <span
                className={`block text-[9px] mt-1 text-right ${
                  msg.isMe ? 'text-emerald-200/70' : 'text-slate-400'
                }`}
              >
                {msg.createdAt}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Input Controls */}
      <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a safe message to Rahul..."
          className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
          value={inputBody}
          onChange={(e) => setInputBody(e.target.value)}
          maxLength={2000}
        />
        <Button type="submit" size="sm" className="h-10 w-10 p-0 rounded-xl shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {/* Offer Negotiation Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" /> Make an Offer
              </h3>
              <p className="text-xs text-slate-400 mt-1">Listing asking price: ₹{data.listing.price}</p>
            </div>

            <form onSubmit={handleSendOffer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase">Your Offer Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-emerald-400 font-bold text-lg rounded-xl focus:outline-none focus:border-emerald-500"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 text-xs">
                  Send Offer
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowOfferModal(false)} className="text-xs">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
