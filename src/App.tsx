import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Scale,
  Heart,
  Home as HomeIcon,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';
import { fetchProperties } from '@/lib/api';
import { type Property, type PropertyFilters } from '@/lib/types';
import { useFavourites } from '@/hooks/useFavourites';
import { useCompare } from '@/hooks/useCompare';
import PropertyCard from '@/components/PropertyCard';
import Filters from '@/components/Filters';
import BudgetBar from '@/components/BudgetBar';
import CompareTable from '@/components/CompareTable';
import EmptyState from '@/components/EmptyState';

type View = 'browse' | 'favourites';

const DEFAULT_FILTERS: PropertyFilters = {
  city: 'Hyderabad',
  search: '',
  minRent: null,
  maxRent: null,
  amenities: [],
};

export default function App() {
  const [view, setView] = useState<View>('browse');
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [budget, setBudget] = useState<number | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareNotice, setCompareNotice] = useState<string | null>(null);

  const { favourites, toggleFavourite, isFavourite } = useFavourites();
  const compare = useCompare();

  // Load properties whenever filters change.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchProperties(filters)
      .then(({ data, error: err }) => {
        if (!active) return;
        if (err) {
          setError(err);
          setProperties([]);
        } else {
          setProperties(data ?? []);
        }
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [filters]);

  // In favourites view, show only favourited properties (still respect filters).
  const visibleProperties = useMemo(() => {
    if (view !== 'favourites') return properties;
    const favSet = new Set(favourites);
    return properties.filter((p) => favSet.has(p.id));
  }, [properties, view, favourites]);

  const favouriteCount = favourites.length;
  const compareCount = compare.selected.length;

  const handleToggleCompare = (id: string) => {
    if (!compare.isComparing(id) && compare.maxReached) {
      setCompareNotice('You can compare up to 3 properties at a time.');
      return;
    }
    compare.toggleCompare(id);
  };

  const compareRows = properties.filter((p) => compare.selected.includes(p.id));

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    // overflow-x-hidden guards against any stray horizontal scroll from
    // absolutely-positioned badges or long amenity chips.
    <div className="min-h-screen overflow-x-hidden bg-sand-100">
      {/* Top notice: compare full */}
      {compareNotice && (
        <div className="fixed left-1/2 top-5 z-50 flex max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-full bg-espresso-900 px-5 py-3 text-sm text-sand-100 shadow-pop animate-fade-up">
          <AlertCircle size={16} className="text-amber-400" />
          <span>{compareNotice}</span>
          <button
            onClick={() => setCompareNotice(null)}
            aria-label="Dismiss"
            className="ml-1 text-sand-100/70 hover:text-sand-100"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-sand-300 bg-sand-100/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setView('browse');
              resetFilters();
            }}
            className="flex shrink-0 items-center gap-2.5"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-espresso-900 text-sage-500">
              <Building2 size={18} />
            </div>
            <div className="leading-tight">
              <p className="font-sans text-base font-bold text-espresso-900">RentWise</p>
              <p className="hidden text-[11px] text-espresso-500 sm:block">
                Smart rental comparison
              </p>
            </div>
          </a>

          {/* Nav: wraps to a second row on very small screens instead of
              overflowing horizontally. */}
          <nav className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            <button
              onClick={() => setView('browse')}
              className={`btn ${view === 'browse' ? 'btn-primary' : 'btn-outline'}`}
            >
              <HomeIcon size={15} /> Browse
            </button>
            <button
              onClick={() => setView('favourites')}
              className={`btn ${view === 'favourites' ? 'btn-primary' : 'btn-outline'}`}
            >
              <Heart
                size={15}
                fill={view === 'favourites' ? 'currentColor' : 'none'}
              />
              Shortlist
              {favouriteCount > 0 && (
                <span
                  className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold ${
                    view === 'favourites'
                      ? 'bg-white/25 text-white'
                      : 'bg-mocha-500 text-white'
                  }`}
                >
                  {favouriteCount}
                </span>
              )}
            </button>
            {compareCount > 0 && (
              <button
                onClick={() => setShowCompare(true)}
                className="btn-primary"
              >
                <Scale size={15} /> Compare
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/25 px-1 text-[11px] font-bold">
                  {compareCount}
                </span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero (browse only) */}
      {view === 'browse' && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sage-50/70 via-sand-100 to-sand-100" />
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="max-w-2xl animate-fade-up">
              <span className="chip bg-sage-100 text-sage-700">
                <Sparkles size={13} /> Sample listings for demonstration
              </span>
              <h1 className="mt-4 font-sans text-4xl font-bold leading-tight text-espresso-900 sm:text-5xl">
                Compare rentals the smart way.
              </h1>
              <p className="mt-4 text-base text-espresso-500 sm:text-lg">
                See the real first-month and recurring cost of every home, filter by
                what matters, and shortlist up to three to compare side by side —
                all within your monthly budget.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-espresso-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sage-500" />
                  {properties.length} sample homes in {filters.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-mocha-500" />
                  Hyderabad & Vijayawada only
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  No login required
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* pb-28 leaves room for the floating compare bar so it never covers
          the footnote or last row of cards. */}
      <main className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        {view === 'favourites' && (
          <div className="mb-6 flex flex-wrap items-center gap-2 pt-8">
            <Heart size={20} className="text-mocha-500" />
            <h2 className="font-sans text-2xl font-bold text-espresso-900">
              Your shortlisted homes
            </h2>
            <span className="text-sm text-espresso-500">({favouriteCount})</span>
          </div>
        )}

        {/* Budget summary */}
        <div className="mb-6">
          <BudgetBar
            budget={budget}
            onBudgetChange={setBudget}
            properties={visibleProperties}
          />
        </div>

        {/* Layout: filters + grid (browse) / grid only (favourites) */}
        <div
          className={
            view === 'browse'
              ? 'grid gap-6 lg:grid-cols-[280px_1fr]'
              : 'block'
          }
        >
          {view === 'browse' && (
            <Filters
              filters={filters}
              onChange={setFilters}
            />
          )}

          <div className="min-w-0">
            {/* Section heading + count */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-sans text-lg font-semibold text-espresso-900">
                {loading
                  ? 'Finding homes…'
                  : `${visibleProperties.length} ${
                      visibleProperties.length === 1 ? 'home' : 'homes'
                    } found`}
              </h2>
              {!loading && view === 'browse' && filters.amenities.length > 0 && (
                <span className="text-xs text-espresso-500">
                  Filtering by{' '}
                  {filters.amenities.map((a, i) => (
                    <span key={a}>
                      {i > 0 ? ', ' : ''}
                      <strong className="text-espresso-700">{a}</strong>
                    </span>
                  ))}
                </span>
              )}
            </div>

            {error && (
              <div className="card flex items-center gap-3 border-l-4 border-rose-500 px-5 py-4 text-rose-600">
                <AlertCircle size={18} />
                <div>
                  <p className="font-semibold">Couldn't load properties</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card animate-pulse overflow-hidden">
                    <div className="aspect-[16/10] bg-sand-200" />
                    <div className="space-y-3 p-5">
                      <div className="h-4 w-3/4 rounded bg-sand-200" />
                      <div className="h-3 w-1/2 rounded bg-sand-200" />
                      <div className="h-3 w-full rounded bg-sand-200" />
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="h-12 rounded bg-sand-200" />
                        <div className="h-12 rounded bg-sand-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && visibleProperties.length === 0 && (
              <EmptyState
                onReset={resetFilters}
                title={
                  view === 'favourites' && favouriteCount === 0
                    ? 'No shortlisted homes yet'
                    : 'No properties match'
                }
                message={
                  view === 'favourites' && favouriteCount === 0
                    ? 'Tap the heart on any listing to save it here for easy comparison.'
                    : 'Try widening your filters — relax the rent range or remove some amenities.'
                }
              />
            )}

            {/* Responsive grid: 1 col mobile, 2 col tablet (sm), 3 col desktop (xl) */}
            {!loading && !error && visibleProperties.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProperties.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    isFavourite={isFavourite(p.id)}
                    isComparing={compare.isComparing(p.id)}
                    compareMaxReached={compare.maxReached}
                    budget={budget}
                    onToggleFavourite={toggleFavourite}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footnote */}
        <p className="mx-auto mt-12 max-w-2xl text-center text-xs text-espresso-500">
          RentWise uses sample listings to demonstrate cost calculations — these are
          not live property offers. Favourites are stored in your browser only.
        </p>
      </main>

      {/* Floating compare bar — centered, sits above content, never overlaps
          the last card thanks to main's pb-28. */}
      {compareCount > 0 && !showCompare && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 sm:bottom-6 sm:px-0">
          <div className="flex w-full max-w-md flex-wrap items-center justify-between gap-3 rounded-2xl border border-sand-300 bg-espresso-900 px-4 py-3 text-sand-100 shadow-pop animate-fade-up sm:max-w-lg">
            <div className="flex items-center gap-2 text-sm">
              <Scale size={16} className="text-sage-400" />
              <span className="font-semibold">{compareCount}</span>
              <span className="text-sand-100/70">/ 3 selected to compare</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => compare.clearCompare()}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-sand-100/80 hover:bg-white/10"
              >
                Clear
              </button>
              <button
                onClick={() => setShowCompare(true)}
                className="btn-primary py-2"
              >
                Compare now
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompare && (
        <CompareTable
          properties={compareRows}
          onRemove={compare.toggleCompare}
          onClose={() => setShowCompare(false)}
          budget={budget}
        />
      )}
    </div>
  );
}
