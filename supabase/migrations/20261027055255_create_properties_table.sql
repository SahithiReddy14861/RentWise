/*
# RentWise: Create properties table (single-tenant, no auth)

1. Overview
RentWise is a rental comparison platform. This migration creates a single
`properties` table that stores sample rental listings across Indian cities.
The app has no sign-in screen — all visitors browse the same public listings
and favourites are kept in the browser (localStorage). So this is a single-tenant
public-read schema.

2. New Tables
- `properties`
  - `id` uuid primary key
  - `title` text — listing title (e.g. "2BHK near ITPL")
  - `location` text — city/area (e.g. "Whitefield, Bangalore")
  - `city` text — city name used for search/filter grouping
  - `monthly_rent` numeric — monthly rent in INR
  - `refundable_deposit` numeric — refundable deposit in INR
  - `one_time_charges` numeric — additional one-time charges (broker fee, etc.) in INR, default 0
  - `recurring_expenses` numeric — recurring monthly expenses (maintenance, etc.) in INR, default 0
  - `amenities` text[] — array of amenity strings (e.g. {"WiFi","Parking"})
  - `commute_minutes` integer — estimated commute time in minutes
  - `image_url` text — URL to the property photo
  - `description` text — short description
  - `sample` boolean default true — flags the row as sample data, not a live offer
  - `created_at` timestamptz

3. Security
- Enable RLS on `properties`.
- Grant SELECT to `anon, authenticated` so the public frontend (anon key) can read.
- Data is intentionally public/shared, so SELECT uses USING (true). No writes from
  the frontend (listings are seeded via service role), so only SELECT is granted.
*/

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL,
  city text NOT NULL,
  monthly_rent numeric NOT NULL CHECK (monthly_rent >= 0),
  refundable_deposit numeric NOT NULL DEFAULT 0 CHECK (refundable_deposit >= 0),
  one_time_charges numeric NOT NULL DEFAULT 0 CHECK (one_time_charges >= 0),
  recurring_expenses numeric NOT NULL DEFAULT 0 CHECK (recurring_expenses >= 0),
  amenities text[] NOT NULL DEFAULT '{}',
  commute_minutes integer NOT NULL DEFAULT 0 CHECK (commute_minutes >= 0),
  image_url text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sample boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON properties TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_properties" ON properties;
CREATE POLICY "public_read_properties"
  ON properties FOR SELECT
  TO anon, authenticated
  USING (true);
