import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/data/products';
import { PRODUCT_CODES } from '@/data/products';

const INSTRUMENT_LABELS: Record<string, string> = {
  holland: 'Pemetaan Minat Vokasional',
  mbti: 'Preferensi Kepribadian',
  papi: 'Profiling Kebutuhan Kerja',
};

interface ProductHeroProps {
  product: Product;
}

export function ProductHero({ product }: ProductHeroProps) {
  const heroCode = PRODUCT_CODES[product.slug] ?? product.name.toUpperCase().slice(0, 6);

  return (
    <section className="border-b-2 border-ink bg-paper py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto]">
          {/* Left: content */}
          <div>
            <p className="eyebrow mb-4">
              ASESMEN · {product.instruments.map((i) => INSTRUMENT_LABELS[i]).join(' + ')}
            </p>
            <h1 className="font-display text-[clamp(32px,4.5vw,60px)] font-bold leading-[1.05] tracking-tight text-ink">
              {product.nameDisplay}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ash-700">{product.tagline}</p>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 border-2 border-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-ink">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {product.duration}
              </span>
              {product.instruments.map((inst) => (
                <span
                  key={inst}
                  className="border-2 border-blue-500 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-blue-500"
                >
                  {INSTRUMENT_LABELS[inst]}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="mt-8 border-l-4 border-blue-500 pl-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
                Harga per Peserta
              </p>
              <p className="font-display text-3xl font-bold text-ink">{product.priceDisplay}</p>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="brand" size="lg" asChild>
                <Link href={`/demo?product=${product.slug}`}>
                  Hubungi Sales untuk Penawaran →
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#sample-report">Lihat Sample Report</a>
              </Button>
            </div>
          </div>

          {/* Right: product mockup card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative h-[320px] w-[320px] border-2 border-ink bg-peach-300 shadow-lg sm:h-[400px] sm:w-[400px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40">
                  SEKIL.ID
                </span>
                <span className="font-display text-[80px] font-bold leading-none text-ink/20 select-none sm:text-[100px]">
                  {heroCode}
                </span>
                <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/40">
                  {product.name}
                </span>
              </div>
              {/* Decorative corner */}
              <div className="absolute right-0 top-0 h-8 w-8 border-b-2 border-l-2 border-ink bg-paper" />
              <div className="absolute bottom-0 left-0 h-8 w-8 border-r-2 border-t-2 border-ink bg-paper" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
