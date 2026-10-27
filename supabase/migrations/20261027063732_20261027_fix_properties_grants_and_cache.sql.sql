-- RentWise: tighten properties grants to SELECT-only for anon/authenticated
-- and force a PostgREST schema-cache reload. The table already exists from the
-- original migration; this only corrects over-broad grants that were letting
-- the anon role INSERT/UPDATE/DELETE (with no matching policies, so RLS would
-- still block them, but the grants themselves were wider than intended).
-- The reload also clears the "Could not find the table 'public.properties' in
-- the schema cache" error when it is caused by a stale PostgREST cache.

-- 1. Revoke the over-broad write grants granted earlier.
REVOKE INSERT, UPDATE, DELETE ON properties FROM anon, authenticated;

-- 2. Re-grant only SELECT (matches the original migration intent:
--    public read, no writes from the frontend).
GRANT SELECT ON properties TO anon, authenticated;

-- 3. Make sure RLS is enabled (idempotent).
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 4. Recreate the public-read SELECT policy idempotently.
DROP POLICY IF EXISTS "public_read_properties" ON properties;
CREATE POLICY "public_read_properties"
  ON properties FOR SELECT
  TO anon, authenticated
  USING (true);

-- 5. Force PostgREST to reload its schema cache so the anon-key client
--    immediately sees the properties table and its columns.
NOTIFY pgrst, 'reload schema';
