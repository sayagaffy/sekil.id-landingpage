import type { Reference } from '@/data/methodology';

interface ReferencesListProps {
  references: Reference[];
}

export function ReferencesList({ references }: ReferencesListProps) {
  return (
    <section aria-labelledby="references-heading">
      <div className="border-2 border-ink shadow-sm">
        <div className="border-b-2 border-ink bg-ink px-6 py-4">
          <h2
            id="references-heading"
            className="font-mono text-[12px] uppercase tracking-[0.14em] text-paper"
          >
            References · APA 7th Edition
          </h2>
        </div>
        <div className="bg-paper px-6 py-6">
          <ol className="space-y-5">
            {references.map((ref, i) => (
              <li key={ref.id} className="flex gap-4 text-sm leading-relaxed text-ink/80">
                <span className="w-5 shrink-0 font-mono text-right text-blue-500">{i + 1}.</span>
                <span>{ref.apa}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
