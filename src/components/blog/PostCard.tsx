import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityImage } from '@/lib/sanity/types'

/**
 * Unified PostCard data shape that works with both:
 *  - MDX-sourced posts (legacy) — coverImage is a string URL
 *  - Sanity-sourced posts — coverImage is a SanityImage object
 */
export interface PostCardData {
  slug: string
  title: string
  description: string
  publishedAt: string
  category: string
  tags?: string[]
  /** String URL (MDX) or Sanity image object */
  coverImage?: string | SanityImage | null
  /** Display name string (MDX) or Author object with name */
  author?: string | { name: string } | null
  readingTime?: string
}

interface PostCardProps {
  post: PostCardData
}

function resolveCoverImageUrl(
  coverImage: string | SanityImage | null | undefined,
): string | null {
  if (!coverImage) return null
  if (typeof coverImage === 'string') return coverImage
  if (coverImage.asset?._ref) {
    return urlFor(coverImage).width(600).height(338).fit('crop').auto('format').url()
  }
  return null
}

function resolveAuthorName(author: string | { name: string } | null | undefined): string {
  if (!author) return ''
  if (typeof author === 'string') return author
  return author.name
}

export function PostCard({ post }: PostCardProps) {
  const coverUrl = resolveCoverImageUrl(post.coverImage)
  const authorName = resolveAuthorName(post.author)

  return (
    <article className="group flex flex-col border-2 border-ink transition-shadow hover:shadow-[4px_4px_0_0_#0a1230]">
      {/* Cover image */}
      <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden>
        <div className="relative aspect-video w-full overflow-hidden border-b-2 border-ink bg-ash-300/30">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash-300">
                Sekil.id
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {/* Category + reading time */}
        <div className="flex items-center justify-between gap-2">
          <span className="border-2 border-ink bg-peach-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
            {post.category}
          </span>
          {post.readingTime && (
            <span className="font-mono text-[10px] text-ash-700">{post.readingTime}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-blue-500">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="mt-2 text-sm leading-relaxed text-ash-700 line-clamp-2">
          {post.description}
        </p>

        {/* Author + date */}
        <div className="mt-4 border-t-2 border-ink pt-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ash-700">
            {authorName && <>{authorName} · </>}
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </p>
        </div>
      </div>
    </article>
  )
}
