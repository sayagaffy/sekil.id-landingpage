import type { PostMeta } from '@/lib/mdx/index';

interface AuthorBioProps {
  meta: PostMeta;
}

export function AuthorBio({ meta }: AuthorBioProps) {
  return (
    <div className="border-2 border-ink p-6">
      <div className="flex gap-4">
        {/* Avatar placeholder */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-ink bg-ash-300/30">
          <span className="font-mono text-[9px] uppercase text-ash-700">Foto</span>
        </div>

        <div className="flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
            Penulis
          </p>
          <p className="mt-0.5 font-display font-bold text-ink">{meta.author}</p>
          {meta.authorCredential && (
            <p className="font-mono text-[11px] text-ash-700">{meta.authorCredential}</p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-ash-700">
            Tim Sekil.id terdiri dari psikolog, praktisi karier, dan engineer yang berkomitmen
            menyediakan asesmen psikologi terstandar untuk konteks Indonesia.
          </p>
        </div>
      </div>

      {meta.reviewedBy && (
        <div className="mt-4 border-t-2 border-ink pt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
            Direview oleh
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">{meta.reviewedBy}</p>
          <p className="text-sm text-ash-700">Fakultas Psikologi, UNJANI</p>
        </div>
      )}
    </div>
  );
}
