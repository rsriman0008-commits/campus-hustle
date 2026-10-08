'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { GraduationCap, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signInAction, demoSignInAction } from '@/features/auth/actions';

const DEMO_ACCOUNTS = [
  { role: 'student', label: '🎓 Student' },
  { role: 'seller', label: '🛍️ Seller' },
  { role: 'admin', label: '🛡️ Admin' },
] as const;

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isDemoLoading, setIsDemoLoading] = useState<string | null>(null);

  const redirectTo = searchParams.get('redirectTo') || '/';

  const handleDemoLogin = async (role: 'student' | 'seller' | 'admin') => {
    setIsDemoLoading(role);
    setError('');
    try {
      const fd = new FormData();
      fd.append('role', role);
      fd.append('redirectTo', redirectTo);
      await demoSignInAction(role);
    } catch {
      setError('Demo sign-in failed. Please try again.');
    } finally {
      setIsDemoLoading(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const fd = new FormData(e.currentTarget);
      fd.append('redirectTo', redirectTo);
      try {
        await signInAction(fd);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sign in failed. Please check your credentials.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">

        {/* Logo / Brand */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-400 shadow-sm">
            <GraduationCap className="w-7 h-7 text-slate-900" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Hustle</h1>
            <p className="text-sm text-slate-500 mt-0.5">Pondicherry University Marketplace</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">

          {/* Demo shortcuts */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
              Try a demo account
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map(({ role, label }) => (
                <button
                  key={role}
                  type="button"
                  disabled={!!isDemoLoading}
                  onClick={() => handleDemoLogin(role)}
                  className="py-2 px-1 text-xs font-semibold rounded-xl bg-amber-50 border border-amber-200 text-slate-700 hover:bg-amber-100 hover:border-amber-300 transition-colors disabled:opacity-50 cursor-pointer text-center"
                >
                  {isDemoLoading === role ? '...' : label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">or sign in</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="College Email ID"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="24301001@pondiuni.edu.in"
              helperText="@pondiuni.edu.in or @pondiuni.ac.in"
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                ⚠️ {error}
              </div>
            )}

            <Button type="submit" variant="yellow" className="w-full gap-2" isLoading={isPending}>
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            New PU student?{' '}
            <Link href="/register" className="text-emerald-600 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400">
          Only Pondicherry University students & faculty
        </p>
      </div>
    </div>
  );
}
