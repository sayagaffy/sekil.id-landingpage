import { Container } from '@/components/layout/Container';
import type { SolutionSegment } from '@/data/solutions';
import { cn } from '@/lib/utils';

interface SolutionHeroProps {
  segment: SolutionSegment;
}

const ACCENT_STYLES: Record<SolutionSegment['heroAccent'], string> = {
  peach: 'bg-peach-300',
  blue: 'bg-blue-500',
  navy: 'bg-navy-900',
  ink: 'bg-ink',
};

const EYEBROW_STYLES: Record<SolutionSegment['heroAccent'], string> = {
  peach: 'text-ink',
  blue: 'text-white',
  navy: 'text-white',
  ink: 'text-white',
};

const HEADLINE_STYLES: Record<SolutionSegment['heroAccent'], string> = {
  peach: 'text-ink',
  blue: 'text-white',
  navy: 'text-white',
  ink: 'text-white',
};

const SUBHEADLINE_STYLES: Record<SolutionSegment['heroAccent'], string> = {
  peach: 'text-ash-700',
  blue: 'text-sky-100',
  navy: 'text-sky-200',
  ink: 'text-ash-300',
};

export function SolutionHero({ segment }: SolutionHeroProps) {
  const accent = segment.heroAccent;

  return (
    <section
      className={cn('border-b-2 border-ink py-20', ACCENT_STYLES[accent])}
      aria-labelledby="solution-hero-heading"
    >
      <Container>
        <p className={cn('eyebrow mb-4', EYEBROW_STYLES[accent])}>{segment.eyebrow}</p>
        <h1
          id="solution-hero-heading"
          className={cn(
            'font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.05] tracking-tight',
            HEADLINE_STYLES[accent],
          )}
        >
          {segment.headline}
        </h1>
        <p className={cn('mt-5 max-w-2xl text-lg leading-relaxed', SUBHEADLINE_STYLES[accent])}>
          {segment.subheadline}
        </p>
      </Container>
    </section>
  );
}
