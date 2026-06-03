import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import type { Product } from '@/data/products';

const INSTRUMENT_LABELS: Record<string, string> = {
  holland: 'Pemetaan Minat Vokasional',
  mbti: 'Preferensi Kepribadian',
  papi: 'Profiling Kebutuhan Kerja',
};

const PERSONA_LABELS: Record<string, string> = {
  'siswa-sma': 'Siswa SMA',
  mahasiswa: 'Mahasiswa',
  'fresh-grad': 'Fresh Grad',
  karyawan: 'Karyawan',
  manager: 'Manager',
};

const ACCENT_HEADER: Record<'peach' | 'blue' | 'navy', string> = {
  peach: 'bg-peach-300 text-ink',
  blue: 'bg-blue-500 text-paper',
  navy: 'bg-navy-900 text-paper',
};

interface ProductCardProps {
  product: Product;
  accentVariant?: 'peach' | 'blue' | 'navy';
  compact?: boolean;
}

export function ProductCard({ product, accentVariant = 'peach', compact = false }: ProductCardProps) {
  const headerClass = ACCENT_HEADER[accentVariant];

  if (compact) {
    return (
      <Link
        href={`/produk/${product.slug}`}
        className="group flex items-center gap-4 border-2 border-ink bg-paper p-4 shadow-sm transition-all duration-120 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md active:translate-x-0 active:translate-y-0 active:shadow-none"
      >
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center border-2 border-ink ${headerClass}`}>
          <span className="font-mono text-[9px] uppercase leading-tight text-center px-0.5">
            {product.duration}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold text-ink truncate">{product.name}</p>
          <p className="text-xs text-ash-700 truncate">{product.tagline}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-sm font-bold text-ink">{product.priceDisplay}</p>
          <ArrowRight className="mt-1 h-3 w-3 text-blue-500 ml-auto" aria-hidden="true" />
        </div>
      </Link>
    );
  }

  return (
    <article className="flex flex-col border-2 border-ink shadow-md transition-all duration-120 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg active:translate-x-0 active:translate-y-0 active:shadow-md">
      {/* Accent header strip */}
      <div className={`border-b-2 border-ink px-5 py-4 ${headerClass}`}>
        <h3 className="font-display text-lg font-bold">{product.name}</h3>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 bg-paper p-5">
        <p className="text-sm leading-relaxed text-ash-700">{product.tagline}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 border border-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink">
            <Clock className="h-2.5 w-2.5" aria-hidden="true" />
            {product.duration}
          </span>
          {product.instruments.map((inst) => (
            <span
              key={inst}
              className="border border-blue-500 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-blue-500"
            >
              {INSTRUMENT_LABELS[inst]}
            </span>
          ))}
        </div>

        {/* Persona pills */}
        <div className="flex flex-wrap gap-1">
          {product.targetPersonas.map((p) => (
            <span
              key={p}
              className="bg-peach-300 px-2 py-0.5 font-mono text-[10px] text-ink"
            >
              {PERSONA_LABELS[p]}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t-2 border-ink bg-paper px-5 py-4">
        <span className="font-display text-xl font-bold text-ink">{product.priceDisplay}</span>
        <Link
          href={`/produk/${product.slug}`}
          className="flex items-center gap-1.5 border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-ink transition-all duration-120 hover:bg-ink hover:text-paper"
        >
          Lihat detail
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
