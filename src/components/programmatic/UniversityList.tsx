import type { TopUniversity } from '@/data/majors';

interface UniversityListProps {
  universities: TopUniversity[];
}

export function UniversityList({ universities }: UniversityListProps) {
  if (universities.length === 0) return null;

  const negeri = universities.filter((u) => u.type === 'negeri');
  const swasta = universities.filter((u) => u.type === 'swasta');

  return (
    <div className="border-2 border-ink p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
        Universitas Terbaik di Indonesia
      </p>
      {negeri.length > 0 && (
        <div className="mt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ash-700">
            Perguruan Tinggi Negeri
          </p>
          <ul className="mt-2 space-y-1.5">
            {negeri.map((u) => (
              <li key={u.name} className="flex items-center gap-2 text-sm text-ink">
                <span
                  className="inline-block h-1.5 w-1.5 shrink-0 bg-blue-500"
                  aria-hidden="true"
                />
                {u.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {swasta.length > 0 && (
        <div className="mt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ash-700">
            Perguruan Tinggi Swasta
          </p>
          <ul className="mt-2 space-y-1.5">
            {swasta.map((u) => (
              <li key={u.name} className="flex items-center gap-2 text-sm text-ink">
                <span
                  className="inline-block h-1.5 w-1.5 shrink-0 bg-peach-300"
                  aria-hidden="true"
                />
                {u.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
