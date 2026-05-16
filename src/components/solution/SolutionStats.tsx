import { Container } from '@/components/layout/Container';
import type { SolutionStat } from '@/data/solutions';

interface SolutionStatsProps {
  stats: SolutionStat[];
}

export function SolutionStats({ stats }: SolutionStatsProps) {
  return (
    <section className="border-b-2 border-ink bg-blue-500 py-14">
      <Container>
        <dl className="grid grid-cols-2 gap-0 border-2 border-ink lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="border-b-2 border-ink p-6 last:border-b-0 [&:nth-child(odd)]:border-r-2 lg:border-b-0 lg:border-r-2 lg:last:border-r-0"
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-100">
                {stat.label}
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold text-white">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
