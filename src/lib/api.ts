import { supabase } from './supabaseClient';
import type { Property, PropertyFilters } from './types';

// Note on favourites: this MVP keeps favourites in localStorage (no auth was
// requested), so there is no backend table for them. The functions below only
// handle property listing / filtering / details, matching the requested
// REST-style data access layer but backed by Supabase.

export async function fetchProperties(filters: PropertyFilters): Promise<{
  data: Property[] | null;
  error: string | null;
}> {
  let query = supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: true });

  // Always scope to the selected city so search and filters act within it.
  if (filters.city) {
    query = query.eq('city', filters.city);
  }

  if (filters.search.trim()) {
    // Case-insensitive search across location + title (city is already fixed).
    const term = filters.search.trim();
    query = query.or(
      `location.ilike.%${term}%,title.ilike.%${term}%`
    );
  }

  if (filters.minRent != null) {
    query = query.gte('monthly_rent', filters.minRent);
  }
  if (filters.maxRent != null) {
    query = query.lte('monthly_rent', filters.maxRent);
  }

  const { data, error } = await query;
  if (error) {
    return { data: null, error: error.message };
  }

  let result = (data as Property[]) ?? [];

  // Amenities filter: Postgres array containment via the client is done
  // client-side to keep it simple and predictable for an MVP.
  if (filters.amenities.length > 0) {
    result = result.filter((p) =>
      filters.amenities.every((a) => p.amenities?.includes(a))
    );
  }

  return { data: result, error: null };
}

export async function fetchPropertyById(
  id: string
): Promise<{ data: Property | null; error: string | null }> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }
  return { data: (data as Property) ?? null, error: null };
}
