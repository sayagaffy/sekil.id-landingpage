import { calcVolumeDiscount } from '@/lib/pricing/calculator';

interface PricingTableProps {
  products: Array<{ slug: string; name: string; duration?: string; price: number }>
  tiers: Array<{ minSeats: number; discountRate: number; label?: string }>
}

export function PricingTable({ products, tiers }: PricingTableProps) {
  const seatSamples = [
    1,
    ...tiers
      .filter((t) => t.minSeats > 0)
      .map((t) => t.minSeats)
      .sort((a, b) => a - b),
  ]

  return (
    <section className="border-b-2 border-ink bg-white py-16" aria-labelledby="pricing-table-heading">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow mb-4">TABEL HARGA</p>
        <h2
          id="pricing-table-heading"
          className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
        >
          Harga per seat berdasarkan volume
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ash-700">
          Harga ditampilkan per seat (per peserta). Semakin banyak seat, semakin besar diskon yang
          Anda dapatkan.
        </p>

        {/* Tier legend */}
        <div className="mt-8 flex flex-wrap gap-2">
          {tiers.map((tier) => (
            <span
              key={tier.label ?? tier.minSeats}
              className="border-2 border-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
            >
              {tier.label ?? tier.minSeats}
              {tier.discountRate > 0 && (
                <span className="ml-1.5 text-blue-500">–{Math.round(tier.discountRate * 100)}%</span>
              )}
            </span>
          ))}
        </div>

        {/* Scrollable table */}
        <div className="mt-8 overflow-x-auto border-2 border-ink">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-ink bg-ink text-paper">
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.14em]">
                  Produk
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.14em]">
                  Durasi
                </th>
                {seatSamples.map((seats) => (
                  <th
                    key={seats}
                    className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.14em]"
                  >
                    {seats.toLocaleString('id-ID')} seat
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, pi) => (
                <tr
                  key={product.slug}
                  className={pi % 2 === 0 ? 'bg-white' : 'bg-ash-50 bg-opacity-50'}
                >
                  <td className="border-b border-ash-300 px-4 py-3 font-display font-semibold text-ink">
                    {product.name}
                  </td>
                  <td className="border-b border-ash-300 px-4 py-3 font-mono text-[11px] text-ash-700">
                    {product.duration ?? ''}
                  </td>
                  {seatSamples.map((seats) => {
                    const result = calcVolumeDiscount(seats, product.price, tiers)
                    const isDiscounted = result.discountRate > 0;
                    return (
                      <td
                        key={seats}
                        className="border-b border-ash-300 px-4 py-3 text-right font-mono text-[12px]"
                      >
                        <span className={isDiscounted ? 'font-bold text-blue-500' : 'text-ink'}>
                          Rp {result.discountedPricePerSeat.toLocaleString('id-ID')}
                        </span>
                        {isDiscounted && (
                          <span className="ml-1 text-[10px] text-ash-700">
                            (–{Math.round(result.discountRate * 100)}%)
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 font-mono text-[11px] text-ash-700">
          * Semua harga dalam Rupiah (IDR), belum termasuk PPN 11%.
        </p>
      </div>
    </section>
  );
}
