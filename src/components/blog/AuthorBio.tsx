import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import type { SanityImage } from '@/lib/sanity/types'

/** Flexible author shape — accepts either MDX string or Sanity Author object */
export interface AuthorBioAuthor {
  name: string
  credential?: string
  slug?: string
  photo?: SanityImage
  affiliation?: string
}

export interface AuthorBioReviewer {
  name: string
  credential?: string
}

export interface AuthorBioProps {
  /** String (legacy MDX) or Author object (Sanity) */
  author?: string | AuthorBioAuthor | null
  /** Reviewer name string (MDX) or object (Sanity) */
  reviewedBy?: string | AuthorBioReviewer | null
  /** Optional credential when author is a plain string (MDX compat) */
  authorCredential?: string
}

function resolveAuthor(
  author: string | AuthorBioAuthor | null | undefined,
  legacyCredential?: string,
): AuthorBioAuthor | null {
  if (!author) return null
  if (typeof author === 'string') return { name: author, credential: legacyCredential }
  return author
}

function resolveReviewer(
  reviewedBy: string | AuthorBioReviewer | null | undefined,
): AuthorBioReviewer | null {
  if (!reviewedBy) return null
  if (typeof reviewedBy === 'string') return { name: reviewedBy }
  return reviewedBy
}

export function AuthorBio({ author, reviewedBy, authorCredential }: AuthorBioProps) {
  const resolvedAuthor = resolveAuthor(author, authorCredential)
  const resolvedReviewer = resolveReviewer(reviewedBy)

  if (!resolvedAuthor && !resolvedReviewer) return null

  const photoUrl =
    resolvedAuthor?.photo?.asset?._ref
      ? urlFor(resolvedAuthor.photo).width(128).height(128).fit('crop').auto('format').url()
      : null

  return (
    <div className="border-2 border-ink p-6">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex h-16 w-16 shrink-0 overflow-hidden border-2 border-ink">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={resolvedAuthor?.name ?? ''}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-ash-300/30">
              <span className="font-mono text-[9px] uppercase text-ash-700">Foto</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
            Penulis
          </p>

          {resolvedAuthor?.slug ? (
            <Link
              href={`/penulis/${resolvedAuthor.slug}`}
              className="mt-0.5 font-display font-bold text-ink transition-colors hover:text-blue-500"
            >
              {resolvedAuthor.name}
            </Link>
          ) : (
            <p className="mt-0.5 font-display font-bold text-ink">
              {resolvedAuthor?.name}
            </p>
          )}

          {resolvedAuthor?.credential && (
            <p className="font-mono text-[11px] text-ash-700">{resolvedAuthor.credential}</p>
          )}

          {resolvedAuthor?.affiliation && (
            <p className="font-mono text-[11px] text-ash-500">{resolvedAuthor.affiliation}</p>
          )}

          <p className="mt-2 text-sm leading-relaxed text-ash-700">
            Tim Sekil.id terdiri dari psikolog, praktisi karier, dan engineer yang berkomitmen
            menyediakan asesmen psikologi terstandar untuk konteks Indonesia.
          </p>
        </div>
      </div>

      {resolvedReviewer && (
        <div className="mt-4 border-t-2 border-ink pt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
            Direview oleh
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">{resolvedReviewer.name}</p>
          <p className="text-sm text-ash-700">
            {resolvedReviewer.credential ?? 'Fakultas Psikologi, UNJANI'}
          </p>
        </div>
      )}
    </div>
  )
}
