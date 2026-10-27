import { Clock, Heart, Scale, MapPin, Check, Wallet } from 'lucide-react';
import {
  formatINR,
  firstMonthCost,
  recurringMonthlyCost,
  type Property,
} from '@/lib/types';

interface Props {
  property: Property;
  isFavourite: boolean;
  isComparing: boolean;
  compareMaxReached: boolean;
  budget: number | null;
  onToggleFavourite: (id: string) => void;
  onToggleCompare: (id: string) => void;
}

export default function PropertyCard({
  property: p,
  isFavourite,
  isComparing,
  compareMaxReached,
  budget,
  onToggleFavourite,
  onToggleCompare,
}: Props) {
  const recurring = recurringMonthlyCost(p);
  const moveIn = firstMonthCost(p);
  const overBudget = budget != null && budget > 0 && recurring > budget;

  const compareDisabled = !isComparing && compareMaxReached;

  return (
    <article className="card group flex h-full flex-col overflow-hidden hover:shadow-card-hover">
      {/* Image — fixed aspect ratio so every card aligns */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-sand-200">
        <img
          src={p.image_url}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {p.sample && (
          <span className="absolute left-3 top-3 chip bg-espresso-900/85 text-sand-100 backdrop-blur">
            Sample listing
          </span>
        )}
        {overBudget && (
          <span className="absolute right-3 top-3 chip bg-rose-500 text-white shadow">
            Over budget
          </span>
        )}
        <button
          onClick={() => onToggleFavourite(p.id)}
          aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          className={`absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition active:scale-90 ${
            isFavourite
              ? 'bg-mocha-500 text-white hover:bg-mocha-600'
              : 'bg-white/90 text-espresso-700 hover:bg-white'
          }`}
        >
          <Heart size={17} fill={isFavourite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title + price: min-w-0 stops long titles from overflowing the price */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 break-words font-sans text-base font-semibold leading-snug text-espresso-900">
            {p.title}
          </h3>
          <div className="shrink-0 text-right">
            <p className="font-sans text-lg font-bold text-espresso-900">
              {formatINR(p.monthly_rent)}
            </p>
            <p className="text-[11px] text-espresso-500">/ month</p>
          </div>
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-espresso-500">
          <MapPin size={14} className="shrink-0" />
          <span className="truncate">{p.location}</span>
        </p>

        <p className="mt-3 text-sm text-espresso-700">{p.description}</p>

        {/* Cost summary chips */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-sand-100 px-3 py-2.5">
            <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-espresso-500">
              <Wallet size={11} /> First month
            </p>
            <p className="mt-0.5 font-sans text-sm font-semibold text-espresso-900">
              {formatINR(moveIn)}
            </p>
          </div>
          <div
            className={`rounded-xl px-3 py-2.5 ${
              overBudget ? 'bg-rose-50' : 'bg-sage-50'
            }`}
          >
            <p
              className={`flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide ${
                overBudget ? 'text-rose-500' : 'text-sage-700'
              }`}
            >
              <Wallet size={11} /> Recurring
            </p>
            <p
              className={`mt-0.5 font-sans text-sm font-semibold ${
                overBudget ? 'text-rose-500' : 'text-sage-700'
              }`}
            >
              {formatINR(recurring)}/mo
            </p>
          </div>
        </div>

        {/* Commute */}
        <p className="mt-3 flex items-center gap-1.5 text-xs text-espresso-500">
          <Clock size={13} className="text-sage-600" />
          ~{p.commute_minutes} min estimated commute
        </p>

        {/* Amenities */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.amenities.slice(0, 6).map((a) => (
            <span key={a} className="chip bg-sand-200 text-espresso-700">
              {a}
            </span>
          ))}
          {p.amenities.length > 6 && (
            <span className="chip bg-sand-200 text-espresso-500">
              +{p.amenities.length - 6}
            </span>
          )}
        </div>

        {/* Spacer pushes the action button to the bottom so cards of different
            heights keep their buttons aligned */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2 pt-1">
          <button
            onClick={() => onToggleCompare(p.id)}
            disabled={compareDisabled}
            className={`flex w-full btn ${
              isComparing
                ? 'bg-espresso-900 text-white hover:bg-espresso-700'
                : compareDisabled
                  ? 'btn-ghost opacity-50'
                  : 'btn-outline'
            }`}
          >
            <Scale size={15} />
            {isComparing ? (
              <span className="flex items-center gap-1">
                <Check size={14} /> Selected
              </span>
            ) : compareDisabled ? (
              'Compare full'
            ) : (
              'Add to compare'
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
