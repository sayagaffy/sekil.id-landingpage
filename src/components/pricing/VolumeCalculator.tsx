'use client';

import { useState } from 'react';
import { calcVolumeDiscount, formatRupiah } from '@/lib/pricing/calculator';

const SEAT_PRESETS = [100, 250, 500, 1000, 2000, 5000, 15000, 50000];

const SLIDER_STEPS = SEAT_PRESETS.length - 1;

function sliderIndexToSeats(index: number): number {
  return SEAT_PRESETS[Math.round(index)] ?? SEAT_PRESETS[0];
}

interface VolumeCalculatorProps {
  products: Array<{ slug: string; name: string; price: number }>
  tiers: Array<{ minSeats: number; discountRate: number }>
}

export function VolumeCalculator({ products, tiers }: VolumeCalculatorProps) {
  const [selectedSlug, setSelectedSlug] = useState(products[0]?.slug ?? '');
  const [sliderIndex, setSliderIndex] = useState(2);

  const seats = sliderIndexToSeats(sliderIndex);
  const product = products.find((p) => p.slug === selectedSlug) ?? products[0];
  const result = calcVolumeDiscount(seats, product?.price ?? 0, tiers);

  const discountPct = Math.round(result.discountRate * 100);

  return (
    <section className="border-b-2 border-ink bg-paper py-16" aria-labelledby="calc-heading">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow mb-4">KALKULATOR VOLUME</p>
        <h2
          id="calc-heading"
          className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
        >
          Hitung estimasi biaya Anda
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ash-700">
          Sesuaikan jumlah peserta dan pilih produk untuk melihat harga institusional Anda.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-0 border-2 border-ink lg:grid-cols-5">
          {/* Controls */}
          <div className="col-span-3 border-b-2 border-ink p-6 lg:border-b-0 lg:border-r-2">
            {/* Product selector */}
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
                Pilih produk
              </span>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm text-ink focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} — Rp {p.price.toLocaleString('id-ID')}/seat
                  </option>
                ))}
              </select>
            </label>

            {/* Seat slider */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
                  Jumlah seat
                </span>
                <span className="font-display text-2xl font-bold text-ink">
                  {seats.toLocaleString('id-ID')} seat
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={SLIDER_STEPS}
                step={1}
                value={sliderIndex}
                onChange={(e) => setSliderIndex(Number(e.target.value))}
                className="mt-4 h-2 w-full cursor-pointer appearance-none border-2 border-ink bg-ash-300 accent-blue-500"
                aria-label="Jumlah seat"
                aria-valuemin={SEAT_PRESETS[0]}
                aria-valuemax={SEAT_PRESETS[SEAT_PRESETS.length - 1]}
                aria-valuenow={seats}
              />

              {/* Preset labels */}
              <div className="mt-2 flex justify-between">
                {SEAT_PRESETS.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[9px] text-ash-700"
                    aria-hidden="true"
                  >
                    {s >= 1000 ? `${s / 1000}rb` : s}
                  </span>
                ))}
              </div>
            </div>

            {/* Preset buttons */}
            <div className="mt-6 flex flex-wrap gap-2">
              {SEAT_PRESETS.map((s, idx) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSliderIndex(idx)}
                  className={[
                    'border-2 border-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors',
                    sliderIndex === idx
                      ? 'bg-ink text-paper'
                      : 'bg-paper text-ink hover:bg-ash-300',
                  ].join(' ')}
                >
                  {s.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>

          {/* Result panel */}
          <div className="col-span-2 flex flex-col justify-center gap-6 bg-ink p-6 text-paper">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-200">
                Harga per seat
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-paper">
                Rp {result.discountedPricePerSeat.toLocaleString('id-ID')}
              </p>
              {discountPct > 0 && (
                <p className="mt-1 font-mono text-[11px] text-ash-300 line-through">
                  Rp {result.basePrice.toLocaleString('id-ID')} (normal)
                </p>
              )}
            </div>

            {discountPct > 0 && (
              <div className="border-2 border-peach-300 bg-peach-300/10 px-4 py-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-peach-300">
                  Diskon volume
                </p>
                <p className="font-display text-xl font-bold text-peach-300">–{discountPct}%</p>
              </div>
            )}

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-200">
                Total estimasi
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-paper">
                {formatRupiah(result.totalCost)}
              </p>
              {discountPct > 0 && (
                <p className="mt-1 font-mono text-[11px] text-green-400">
                  Hemat {formatRupiah(result.savingsAmount)}
                </p>
              )}
            </div>

            <p className="font-mono text-[10px] text-ash-300">
              * Estimasi belum termasuk PPN 11%. Harga final dikonfirmasi oleh tim sales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
