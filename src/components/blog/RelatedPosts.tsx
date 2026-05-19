import { PostCard } from './PostCard'
import type { PostCardData } from './PostCard'

interface RelatedPostsProps {
  posts: PostCardData[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="border-t-2 border-ink pt-12" aria-labelledby="related-heading">
      <p className="eyebrow mb-4">BACA JUGA</p>
      <h2 id="related-heading" className="font-display text-2xl font-bold text-ink">
        Artikel terkait
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
