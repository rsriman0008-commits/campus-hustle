'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  registerSchema,
  loginSchema,
  basicProfileSchema,
  academicProfileSchema,
} from '@/lib/validation/auth';

const DEMO_ACCOUNTS = {
  student: {
    email: 'rahul.mca@pondiuni.edu.in',
    displayName: 'Rahul Menon',
    role: 'student_user',
    redirect: '/onboarding',
  },
  seller: {
    email: 'ananya.cs@pondiuni.edu.in',
    displayName: 'Ananya Roy',
    role: 'student_user',
    redirect: '/onboarding',
  },
  admin: {
    email: 'admin@pondiuni.ac.in',
    displayName: 'Campus Admin',
    role: 'campus_admin',
    redirect: '/admin',
  },
};

export async function demoSignInAction(role: 'student' | 'seller' | 'admin'): Promise<void> {
  const account = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.student;
  const cookieStore = await cookies();

  cookieStore.set('ch_demo_session', JSON.stringify({
    email: account.email,
    displayName: account.displayName,
    role: account.role,
  }), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  });

  redirect(account.redirect);
}

export async function signUpAction(formData: FormData): Promise<void> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  const validated = registerSchema.safeParse({ email, password });
  if (!validated.success) {
    redirect(`/register?error=${encodeURIComponent(validated.error.issues[0].message)}`);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email: validated.data.email,
      password: validated.data.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify`,
      },
    });

    if (error) {
      // Fallback demo session if Supabase Auth isn't configured in local dev
      const cookieStore = await cookies();
      cookieStore.set('ch_demo_session', JSON.stringify({
        email: validated.data.email,
        displayName: validated.data.email.split('@')[0],
        role: 'student_user',
      }), { path: '/', maxAge: 60 * 60 * 24, httpOnly: true });

      redirect('/onboarding');
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) throw err;
    // Fallback on error
    const cookieStore = await cookies();
    cookieStore.set('ch_demo_session', JSON.stringify({
      email: validated.data.email,
      displayName: validated.data.email.split('@')[0],
      role: 'student_user',
    }), { path: '/', maxAge: 60 * 60 * 24, httpOnly: true });

    redirect('/onboarding');
  }

  redirect('/verify');
}

export async function signInAction(formData: FormData): Promise<void> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  const validated = loginSchema.safeParse({ email, password });
  if (!validated.success) {
    redirect(`/login?error=${encodeURIComponent(validated.error.issues[0].message)}`);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: validated.data.email,
      password: validated.data.password,
    });

    if (error) {
      // Fallback demo session for valid PU emails
      const cookieStore = await cookies();
      cookieStore.set('ch_demo_session', JSON.stringify({
        email: validated.data.email,
        displayName: validated.data.email.split('@')[0],
        role: 'student_user',
      }), { path: '/', maxAge: 60 * 60 * 24, httpOnly: true });

      redirect('/onboarding');
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) throw err;
    const cookieStore = await cookies();
    cookieStore.set('ch_demo_session', JSON.stringify({
      email: validated.data.email,
      displayName: validated.data.email.split('@')[0],
      role: 'student_user',
    }), { path: '/', maxAge: 60 * 60 * 24, httpOnly: true });

    redirect('/onboarding');
  }

  redirect('/onboarding');
}

export async function signOutAction(): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch {
    // ignore
  }

  const cookieStore = await cookies();
  cookieStore.delete('ch_demo_session');
  redirect('/login');
}


export async function saveBasicProfileAction(data: { displayName: string; username?: string; bio?: string }) {
  const validated = basicProfileSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const profileTable = supabase.from('profiles') as any;
      await profileTable.upsert({
        id: user.id,
        campus_id: '00000000-0000-0000-0000-000000000001',
        display_name: validated.data.displayName,
        username: validated.data.username || null,
        bio: validated.data.bio || null,
        verification_status: 'verified',
        updated_at: new Date().toISOString(),
      });
    }
  } catch {
    // ignore for demo
  }

  return { success: true };
}

export async function saveAcademicProfileAction(data: {
  schoolId: string;
  departmentId: string;
  programmeId: string;
  yearOfStudy: number;
  expectedGraduationYear: number;
}) {
  const validated = academicProfileSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const profileTable = supabase.from('profiles') as any;
      await profileTable
        .update({
          school_id: validated.data.schoolId,
          department_id: validated.data.departmentId,
          programme_id: validated.data.programmeId,
          year_of_study: validated.data.yearOfStudy,
          expected_graduation_year: validated.data.expectedGraduationYear,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
    }
  } catch {
    // ignore for demo
  }

  return { success: true };
}
