import Link from 'next/link';
import { ShieldCheck, MapPin, AlertTriangle, Lock, Eye, MessageSquare, Flag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';

const SAFE_ZONES = [
  { name: 'Ananda Rangapillai Central Library Foyer', desc: 'High-visibility main entrance foyer with security desk and CCTV monitoring.', hours: '8:00 AM - 8:00 PM' },
  { name: 'Silver Jubilee Campus Gate Security Foyer', desc: 'Covered security desk area at the main entrance gate.', hours: '7:00 AM - 9:00 PM' },
  { name: 'Science Complex Canteen Foyer', desc: 'Central dining area foyer with high student traffic.', hours: '8:00 AM - 6:00 PM' },
  { name: 'Administrative Building Main Entrance Foyer', desc: 'Primary administrative block foyer near security staff.', hours: '9:00 AM - 5:00 PM' },
  { name: 'Girls Hostel Complex Main Security Desk', desc: 'Hostel gate security reception desk.', hours: '8:00 AM - 7:00 PM' },
  { name: 'Boys Hostel Complex Main Security Desk', desc: 'Central boys hostel security gate area.', hours: '8:00 AM - 8:00 PM' },
];

const SAFETY_RULES = [
  { icon: MapPin, title: 'Meet Only at Approved Safe Zones', desc: 'All handoffs must happen at designated high-visibility campus locations with security presence.' },
  { icon: Lock, title: 'Never Share Financial Secrets or OTPs', desc: 'Campus Hustle never asks for bank PINs, UPI secret codes, or phone OTPs. Never enter a PIN to receive money.' },
  { icon: Eye, title: 'Inspect Items Thoroughly Before Handing Over', desc: 'Examine textbooks, electronics, and goods in person during your daylight meetup window.' },
  { icon: MessageSquare, title: 'Keep All Communication In-App', desc: 'Use in-app chat to protect your university phone number and maintain a verifiable negotiation trail.' },
];

export default function SafetyCenterPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <BackButton fallbackUrl="/" />
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pondicherry University Safety Center</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Built specifically to protect students. Safe pickup zones, verified identities, and anti-scam guidelines.
        </p>
      </div>

      {/* Safety Rules Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {SAFETY_RULES.map((rule) => {
          const Icon = rule.icon;
          return (
            <div key={rule.title} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-emerald-700">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{rule.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{rule.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Approved Campus Safe Zones */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4.5 h-4.5 text-emerald-700" /> Approved Safe Pickup Zones
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            6 Zones Active
          </span>
        </div>

        <div className="grid gap-2.5">
          {SAFE_ZONES.map((zone) => (
            <div key={zone.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">{zone.name}</p>
                <p className="text-slate-500 text-[11px] font-medium">{zone.desc}</p>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-white border border-slate-200 px-2.5 py-1 rounded-lg shrink-0">
                {zone.hours}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency & Report Action */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2 justify-center sm:justify-start">
            <AlertTriangle className="w-4 h-4" /> Need Immediate Assistance or Want to Report?
          </h3>
          <p className="text-xs text-slate-600">
            Report suspicious activity, harassment, or no-shows to campus moderators immediately.
          </p>
        </div>
        <Link href="/admin/reports">
          <Button variant="danger" size="sm" className="gap-1.5 text-xs shrink-0">
            <Flag className="w-3.5 h-3.5" /> Submit Report
          </Button>
        </Link>
      </div>
    </div>
  );
}
