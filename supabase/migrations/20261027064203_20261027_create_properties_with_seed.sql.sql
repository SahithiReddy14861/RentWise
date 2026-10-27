-- RentWise: Create public.properties table + RLS + sample seed data
-- Schema matches src/lib/types.ts (Property interface) and src/lib/api.ts queries.

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

-- RLS: public read, no writes from the anon-key frontend.
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON properties TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_properties" ON properties;
CREATE POLICY "public_read_properties"
  ON properties FOR SELECT
  TO anon, authenticated
  USING (true);

-- Index the city column used for every browse/filter query.
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties (city);

-- Seed data: 10 sample listings (5 Hyderabad, 5 Vijayawada).
-- Idempotent: a stable "slug" per row + UNIQUE constraint prevents duplicates
-- if this script is re-run. We add a temporary unique key on title+city.
CREATE UNIQUE INDEX IF NOT EXISTS idx_properties_title_city
  ON properties (lower(title), city);

INSERT INTO properties
  (title, location, city, monthly_rent, refundable_deposit, one_time_charges,
   recurring_expenses, amenities, commute_minutes, image_url, description, sample)
VALUES
  ('3BHK Family Apartment in Gachibowli',
   'Gachibowli, Hyderabad', 'Hyderabad', 45000, 90000, 5000, 3000,
   ARRAY['WiFi','Parking','Lift','Power Backup','Gym','Security','Pool'],
   20,
   'https://images.pexels.com/photos/7672060/pexels-photo-7672060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'Family-friendly gated community with parks and amenities.', true),
  ('2BHK near HITEC City',
   'Madhapur, Hyderabad', 'Hyderabad', 32000, 64000, 4000, 2000,
   ARRAY['WiFi','Parking','Lift','Power Backup','Gym','AC'],
   15,
   'https://images.pexels.com/photos/7672061/pexels-photo-7672061.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'Modern 2BHK in the heart of Hyderabads IT corridor.', true),
  ('1BHK Studio in Jubilee Hills',
   'Jubilee Hills, Hyderabad', 'Hyderabad', 28000, 56000, 3000, 1500,
   ARRAY['WiFi','Lift','AC','Security'],
   10,
   'https://images.pexels.com/photos/7587891/pexels-photo-7587891.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'Compact studio perfect for young professionals.', true),
  ('4BHK Villa in Kondapur',
   'Kondapur, Hyderabad', 'Hyderabad', 65000, 130000, 8000, 5000,
   ARRAY['WiFi','Parking','Lift','Power Backup','Gym','AC','Security','Pool'],
   25,
   'https://images.pexels.com/photos/7587890/pexels-photo-7587890.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'Spacious villa with private garden and premium amenities.', true),
  ('2BHK in Kukatpally',
   'Kukatpally, Hyderabad', 'Hyderabad', 22000, 44000, 2000, 1200,
   ARRAY['WiFi','Parking','Lift','Power Backup'],
   30,
   'https://images.pexels.com/photos/7587889/pexels-photo-7587889.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'Affordable family home close to metro and markets.', true),
  ('3BHK Luxury Apartment in Benz Circle',
   'Benz Circle, Vijayawada', 'Vijayawada', 38000, 76000, 4000, 2500,
   ARRAY['WiFi','Parking','Lift','Power Backup','Gym','Security','Pool'],
   12,
   'https://images.pexels.com/photos/7672062/pexels-photo-7672062.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'Premium high-rise with river views and full amenities.', true),
  ('2BHK in MG Road',
   'MG Road, Vijayawada', 'Vijayawada', 18000, 36000, 1500, 800,
   ARRAY['WiFi','Parking','Lift','Power Backup'],
   18,
   'https://images.pexels.com/photos/7672063/pexels-photo-7672063.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'Comfortable mid-town apartment near shopping and transit.', true),
  ('1BHK Studio near Railway Station',
   'Railway Station, Vijayawada', 'Vijayawada', 12000, 24000, 1000, 600,
   ARRAY['WiFi','Parking'],
   8,
   'https://images.pexels.com/photos/7672064/pexels-photo-7672064.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'Compact, well-connected starter home for singles.', true),
  ('4BHK Independent House in Poranki',
   'Poranki, Vijayawada', 'Vijayawada', 42000, 84000, 6000, 3000,
   ARRAY['WiFi','Parking','Power Backup','Gym','AC','Security'],
   22,
   'https://images.pexels.com/photos/7672065/pexels-photo-7672065.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'Spacious independent house with parking for two vehicles.', true),
  ('3BHK in Vijayawada One',
   'Gunadala, Vijayawada', 'Vijayawada', 26000, 52000, 3000, 1800,
   ARRAY['WiFi','Parking','Lift','Power Backup','Gym'],
   14,
   'https://images.pexels.com/photos/7672066/pexels-photo-7672066.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'Modern apartment in a growing residential hub.', true)
ON CONFLICT (lower(title), city) DO NOTHING;

-- Force PostgREST to refresh its schema cache so the anon-key client
-- immediately sees the new table.
NOTIFY pgrst, 'reload schema';
