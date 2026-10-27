import { Wallet, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { formatINR, type Property, recurringMonthlyCost } from '@/lib/types';

interface Props {
  budget: number | null;
  onBudgetChange: (v: number | null) => void;
  /** Properties currently in view, used to summarise affordability. */
  properties: Property[];
}

export default function BudgetBar({ budget, onBudgetChange, properties }: Props) {
  const value = budget ?? '';

  let summary: { within: number; over: number };

  if (budget == null || budget <= 0 || properties.length === 0) {
    summary = { within: 0, over: 0 };
  } else {
    let within = 0;
    let over = 0;
    for (const p of properties) {
      const cost = recurringMonthlyCost(p);
      if (cost > budget) over += 1;
      else within += 1;
    }
    summary = { within, over };
  }

  const hasBudget = budget != null && budget > 0;

  return (
    <section className="card p-5 sm:p-6">
      {/* Stack on mobile, row on >= sm. gap-4 + flex-wrap keeps the input from
          crowding the label at narrow widths. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sage-50 text-sage-700">
            <Wallet size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="font-sans text-base font-semibold text-espresso-900">
              Monthly budget
            </h3>
            <p className="text-sm text-espresso-500">
              We warn you when a home's recurring monthly cost exceeds your budget.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-espresso-500">
              ₹
            </span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="e.g. 30000"
              value={value}
              onChange={(e) =>
                onBudgetChange(e.target.value === '' ? null : Number(e.target.value))
              }
              className="input pl-7 sm:w-48"
              aria-label="Monthly budget in rupees"
            />
          </div>
          {hasBudget && (
            <button
              onClick={() => onBudgetChange(null)}
              className="btn-ghost"
              aria-label="Clear budget"
              title="Clear budget"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {hasBudget && properties.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-xl bg-sage-50 px-4 py-3 text-sage-700">
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">
              {summary.within} {summary.within === 1 ? 'home' : 'homes'} within budget
            </span>
          </div>
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 ${
              summary.over > 0
                ? 'bg-rose-50 text-rose-600'
                : 'bg-sand-200 text-espresso-500'
            }`}
          >
            <AlertTriangle size={18} />
            <span className="text-sm font-medium">
              {summary.over > 0
                ? `${summary.over} ${summary.over === 1 ? 'home' : 'homes'} over budget`
                : 'Nothing over budget'}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
