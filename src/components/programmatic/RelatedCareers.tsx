import Link from 'next/link';
import { getCareerBySlug } from '@/data/careers';

interface RelatedCareersProps {
  slugs: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  teknologi: 'Teknologi',
  bisnis: 'Bisnis',
  kesehatan: 'Kesehatan',
  pendidikan: 'Pendidikan',
  kreatif: 'Kreatif',
  sosial: 'Sosial',
  hukum: 'Hukum',
  teknik: 'Teknik',
  keuangan: 'Keuangan',
};

export function RelatedCareers({ slugs }: RelatedCareersProps) {
  const items = slugs
    .map(getCareerBySlug)
    .filter((c): c is NonNullable<typeof c> => c !== undefined)
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
        Karier yang Cocok
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((c) => (
          <Link
            key={c.slug}
            href={`/karier/${c.slug}`}
            className="group flex items-start gap-3 border-2 border-ink p-4 transition-colors hover:bg-blue-500"
          >
            <div className="flex-1">
              <span className="block font-display font-bold text-ink group-hover:text-white">
                {c.name}
              </span>
              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-ash-700 group-hover:text-white/80">
                {CATEGORY_LABELS[c.category] ?? c.category} · {c.growthOutlook}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
