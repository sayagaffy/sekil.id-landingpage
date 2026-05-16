import { UserCircle2 } from 'lucide-react';
import type { UnjaniMember } from '@/data/methodology';

interface UnjaniTeamProps {
  members: UnjaniMember[];
}

export function UnjaniTeam({ members }: UnjaniTeamProps) {
  return (
    <section aria-labelledby="unjani-team-heading">
      <div className="mb-10">
        <p className="eyebrow mb-3">VALIDASI AKADEMIK · UNJANI</p>
        <h2
          id="unjani-team-heading"
          className="font-display text-[clamp(28px,3.5vw,44px)] font-bold text-ink"
        >
          Tim Reviewer Fakultas Psikologi UNJANI
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ash-700">
          Seluruh metodologi, item bank, dan konten asesmen Sekil.id divalidasi oleh tim dosen aktif
          Fakultas Psikologi Universitas Jenderal Achmad Yani (UNJANI), Bandung. Review dilakukan
          secara kuartalan untuk memastikan relevansi dan standar akademik.
        </p>
      </div>

      <div className="grid grid-cols-1 border-2 border-ink shadow-md sm:grid-cols-3">
        {members.map((member, i) => (
          <div
            key={member.id}
            className={[
              'bg-navy-900 p-6',
              i < members.length - 1 ? 'border-b-2 border-ink sm:border-b-0 sm:border-r-2' : '',
            ].join(' ')}
            itemScope
            itemType="https://schema.org/Person"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center border-2 border-peach-300 bg-navy-800">
              <UserCircle2 className="h-10 w-10 text-peach-300" aria-hidden="true" />
            </div>

            <p
              className="mb-1 font-display font-semibold leading-snug text-paper"
              itemProp="name"
            >
              {member.name}
            </p>
            <p
              className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-peach-300"
              itemProp="jobTitle"
            >
              {member.title}
            </p>
            <p className="text-sm leading-relaxed text-sky-200">
              <span className="font-semibold text-peach-300">Peran di Sekil.id: </span>
              {member.roleAtSekil}
            </p>

            <span
              itemProp="affiliation"
              itemScope
              itemType="https://schema.org/Organization"
              className="sr-only"
            >
              <span itemProp="name">Universitas Jenderal Achmad Yani</span>
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-ash-700">
        * Nama spesifik dosen akan diperbarui setelah penandatanganan MoU formal dengan UNJANI.
        Peran dan tanggung jawab seperti tertera telah disepakati dalam term of collaboration.
      </p>
    </section>
  );
}
