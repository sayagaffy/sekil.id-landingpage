import Link from 'next/link';
import Image from 'next/image';
import type { PostMeta } from '@/lib/mdx/index';

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group flex flex-col border-2 border-ink transition-shadow hover:shadow-[4px_4px_0_0_#0a1230]">
      {/* Cover image */}
      <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden>
        <div className="relative aspect-video w-full overflow-hidden border-b-2 border-ink bg-ash-300/30">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
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
          <span className="font-mono text-[10px] text-ash-700">{post.readingTime}</span>
        </div>

        {/* Title */}
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-500 transition-colors">
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
            {post.author}
            {' · '}
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
  );
}
