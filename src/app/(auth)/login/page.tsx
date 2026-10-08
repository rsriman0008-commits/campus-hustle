import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  // If already authenticated, send to home
  const cookieStore = await cookies();
  const session = cookieStore.get('ch_demo_session');
  if (session) redirect('/');

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
