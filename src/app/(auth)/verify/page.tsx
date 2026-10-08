import Link from 'next/link';
import { MailCheck, RefreshCw, Shield, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function VerifyPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6 bg-slate-900/70 border border-slate-800 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto animate-pulse">
          <MailCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Check Your University Inbox</h1>
          <p className="text-sm text-slate-300">
            We sent a verification link to your Pondicherry University email address.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-left space-y-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Shield className="w-4 h-4" />
            <span>Campus Trust & Privacy Pledge</span>
          </div>
          <p>
            Your email is used solely to verify your Pondicherry University student/faculty affiliation. It will never be displayed publicly on your listings or shared with third parties.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button variant="outline" className="w-full sm:w-auto gap-2 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Resend Verification Email
          </Button>
          <Link href="/onboarding" className="w-full sm:w-auto">
            <Button className="w-full gap-2 text-xs">
              Continue to Onboarding <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          Need assistance or domain manual review? Contact{' '}
          <a href="mailto:support@campus-hustle.pondiuni.ac.in" className="text-emerald-400 hover:underline">
            Campus Support
          </a>
        </div>
      </div>
    </div>
  );
}
