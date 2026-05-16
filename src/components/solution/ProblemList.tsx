import { Container } from '@/components/layout/Container';

interface ProblemListProps {
  problems: string[];
}

export function ProblemList({ problems }: ProblemListProps) {
  return (
    <section className="border-b-2 border-ink bg-paper py-16" aria-labelledby="problems-heading">
      <Container>
        <p className="eyebrow mb-4">TANTANGAN YANG KAMI SELESAIKAN</p>
        <h2
          id="problems-heading"
          className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
        >
          Masalah yang sering dihadapi
        </h2>

        <ul className="mt-10 grid grid-cols-1 gap-0 border-2 border-ink sm:grid-cols-2">
          {problems.map((problem, i) => (
            <li
              key={i}
              className="flex gap-4 border-b-2 border-ink p-6 last:border-b-0 sm:[&:nth-child(odd)]:border-r-2 sm:[&:nth-child(3)]:border-b-0 sm:[&:nth-child(4)]:border-b-0"
            >
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-peach-300 font-mono text-[11px] font-bold text-ink"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm leading-relaxed text-ash-700">{problem}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
