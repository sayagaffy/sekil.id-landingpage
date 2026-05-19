export interface VolumeDiscountResult {
  seats: number;
  basePrice: number;
  discountRate: number;
  discountedPricePerSeat: number;
  totalCost: number;
  savingsAmount: number;
}

const VOLUME_TIERS: { minSeats: number; rate: number }[] = [
  { minSeats: 50000, rate: 0.5 },
  { minSeats: 15000, rate: 0.45 },
  { minSeats: 5000, rate: 0.35 },
  { minSeats: 2000, rate: 0.25 },
  { minSeats: 500, rate: 0.15 },
  { minSeats: 0, rate: 0 },
];

type CustomTier = { minSeats: number; discountRate: number }

export function calcVolumeDiscount(
  seats: number,
  basePrice: number,
  customTiers?: CustomTier[]
): VolumeDiscountResult {
  const activeTiers: { minSeats: number; rate: number }[] = customTiers
    ? [...customTiers]
        .sort((a, b) => b.minSeats - a.minSeats)
        .map((t) => ({ minSeats: t.minSeats, rate: t.discountRate }))
    : VOLUME_TIERS
  const tier =
    activeTiers.find((t) => seats >= t.minSeats) ??
    activeTiers[activeTiers.length - 1] ??
    { minSeats: 0, rate: 0 }
  const discountedPricePerSeat = Math.round(basePrice * (1 - tier.rate));
  const totalCost = discountedPricePerSeat * seats;
  const savingsAmount = (basePrice - discountedPricePerSeat) * seats;
  return {
    seats,
    basePrice,
    discountRate: tier.rate,
    discountedPricePerSeat,
    totalCost,
    savingsAmount,
  };
}

export function getDiscountRate(seats: number, customTiers?: CustomTier[]): number {
  const activeTiers: { minSeats: number; rate: number }[] = customTiers
    ? [...customTiers]
        .sort((a, b) => b.minSeats - a.minSeats)
        .map((t) => ({ minSeats: t.minSeats, rate: t.discountRate }))
    : VOLUME_TIERS
  const tier =
    activeTiers.find((t) => seats >= t.minSeats) ??
    activeTiers[activeTiers.length - 1] ??
    { minSeats: 0, rate: 0 }
  return tier.rate;
}

export const VOLUME_TIER_LABELS: { minSeats: number; label: string; rate: number }[] = [
  { minSeats: 0, label: '1–499', rate: 0 },
  { minSeats: 500, label: '500–1.999', rate: 0.15 },
  { minSeats: 2000, label: '2.000–4.999', rate: 0.25 },
  { minSeats: 5000, label: '5.000–14.999', rate: 0.35 },
  { minSeats: 15000, label: '15.000–49.999', rate: 0.45 },
  { minSeats: 50000, label: '50.000+', rate: 0.5 },
];

export function formatRupiah(amount: number): string {
  if (amount >= 1_000_000_000) {
    const val = amount / 1_000_000_000;
    const formatted = Number.isInteger(val) ? val.toString() : val.toFixed(3).replace(/\.?0+$/, '');
    return `Rp ${formatted} miliar`;
  }
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000;
    const formatted = Number.isInteger(val) ? val.toString() : val.toFixed(2).replace(/\.?0+$/, '');
    return `Rp ${formatted} juta`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
}
