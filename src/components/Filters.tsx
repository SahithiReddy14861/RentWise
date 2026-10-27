import { SlidersHorizontal, Search, X, MapPin } from 'lucide-react';
import { ALL_AMENITIES, LOCATIONS, type PropertyFilters } from '@/lib/types';

interface Props {
  filters: PropertyFilters;
  onChange: (next: PropertyFilters) => void;
}

export default function Filters({ filters, onChange }: Props) {
  const toggleAmenity = (a: string) => {
    const has = filters.amenities.includes(a);
    onChange({
      ...filters,
      amenities: has ? filters.amenities.filter((x) => x !== a) : [...filters.amenities, a],
    });
  };

  const reset = () =>
    onChange({ ...filters, search: '', minRent: null, maxRent: null, amenities: [] });

  const isDirty =
    filters.search.trim() !== '' ||
    filters.minRent != null ||
    filters.maxRent != null ||
    filters.amenities.length > 0;

  return (
    // top-20 clears the sticky header (h-16 + padding) so the sidebar no longer
    // slides under it on mobile. max-h + overflow keeps long sidebars scrollable.
    <aside className="card sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-espresso-900">
          <SlidersHorizontal size={18} className="text-sage-600" />
          <h2 className="font-sans text-base font-semibold">Filters</h2>
        </div>
        {isDirty && (
          <button
            onClick={reset}
            className="text-xs font-medium text-mocha-600 hover:underline"
          >
            Reset all
          </button>
        )}
      </div>

      {/* Location selector — the two cities this app covers */}
      <div className="mb-5">
        <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-espresso-500">
          <MapPin size={12} className="text-mocha-500" /> Location
        </label>
        <div className="grid grid-cols-2 gap-2">
          {LOCATIONS.map((c) => {
            const active = filters.city === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange({ ...filters, city: c, search: '', amenities: [] })}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? 'border-mocha-500 bg-mocha-500 text-white shadow-sm'
                    : 'border-sand-300 bg-white text-espresso-900 hover:border-mocha-400 hover:text-mocha-700'
                }`}
                aria-pressed={active}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search within the selected location (area or title) */}
      <div className="mb-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-espresso-500">
          Search in {filters.city}
        </label>
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-300"
          />
          <input
            type="text"
            placeholder="Area or title"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="input pl-10"
            aria-label="Search by area or title"
          />
        </div>
      </div>

      {/* Rent range */}
      <div className="mb-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-espresso-500">
          Monthly rent (₹)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min"
            value={filters.minRent ?? ''}
            onChange={(e) =>
              onChange({
                ...filters,
                minRent: e.target.value === '' ? null : Number(e.target.value),
              })
            }
            className="input min-w-0"
            aria-label="Minimum monthly rent"
          />
          <span className="shrink-0 text-espresso-300">–</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Max"
            value={filters.maxRent ?? ''}
            onChange={(e) =>
              onChange({
                ...filters,
                maxRent: e.target.value === '' ? null : Number(e.target.value),
              })
            }
            className="input min-w-0"
            aria-label="Maximum monthly rent"
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-espresso-500">
          Must-have amenities
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_AMENITIES.map((a) => {
            const active = filters.amenities.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`chip transition ${
                  active
                    ? 'bg-sage-500 text-white'
                    : 'bg-sand-200 text-espresso-700 hover:bg-sand-300'
                }`}
              >
                {active && <X size={12} />}
                {a}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
