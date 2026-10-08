'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowRight, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { signUpAction, demoSignInAction } from '@/features/auth/actions';

const APPROVED_DOMAINS = ['pondiuni.edu.in', 'pondiuni.ac.in'];

function getDomainStatus(email: string): 'valid' | 'invalid' | 'empty' {
  if (!email) return 'empty';
  const domain = email.split('@')[1];
  if (!domain) return 'empty';
  return APPROVED_DOMAINS.includes(domain) ? 'valid' : 'invalid';
}

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const domainStatus = getDomainStatus(email);

  const handleDemo = async (role: 'student' | 'seller') => {
    setIsDemoLoading(true);
    setError('');
    try {
      await demoSignInAction(role);
    } catch {
      setError('Demo sign-in failed. Please try again.');
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (domainStatus === 'invalid') {
      setError(`Only ${APPROVED_DOMAINS.join(' and ')} emails are allowed.`);
      return;
    }
    setError('');
    startTransition(async () => {
      const fd = new FormData(e.currentTarget);
      try {
        await signUpAction(fd);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      }
    });
  };

  return (
    <div className="space-y-6 max-w-md mx-auto py-6">
      {/* Top Bar with Universal Back Button */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
        <BackButton fallbackUrl="/" />
        <span className="text-xs font-black uppercase tracking-wider bg-emerald-400 px-2.5 py-1 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#111111]">
          Register
        </span>
      </div>

      <div className="bg-white border-2 border-slate-900 p-7 sm:p-8 shadow-[6px_6px_0px_0px_#111111] space-y-6">
        <div className="text-center space-y-2 border-b-2 border-slate-900 pb-4">
          <div className="w-12 h-12 bg-emerald-400 border-2 border-slate-900 flex items-center justify-center font-black mx-auto shadow-[3px_3px_0px_0px_#111111]">
            <GraduationCap className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
            College Email Registration
          </h1>
          <p className="text-xs font-bold text-slate-600">
            Pondicherry University Student Access Only
          </p>
        </div>

        {/* Quick Demo Shortcut */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 text-center">
            One-Click Instant Access Shortcut
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isDemoLoading}
              onClick={() => handleDemo('student')}
              className="py-2 px-1 text-xs font-black rounded-lg bg-emerald-100 border-2 border-slate-900 text-slate-900 hover:bg-emerald-300 shadow-[2px_2px_0px_0px_#111111] transition-all disabled:opacity-50 text-center cursor-pointer"
            >
              🎓 Student Demo
            </button>
            <button
              type="button"
              disabled={isDemoLoading}
              onClick={() => handleDemo('seller')}
              className="py-2 px-1 text-xs font-black rounded-lg bg-sky-100 border-2 border-slate-900 text-slate-900 hover:bg-sky-300 shadow-[2px_2px_0px_0px_#111111] transition-all disabled:opacity-50 text-center cursor-pointer"
            >
              🛍️ Seller Demo
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-900">
              Official College Email ID *
            </label>
            <div className="relative">
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="24301001@pondiuni.edu.in"
                className={`w-full px-4 py-2.5 bg-white border-2 border-slate-900 text-slate-900 text-sm font-bold placeholder-slate-400 focus:outline-none focus:bg-yellow-50 pr-10 ${
                  domainStatus === 'valid'
                    ? 'border-emerald-600'
                    : domainStatus === 'invalid'
                    ? 'border-red-600'
                    : ''
                }`}
              />
              {domainStatus === 'valid' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2 stroke-[2.5]" />
              )}
              {domainStatus === 'invalid' && (
                <AlertCircle className="w-4 h-4 text-red-600 absolute right-3 top-1/2 -translate-y-1/2 stroke-[2.5]" />
              )}
            </div>
            {domainStatus === 'invalid' && (
              <p className="text-[11px] font-black text-red-600">
                Must end with @pondiuni.edu.in or @pondiuni.ac.in
              </p>
            )}
            {domainStatus === 'valid' && (
              <p className="text-[11px] font-black text-emerald-800">✓ Valid Pondicherry University email ID</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-900">
              Choose Password *
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-2.5 bg-white border-2 border-slate-900 text-slate-900 text-sm font-bold placeholder-slate-400 focus:outline-none focus:bg-yellow-50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 hover:text-slate-950"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border-2 border-slate-900 text-red-900 text-xs font-black shadow-[2px_2px_0px_0px_#111111]">
              ⚠️ {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full gap-2 mt-2"
            isLoading={isPending}
            disabled={isPending || domainStatus === 'invalid'}
          >
            Create Account & Continue Onboarding <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="pt-3 border-t-2 border-slate-900 text-center text-xs font-bold text-slate-600">
          Already registered?{' '}
          <Link href="/login" className="text-slate-900 font-black underline hover:bg-yellow-200 px-1">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
