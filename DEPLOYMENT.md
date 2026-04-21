# 🚀 Hamak Bar — Deployment Guide

## Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- Stripe account
- Vercel account

---

## Step 1 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to **SQL Editor** in your Supabase dashboard
3. Run the migration file:
   ```sql
   -- Copy & paste the contents of:
   supabase/migrations/001_initial_schema.sql
   ```
4. Run the seed data:
   ```sql
   -- Copy & paste the contents of:
   supabase/seed.sql
   ```
5. Copy your API keys from **Project Settings > API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   - `SUPABASE_SERVICE_ROLE_KEY` (from service_role section)

---

## Step 2 — Set Up Stripe

1. Go to [stripe.com](https://stripe.com) and create an account
2. Copy your API keys from the **Developers > API keys** page:
   - `STRIPE_SECRET_KEY` (starts with `sk_test_` or `sk_live_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_` or `pk_live_`)

### Configure Webhook
1. Go to **Developers > Webhooks** in Stripe
2. Click **Add endpoint**
3. Set the URL to: `https://your-domain.vercel.app/api/payments/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## Step 3 — Deploy to Vercel

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add all environment variables from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain, e.g. `https://hamak-bar.vercel.app`)
4. Click **Deploy**

---

## Step 4 — Set Up Admin User

After deploying:

1. Register an account on your website
2. Go to Supabase **Table Editor > profiles**
3. Find your user and change `role` from `user` to `admin`
4. Access the admin panel at `https://your-domain/admin`

---

## Step 5 — Configure Google Fonts (Optional)

The app uses Google Fonts (Playfair Display + Inter) loaded via `next/font/google`.
These load automatically in production with no additional setup needed.

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only!) |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-only!) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (public) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Your production URL (no trailing slash) |

---

## Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in .env.local with your keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **TailwindCSS** + custom design system
- **Supabase** (PostgreSQL + Auth)
- **Stripe** (Checkout + Webhooks)
- **Vercel** (deployment)

---

## Features

✅ 5-step booking wizard with Stripe payment  
✅ Product shop with cart  
✅ Admin dashboard (bookings, services, products, reviews, availability)  
✅ Supabase authentication (login/register)  
✅ Row Level Security (RLS) on all tables  
✅ Stripe webhook handler with signature verification  
✅ Mobile-first responsive design  
✅ Premium dark theme with gold accents  
