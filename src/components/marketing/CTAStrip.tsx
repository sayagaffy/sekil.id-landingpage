import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CTAStripProps {
  heading?: string;
  subtext?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function CTAStrip({
  heading = 'Siap mulai asesmen?',
  subtext = 'Ribuan peserta dari sekolah, kampus, dan perusahaan sudah menggunakan Sekil.id.',
  primaryCta = { label: 'Jadwalkan demo gratis →', href: '/demo' },
  secondaryCta = { label: 'Lihat produk', href: '/produk' },
}: CTAStripProps) {
  return (
    <section className="border-b-2 border-ink bg-navy-900 py-20">
      <div className="mx-auto max-w-[1280px] px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold leading-[0.96] tracking-[-0.03em] text-paper">
              {heading}
            </h2>
            <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-sky-200">
              {subtext}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Button variant="peach" size="lg" asChild>
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-paper text-paper hover:bg-paper hover:text-ink">
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
