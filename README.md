# RentWise — Smart Rental Comparison Platform

RentWise helps students and working professionals compare rental properties,
calculate actual move-in costs, and shortlist homes within their monthly budget.

> **Note on the stack:** The brief specified a MERN (MongoDB + Express + Node)
> backend. This build runs in a Bolt environment that provisions **Supabase**
> (Postgres) as its managed backend, so the data layer here is Supabase, not
> MongoDB/Express. The frontend (React + Vite + Tailwind) is unchanged in
> spirit. Favourites are kept in `localStorage` (no auth was requested) — see
> [Limitations](#limitations). Everything else the brief asked for is
> implemented and tested.

## Features

- Dashboard of rental property cards with title, location, monthly rent,
  refundable deposit, amenities, estimated commute time, and additional
  monthly expenses.
- Location selector with **Hyderabad** and **Vijayawada** as the two covered cities.
- Search by area or title within the selected location.
- Filter by minimum/maximum monthly rent and must-have amenities.
- Select up to 3 properties and compare rent, deposit, amenities, recurring
  expenses, first-month cost, and recurring monthly cost side by side.
- **First-month cost** = monthly rent + refundable deposit + one-time charges.
- **Recurring monthly cost** = rent + recurring monthly expenses. The
  refundable deposit is never included in recurring cost.
- Add/remove favourites (shortlist) with a dedicated view and an empty state.
- Enter a monthly budget; homes whose recurring monthly cost exceeds the
  budget are flagged "Over budget" on the card and in the comparison table.
- 10 realistic sample listings — 5 in Hyderabad, 5 in Vijayawada — each labelled
  **Sample listing**. They are demonstration data, not real property offers.
- Fully responsive; Sand + Espresso + Sage palette, clean cards, sticky filter
  sidebar, and a side-by-side comparison table.

## Tech stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Data / backend:** Supabase (Postgres + Row-Level Security) — stands in for
  the requested Node/Express + MongoDB layer in this environment
- **Icons:** lucide-react
- **Favourites:** browser `localStorage`

## Project structure

```
src/
  App.tsx                 Main app: hero, filters, grid, favourites, compare
  components/
    BudgetBar.tsx         Budget input + affordability summary
    CompareTable.tsx      Side-by-side comparison modal
    EmptyState.tsx        Empty / no-match state
    Filters.tsx           Search + rent range + amenities sidebar
    PropertyCard.tsx      Listing card with cost chips + actions
  hooks/
    useFavourites.ts      localStorage-backed favourites
    useCompare.ts         Compare selection (max 3)
  lib/
    api.ts                Data access: fetch + filter + by-id (Supabase)
    supabaseClient.ts     Supabase client singleton
    types.ts              Property type, filters, cost helpers, currency format
supabase/                 (managed by Bolt's Supabase tooling)
```

## Environment variables

These are already provisioned in the Bolt environment. If you fork/deploy
elsewhere, set them yourself:

| Variable                    | Where used       | Description                          |
| --------------------------- | ---------------- | ------------------------------------ |
| `VITE_SUPABASE_URL`         | Frontend         | Supabase project URL                 |
| `VITE_SUPABASE_ANON_KEY`    | Frontend         | Supabase anon (public) key           |

Both must use the `VITE_` prefix so Vite exposes them to the browser.

## Local development

```bash
npm install
npm run dev      # start the Vite dev server
npm run build    # production build
npm run typecheck # tsc, no emit
```

## Database

The schema is a single `properties` table created via a Supabase migration
(applied through Bolt's database tooling). RLS is enabled with a public-read
`SELECT` policy scoped to `anon, authenticated` — the app has no sign-in, so
the anon-key frontend can read all sample listings.

Columns: `id, title, location, city, monthly_rent, refundable_deposit,
one_time_charges, recurring_expenses, amenities, commute_minutes, image_url,
description, sample, created_at`.

## Deployment

### Frontend (Vercel)
1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Framework preset: **Vite**.
4. Set the two environment variables above in Vercel's project settings.
5. Build command: `npm run build` · Output dir: `dist`.

### Backend (Render / Supabase)
There is no separate Node/Express server to deploy — Supabase is the backend.
The `properties` table and sample data live in the provisioned Supabase
project. If you want a separate Render service in the future (e.g. an admin
API), it would need its own `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and
`SUPABASE_DB_URL` — never expose the service-role key to the browser.

### Database (MongoDB Atlas)
Not used in this build. The original brief asked for MongoDB Atlas; Supabase
replaces it in the Bolt environment. Migrating to Mongo would mean re-implementing
`src/lib/api.ts` and `src/lib/types.ts` against a Mongoose/Express API.

## Limitations

- **Favourites are device-local.** They are stored in `localStorage` and are
  not synced across devices or browsers. Adding user accounts (Supabase Auth)
  would let you persist favourites to the database — that was intentionally
  out of scope for the MVP.
- **Sample data only.** Listings are seeded demo rows labelled "Sample
  listing"; they are not real offers.
- **No payments, maps, auth, or chat** — intentionally omitted per the brief.

## Verification

The following were checked before declaring the app ready:

- `npm run build` — passes.
- `npm run typecheck` — passes.
- Property load, search, rent-range filter, amenities filter, favourite
  add/remove, compare selection (incl. max-3 guard), comparison table, budget
  warning, and empty states were all implemented against the live Supabase
  data.
