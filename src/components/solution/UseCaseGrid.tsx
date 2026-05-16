import { Container } from '@/components/layout/Container';
import type { UseCase } from '@/data/solutions';

interface UseCaseGridProps {
  useCases: UseCase[];
}

export function UseCaseGrid({ useCases }: UseCaseGridProps) {
  return (
    <section className="border-b-2 border-ink bg-white py-16" aria-labelledby="usecases-heading">
      <Container>
        <p className="eyebrow mb-4">CARA PENGGUNAAN</p>
        <h2
          id="usecases-heading"
          className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
        >
          Bagaimana institusi menggunakannya
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-0 border-2 border-ink sm:grid-cols-2">
          {useCases.map((useCase, i) => (
            <div
              key={i}
              className="border-b-2 border-ink p-6 sm:[&:nth-child(odd)]:border-r-2 sm:[&:nth-child(3)]:border-b-0 sm:[&:nth-child(4)]:border-b-0"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-2 font-display text-lg font-bold text-ink">{useCase.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ash-700">{useCase.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
