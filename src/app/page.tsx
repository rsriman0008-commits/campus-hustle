import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import HomeClient from './HomeClient';

/**
 * Root page — server component.
 * Redirects unauthenticated visitors to /login.
 * Authenticated users see the marketplace home.
 */
export default async function RootPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('ch_demo_session');

  if (!session) {
    redirect('/login');
  }

  return <HomeClient />;
}
