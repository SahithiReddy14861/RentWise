import { SearchX, Home } from 'lucide-react';

interface Props {
  onReset: () => void;
  title?: string;
  message?: string;
}

export default function EmptyState({
  onReset,
  title = 'No properties match',
  message = 'Try widening your filters — relax the rent range or remove some amenities.',
}: Props) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-sand-200 text-espresso-300">
        <SearchX size={28} />
      </div>
      <h3 className="mt-5 font-sans text-lg font-semibold text-espresso-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-espresso-500">{message}</p>
      <button onClick={onReset} className="btn-primary mt-6">
        <Home size={16} /> Reset filters
      </button>
    </div>
  );
}
