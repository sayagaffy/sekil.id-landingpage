import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import type { SolutionSegment } from '@/data/solutions';

interface SolutionCTAProps {
  segment: SolutionSegment;
}

export function SolutionCTA({ segment }: SolutionCTAProps) {
  return (
    <section className="bg-navy-900 py-14">
      <Container>
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-2xl font-bold text-paper">
              Siap mengimplementasikan untuk {segment.name.replace('Untuk ', '')} Anda?
            </h2>
            <p className="mt-2 max-w-lg leading-relaxed text-sky-200">
              Diskusikan kebutuhan spesifik institusi Anda dengan tim Sekil.id. Tidak ada komitmen
              — kami siap membantu Anda merancang solusi yang tepat.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button variant="peach" size="lg" asChild>
              <Link href={`/demo?segment=${segment.slug}`}>Hubungi Tim →</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-paper text-paper hover:bg-paper hover:text-ink"
              asChild
            >
              <Link href="/harga">Lihat Harga</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
