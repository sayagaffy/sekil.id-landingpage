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

export function calcVolumeDiscount(seats: number, basePrice: number): VolumeDiscountResult {
  const tier =
    VOLUME_TIERS.find((t) => seats >= t.minSeats) ?? VOLUME_TIERS[VOLUME_TIERS.length - 1];
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

export function getDiscountRate(seats: number): number {
  const tier =
    VOLUME_TIERS.find((t) => seats >= t.minSeats) ?? VOLUME_TIERS[VOLUME_TIERS.length - 1];
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
