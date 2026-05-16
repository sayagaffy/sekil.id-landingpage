import Link from 'next/link';
import { getMajorBySlug } from '@/data/majors';

interface RelatedMajorsProps {
  slugs: string[];
}

export function RelatedMajors({ slugs }: RelatedMajorsProps) {
  const items = slugs
    .map(getMajorBySlug)
    .filter((m): m is NonNullable<typeof m> => m !== undefined)
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
        Jurusan Kuliah Relevan
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((m) => (
          <Link
            key={m.slug}
            href={`/jurusan/${m.slug}`}
            className="group flex items-start gap-3 border-2 border-ink p-4 transition-colors hover:bg-blue-500"
          >
            <div className="flex-1">
              <span className="block font-display font-bold text-ink group-hover:text-white">
                {m.name}
              </span>
              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-ash-700 group-hover:text-white/80">
                {m.faculty} · {m.typicalDuration}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
