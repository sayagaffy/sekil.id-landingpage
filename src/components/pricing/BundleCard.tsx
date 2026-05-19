import Link from 'next/link';

interface ResolvedProduct {
  slug: string
  name: string
  price: number
}

interface ResolvedBundle {
  bundleId?: string
  name: string
  tagline: string
  bundlePrice: number
  comingSoon?: boolean
  includedProducts: ResolvedProduct[]
}

interface BundleCardProps {
  bundle: ResolvedBundle
}

export function BundleCard({ bundle }: BundleCardProps) {
  const normalPrice = bundle.includedProducts.reduce((sum, p) => sum + p.price, 0);
  const savingsPct =
    normalPrice > 0 ? Math.round(((normalPrice - bundle.bundlePrice) / normalPrice) * 100) : 0;

  if (bundle.comingSoon) {
    return (
      <div className="flex flex-col border-2 border-ink border-dashed p-6 opacity-60">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
          Segera Hadir
        </p>
        <h3 className="mt-2 font-display text-lg font-bold text-ink">{bundle.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ash-700">{bundle.tagline}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-2 border-ink">
      <div className="border-b-2 border-ink bg-peach-300 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-ink">{bundle.name}</h3>
          {savingsPct > 0 && (
            <span className="shrink-0 border-2 border-ink bg-blue-500 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white">
              –{savingsPct}%
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-ash-700">{bundle.tagline}</p>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <ul className="space-y-2">
          {bundle.includedProducts.map((p) => (
            <li
              key={p.slug}
              className="flex items-center justify-between border-b border-ash-300 pb-2 last:border-b-0 last:pb-0"
            >
              <span className="text-sm text-ink">{p.name}</span>
              <span className="font-mono text-[11px] text-ash-700 line-through">
                Rp {p.price.toLocaleString('id-ID')}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t-2 border-ink pt-4">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
              Harga bundle
            </span>
            <div className="text-right">
              <span className="font-display text-2xl font-bold text-ink">
                Rp {bundle.bundlePrice.toLocaleString('id-ID')}
              </span>
              {normalPrice > 0 && (
                <p className="font-mono text-[11px] text-ash-700">
                  Normal: Rp {normalPrice.toLocaleString('id-ID')}
                </p>
              )}
            </div>
          </div>
        </div>

        <Link
          href={`/demo?bundle=${bundle.bundleId ?? ''}`}
          className="mt-4 block border-2 border-ink bg-ink px-4 py-2.5 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-paper transition-colors hover:bg-blue-500 hover:border-blue-500"
        >
          Dapatkan Bundle →
        </Link>
      </div>
    </div>
  );
}
