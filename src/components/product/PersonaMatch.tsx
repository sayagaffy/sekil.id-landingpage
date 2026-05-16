import { GraduationCap, BookOpen, Award, Briefcase, Users } from 'lucide-react';
import type { TargetPersona } from '@/data/products';
import type { LucideIcon } from 'lucide-react';

interface PersonaMeta {
  label: string;
  icon: LucideIcon;
  description: string;
}

const PERSONA_META: Record<TargetPersona, PersonaMeta> = {
  'siswa-sma': {
    label: 'Siswa SMA',
    icon: GraduationCap,
    description: 'Kelas 10–12 yang merencanakan jurusan kuliah dan karier masa depan',
  },
  mahasiswa: {
    label: 'Mahasiswa',
    icon: BookOpen,
    description: 'Validasi pilihan studi dan eksplorasi arah karier profesional',
  },
  'fresh-grad': {
    label: 'Fresh Graduate',
    icon: Award,
    description: 'Navigasi transisi dari kampus ke dunia kerja dengan percaya diri',
  },
  karyawan: {
    label: 'Karyawan',
    icon: Briefcase,
    description: 'Pengembangan diri dan perencanaan karier profesional jangka panjang',
  },
  manager: {
    label: 'Manager/Pemimpin',
    icon: Users,
    description: 'Memahami dan mengembangkan gaya kepemimpinan yang efektif',
  },
};

interface PersonaMatchProps {
  personas: TargetPersona[];
}

export function PersonaMatch({ personas }: PersonaMatchProps) {
  return (
    <section className="border-b-2 border-ink bg-white py-16" aria-labelledby="persona-heading">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow mb-4">UNTUK SIAPA</p>
        <h2
          id="persona-heading"
          className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
        >
          Asesmen ini dirancang untuk
        </h2>

        <div
          className={`mt-10 grid grid-cols-1 gap-0 border-2 border-ink shadow-md sm:grid-cols-${Math.min(personas.length, 3)}`}
        >
          {personas.map((key, i) => {
            const meta = PERSONA_META[key];
            const Icon = meta.icon;
            return (
              <div
                key={key}
                className={[
                  'flex items-start gap-4 bg-paper p-6',
                  i < personas.length - 1
                    ? 'border-b-2 border-ink sm:border-b-0 sm:border-r-2'
                    : '',
                ].join(' ')}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-ink bg-peach-300">
                  <Icon className="h-6 w-6 text-ink" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display font-semibold text-ink">{meta.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ash-700">{meta.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
