import { X, Scale, Trophy, Wallet, Clock, Check, Minus } from 'lucide-react';
import {
  formatINR,
  firstMonthCost,
  recurringMonthlyCost,
  type Property,
} from '@/lib/types';

interface Props {
  properties: Property[];
  onRemove: (id: string) => void;
  onClose: () => void;
  budget: number | null;
}

export default function CompareTable({
  properties,
  onRemove,
  onClose,
  budget,
}: Props) {
  if (properties.length === 0) return null;

  // Determine cheapest for the highlighted "best value" row.
  const cheapestRecurringId = properties.reduce(
    (best, p) =>
      recurringMonthlyCost(p) < recurringMonthlyCost(best) ? p : best,
    properties[0]
  ).id;

  // Build the grid template from the actual property count so every row —
  // header and data — uses the exact same column structure. This is what was
  // causing rows to misalign under their headers before.
  const labelCol = '120px';
  const dataCols = Array.from({ length: properties.length })
    .map(() => 'minmax(180px, 1fr)')
    .join(' ');
  const gridTemplate = `grid-cols-[${labelCol}_${dataCols}]`;

  const Row = ({
    label,
    icon,
    render,
  }: {
    label: string;
    icon: React.ReactNode;
    render: (p: Property) => React.ReactNode;
  }) => (
    <div
      className={`grid min-w-max border-t border-sand-300 ${gridTemplate}`}
    >
      <div className="sticky left-0 z-10 flex items-center gap-2 bg-sand-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-espresso-500">
        {icon}
        {label}
      </div>
      {properties.map((p) => (
        <div
          key={p.id}
          className="border-l border-sand-300 px-4 py-3 text-sm text-espresso-900"
        >
          {render(p)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-espresso-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6 animate-fade-up">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-sand-100 shadow-pop sm:rounded-3xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-sand-300 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-2 text-espresso-900">
            <Scale size={20} className="text-sage-600" />
            <h2 className="font-sans text-lg font-bold">Side-by-side comparison</h2>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
            aria-label="Close comparison"
          >
            <X size={18} />
          </button>
        </div>

        {/* Table */}
        <div className="scroll-x overflow-x-auto overflow-y-auto">
          {/* Property header row — same grid template as every data row */}
          <div className={`grid min-w-max ${gridTemplate}`}>
            <div className="sticky left-0 z-10 bg-sand-50 px-4 py-4" />
            {properties.map((p) => (
              <div
                key={p.id}
                className="border-l border-sand-300 px-4 py-4"
              >
                <div className="relative">
                  <button
                    onClick={() => onRemove(p.id)}
                    aria-label={`Remove ${p.title} from comparison`}
                    className="absolute -top-1 right-0 z-10 grid h-6 w-6 place-items-center rounded-full bg-sand-200 text-espresso-500 hover:bg-sand-300 hover:text-espresso-900"
                  >
                    <X size={12} />
                  </button>
                  <div className="mb-3 aspect-[16/9] overflow-hidden rounded-xl bg-sand-200">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-sans text-sm font-semibold leading-snug text-espresso-900">
                    {p.title}
                  </h3>
                  <p className="text-xs text-espresso-500">{p.location}</p>
                </div>
              </div>
            ))}
          </div>

          <Row
            label="Monthly rent"
            icon={<Wallet size={12} />}
            render={(p) => formatINR(p.monthly_rent)}
          />
          <Row
            label="Deposit"
            icon={<Wallet size={12} />}
            render={(p) => formatINR(p.refundable_deposit)}
          />
          <Row
            label="One-time charges"
            icon={<Wallet size={12} />}
            render={(p) =>
              p.one_time_charges > 0 ? formatINR(p.one_time_charges) : 'None'
            }
          />
          <Row
            label="Recurring expenses"
            icon={<Wallet size={12} />}
            render={(p) =>
              p.recurring_expenses > 0 ? formatINR(p.recurring_expenses) + '/mo' : 'None'
            }
          />
          <Row
            label="Commute"
            icon={<Clock size={12} />}
            render={(p) => `~${p.commute_minutes} min`}
          />
          <Row
            label="Amenities"
            icon={<Check size={12} />}
            render={(p) => (
              <div className="flex flex-wrap gap-1">
                {p.amenities.map((a) => (
                  <span key={a} className="chip bg-sand-200 text-espresso-700">
                    {a}
                  </span>
                ))}
              </div>
            )}
          />

          {/* Highlighted calculated rows */}
          <div
            className={`grid min-w-max border-t-2 border-sage-400/40 bg-sage-50/50 ${gridTemplate}`}
          >
            <div className="sticky left-0 z-10 flex items-center gap-2 bg-sage-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sage-700">
              <Wallet size={12} /> First month
            </div>
            {properties.map((p) => (
              <div
                key={p.id}
                className="border-l border-sage-200 px-4 py-3 text-sm font-bold text-sage-700"
              >
                {formatINR(firstMonthCost(p))}
              </div>
            ))}
          </div>
          <div
            className={`grid min-w-max border-t border-sage-400/40 bg-sage-50/50 ${gridTemplate}`}
          >
            <div className="sticky left-0 z-10 flex items-center gap-2 bg-sage-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sage-700">
              <Wallet size={12} /> Recurring/mo
            </div>
            {properties.map((p) => {
              const recurring = recurringMonthlyCost(p);
              const over = budget != null && budget > 0 && recurring > budget;
              const cheapest = p.id === cheapestRecurringId;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-1.5 border-l border-sage-200 px-4 py-3 text-sm font-bold ${
                    over ? 'text-rose-600' : 'text-sage-700'
                  }`}
                >
                  {cheapest && <Trophy size={14} className="text-amber-500" />}
                  {formatINR(recurring)}
                  {over && (
                    <span className="text-[10px] font-medium text-rose-600">
                      over budget
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Deposit reminder */}
          <div
            className={`grid min-w-max border-t border-sand-300 ${gridTemplate}`}
          >
            <div className="sticky left-0 z-10 flex items-center gap-2 bg-sand-50 px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-espresso-500">
              <Minus size={12} /> Deposit note
            </div>
            {properties.map((p) => (
              <div
                key={p.id}
                className="border-l border-sand-300 px-4 py-3 text-[11px] text-espresso-500"
              >
                Refundable. Not counted in recurring cost.
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-sand-300 px-5 py-3 text-center text-[11px] text-espresso-500 sm:px-7">
          First month = rent + refundable deposit + one-time charges. Recurring = rent +
          recurring expenses (deposit excluded).
        </div>
      </div>
    </div>
  );
}
