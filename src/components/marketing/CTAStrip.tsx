import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';

interface CTAStripProps {
  heading?: string;
  subtext?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function CTAStrip({
  heading = 'Mulai Asesmen Sekarang',
  subtext = 'Gratis untuk sekolah & kampus. Jadwalkan demo dengan tim kami.',
  primaryCta = { label: 'Jadwalkan Demo Gratis', href: '/demo' },
  secondaryCta = { label: 'Lihat Produk', href: '/produk' },
}: CTAStripProps) {
  return (
    <section className="bg-primary py-16 text-white">
      <Container>
        <div className="flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{heading}</h2>
            <p className="mt-2 text-primary-100/80">{subtext}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            >
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
