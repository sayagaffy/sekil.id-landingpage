import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { PostCardData } from './PostCard'
import type { SanityImage } from '@/lib/sanity/types'

interface FeaturedPostProps {
  post: PostCardData
}

function resolveCoverImageUrl(
  coverImage: string | SanityImage | null | undefined,
): string | null {
  if (!coverImage) return null
  if (typeof coverImage === 'string') return coverImage
  if (coverImage.asset?._ref) {
    return urlFor(coverImage).width(1200).height(675).fit('crop').auto('format').url()
  }
  return null
}

function resolveAuthorName(author: string | { name: string } | null | undefined): string {
  if (!author) return ''
  if (typeof author === 'string') return author
  return author.name
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const coverUrl = resolveCoverImageUrl(post.coverImage)
  const authorName = resolveAuthorName(post.author)

  return (
    <article className="group border-2 border-ink transition-shadow hover:shadow-[6px_6px_0_0_#0a1230]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Cover image */}
        <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden>
          <div className="relative aspect-video h-full min-h-[240px] overflow-hidden border-b-2 border-ink bg-ash-300/30 lg:border-b-0 lg:border-r-2">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={post.title}
                fill
                priority
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-peach-300/30">
                <span className="font-display text-4xl font-bold text-ink/20">Sekil.id</span>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-col justify-center p-8">
          <div className="flex items-center gap-3">
            <span className="border-2 border-ink bg-peach-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
              Unggulan
            </span>
            <span className="border border-ash-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ash-700">
              {post.category}
            </span>
          </div>

          <h2 className="mt-4 font-display text-[clamp(20px,3vw,32px)] font-bold leading-snug text-ink">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-blue-500">
              {post.title}
            </Link>
          </h2>

          <p className="mt-3 leading-relaxed text-ash-700">{post.description}</p>

          <div className="mt-6 flex items-center justify-between border-t-2 border-ink pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ash-700">
              {authorName && <>{authorName} · </>}
              {post.readingTime && <>{post.readingTime} · </>}
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-blue-500 transition-colors hover:text-ink"
            >
              Baca →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
