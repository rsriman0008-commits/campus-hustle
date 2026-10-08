# Campus Hustle — Pondicherry University Marketplace

**Campus Hustle** is a secure, responsive, real-time campus marketplace restricted strictly to verified **Pondicherry University (PU)** students, faculty, and staff.

---

## 🏛️ Key Features

- 🎓 **Strict University Domain Verification**: Restricts access exclusively to `@pondiuni.edu.in` and `@pondiuni.ac.in` domains.
- 📦 **Textbook, Electronics & Campus Services**: Structured listings with image upload pipeline, condition filters, and state machine controls.
- 💬 **Real-time Buyer-Seller Chat**: Instant negotiation with in-thread "Make Offer" and "Schedule Meetup" shortcuts.
- 📍 **Safe Campus Pickup Zones**: Designated daylight meetup locations (Ananda Rangapillai Central Library, Admin Foyer, Science Canteen, Hostel Gates).
- ⭐ **Verified Reviews & Trust Badges**: Dual-party completion confirmation with verified badges (*Verified PU Student*, *Top Rated*, *Power Trader*).
- 🛡️ **Moderation & Admin Workspace**: RBAC-protected dashboard for report handling, listing moderation, and student account suspensions.
- 🔒 **Zero Escrow & Complete Privacy**: Direct cash/UPI exchange; raw transaction history is completely private to participants.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Server Components & Server Actions)
- **Database & Auth**: Supabase PostgreSQL with 26 Tables & Row Level Security (RLS)
- **Validation**: Zod (strict domain & input schemas)
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Testing**: Vitest (Unit & Integration)
- **Security**: Security Headers, Rate Limiting, RBAC authorization

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and set your Supabase project keys:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Automated Tests

Run the complete test suite with 56 unit and integration tests:
```bash
npm run test
```

To run TypeScript verification, linting, and build:
```bash
npx tsc --noEmit
npm run lint
npm run build
```

---

## 📖 Operational Documentation

- **Deployment Runbook**: [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- **Database Migrations**: [`supabase/migrations/00001_initial_schema.sql`](./supabase/migrations/00001_initial_schema.sql)
- **Pondicherry University Seeds**: [`supabase/seeds/00001_pondicherry_university_seed.sql`](./supabase/seeds/00001_pondicherry_university_seed.sql)
