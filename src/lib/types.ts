export interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  monthly_rent: number;
  refundable_deposit: number;
  one_time_charges: number;
  recurring_expenses: number;
  amenities: string[];
  commute_minutes: number;
  image_url: string;
  description: string;
  sample: boolean;
  created_at?: string;
}

export interface PropertyFilters {
  city: string;
  search: string;
  minRent: number | null;
  maxRent: number | null;
  amenities: string[];
}

// The two locations this app covers. Keep it simple for the assignment.
export const LOCATIONS = ['Hyderabad', 'Vijayawada'] as const;

export const ALL_AMENITIES = [
  'WiFi',
  'Parking',
  'Lift',
  'Power Backup',
  'Gym',
  'AC',
  'Security',
  'Pool',
] as const;

// Cost helpers — kept in one place so compare + budget logic never drift.

export function firstMonthCost(p: Property): number {
  return p.monthly_rent + p.refundable_deposit + (p.one_time_charges ?? 0);
}

export function recurringMonthlyCost(p: Property): number {
  // Never include the refundable deposit here.
  return p.monthly_rent + (p.recurring_expenses ?? 0);
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}
