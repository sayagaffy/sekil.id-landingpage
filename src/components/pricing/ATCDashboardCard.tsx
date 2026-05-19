import Link from 'next/link';
import type { PricingAtcDashboard } from '@/lib/cms/pricing-reader';

interface ATCDashboardCardProps {
  /** ATC data from CMS */
  data: PricingAtcDashboard;
}

export function ATCDashboardCard({ data }: ATCDashboardCardProps) {
  return (
    <div className="border-2 border-ink">
      <div className="border-b-2 border-ink bg-navy-900 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-200">
              Add-on Enterprise
            </p>
            <h3 className="mt-1 font-display text-xl font-bold text-paper">ATC Dashboard</h3>
            <p className="mt-1 text-sm text-sky-200">Assessment Tracking Center</p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-bold text-paper">{data.price}</p>
            <p className="font-mono text-[11px] text-sky-200">{data.priceUnit}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <ul className="space-y-3">
          {data.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span
                className="mt-0.5 h-4 w-4 shrink-0 border-2 border-ink bg-blue-500"
                aria-hidden="true"
              />
              <span className="text-sm leading-relaxed text-ash-700">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t-2 border-ink pt-4">
          <p className="text-xs leading-relaxed text-ash-700">
            Tersedia untuk paket enterprise (Untuk Perusahaan dan Untuk Yayasan). Harga di luar
            biaya asesmen per seat.
          </p>
          <Link
            href="/demo?product=atc-dashboard"
            className="mt-4 inline-block border-2 border-ink bg-blue-500 px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-navy-900"
          >
            Request Demo ATC →
          </Link>
        </div>
      </div>
    </div>
  );
}
