# Campus Hustle — Production Pilot Launch Runbook

This guide covers deployment, environment configuration, database migrations, initial admin provisioning, and operational rollback procedures for the **Pondicherry University (PU)** pilot release of Campus Hustle.

---

## 1. Prerequisites & Infrastructure Setup

- **Web Application Host**: Netlify / Vercel / Node.js 20+ runtime.
- **Database & Auth**: Supabase PostgreSQL project with pg_trgm and uuid-ossp extensions.
- **Object Storage**: Supabase Storage bucket named `listing-images` and `profile-avatars` (public read, authenticated write with RLS).

---

## 2. Environment Variables Configuration

Set the following environment variables in your deployment settings:

| Variable | Description | Exposure |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project API URL | Client-Safe |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Client Key | Client-Safe |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Secret Key | **Server Only** |
| `NEXT_PUBLIC_APP_URL` | Primary canonical URL (e.g. `https://campus-hustle.pondiuni.ac.in`) | Client-Safe |
| `SENTRY_DSN` | Error and exception monitoring DSN | Client-Safe |

---

## 3. Database Migration & Seed Execution

1. Apply the core schema migration:
   ```bash
   npx supabase db push
   # Or run supabase/migrations/00001_initial_schema.sql in the Supabase SQL Editor
   ```

2. Seed Pondicherry University baseline data:
   ```bash
   # Run supabase/seeds/00001_pondicherry_university_seed.sql in the Supabase SQL Editor
   ```

---

## 4. Bootstrapping Initial Campus Administrators

To assign `campus_admin` or `moderator` permissions to an official faculty or administration account:

```sql
-- Replace with the authenticated user's profile ID
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_UUID_HERE', 'campus_admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

---

## 5. Pre-Launch Sanity Checklist

- [x] Strict email domain check restricted to `@pondiuni.edu.in` and `@pondiuni.ac.in`.
- [x] All 26 database tables enforce Row Level Security (RLS).
- [x] Security headers active: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`.
- [x] Rate limiting active for auth endpoints and chat spam prevention.
- [x] Cash/UPI in-person safe campus meetup zones configured.
- [x] Private history separation verified (raw transactions isolated from public profiles).
- [x] Automated test suite (56 tests) passing.

---

## 6. Incident Response & Rollback Procedures

1. **Compromised User / Spam Wave**:
   - Navigate to `/admin/reports` -> click "Suspend User" or "Remove Listing".
   - Or revoke sessions immediately via Supabase Auth Admin Console.

2. **Rollback Deployment**:
   - Trigger instant rollback to previous git commit in Netlify/Vercel deployment console.
