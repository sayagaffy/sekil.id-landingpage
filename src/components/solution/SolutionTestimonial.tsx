import { Container } from '@/components/layout/Container';
import type { SolutionTestimonial as TestimonialType } from '@/data/solutions';

interface SolutionTestimonialProps {
  testimonial: TestimonialType;
}

export function SolutionTestimonial({ testimonial }: SolutionTestimonialProps) {
  return (
    <section className="border-b-2 border-ink bg-peach-300 py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-6">CERITA PENGGUNA</p>
          <blockquote>
            <p className="font-display text-[clamp(20px,2.5vw,28px)] font-bold leading-snug text-ink">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <footer className="mt-6 border-t-2 border-ink pt-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
                <strong className="text-ink">{testimonial.author}</strong>
                {' · '}
                {testimonial.role}
                {' · '}
                {testimonial.institution}
              </p>
            </footer>
          </blockquote>
        </div>
      </Container>
    </section>
  );
}
