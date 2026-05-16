import Link from 'next/link';
import { getPersonalityBySlug } from '@/data/personality-types';

interface RelatedPersonalitiesProps {
  slugs: string[];
}

export function RelatedPersonalities({ slugs }: RelatedPersonalitiesProps) {
  const items = slugs
    .map(getPersonalityBySlug)
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
        Tipe Kepribadian Terkait
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/kepribadian/${p.slug}`}
            className="group border-2 border-ink p-3 transition-colors hover:bg-blue-500"
          >
            <span className="block font-display text-lg font-bold text-ink group-hover:text-white">
              {p.code}
            </span>
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-ash-700 group-hover:text-white/80">
              {p.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
