import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { JsonLd } from '@/components/seo/JsonLd'
import { PostCard } from '@/components/blog/PostCard'
import { FeaturedPost } from '@/components/blog/FeaturedPost'
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema'
import { SITE_URL, SITE_NAME } from '@/lib/seo/site-schema'
import { sanityFetch } from '@/lib/sanity/live'
import type { PostSummary } from '@/lib/sanity/types'
import { ALL_POSTS_QUERY } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: 'Blog Sekil.id — Karier, Kepribadian, Pendidikan',
  description:
    'Insight Sekil.id tentang karier, kepribadian, pendidikan, dan dunia kerja Indonesia. Validasi UNJANI.',
  alternates: { canonical: 'https://sekil.id/blog' },
  openGraph: {
    title: 'Blog Sekil.id — Karier, Kepribadian, Pendidikan',
    description:
      'Insight Sekil.id tentang karier, kepribadian, pendidikan, dan dunia kerja Indonesia.',
    url: 'https://sekil.id/blog',
    type: 'website',
  },
}

const CATEGORIES = ['Jurusan', 'Karier', 'Psikologi', 'Kepribadian', 'Panduan'] as const

export default async function BlogPage() {
  const result = await sanityFetch({ query: ALL_POSTS_QUERY })
  const posts = result.data as PostSummary[] | null

  const featured = posts?.find((p) => p.featured) ?? null
  const restPosts = posts?.filter((p) => !p.featured) ?? []

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Blog', url: '/blog' },
  ])

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog`,
    name: 'Blog Sekil.id',
    description: 'Insight tentang karier, kepribadian, pendidikan, dan dunia kerja Indonesia.',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    blogPost: posts?.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.publishedAt,
      url: `${SITE_URL}/blog/${p.slug}`,
      author: {
        '@type': 'Person',
        name: typeof p.author === 'string' ? p.author : (p.author?.name ?? ''),
      },
    })) ?? [],
  }

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={blogSchema} />

      <main id="main-content">
        {/* Breadcrumb */}
        <div className="border-b-2 border-ink bg-paper">
          <Container>
            <nav aria-label="Breadcrumb" className="py-3">
              <ol className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
                <li>
                  <Link href="/" className="transition-colors hover:text-blue-500">
                    Beranda
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li>
                  <span className="text-ink" aria-current="page">
                    Blog
                  </span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* Hero */}
        <section className="border-b-2 border-ink bg-paper py-14">
          <Container>
            <p className="eyebrow mb-4">BLOG SEKIL.ID</p>
            <h1 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.05] tracking-tight text-ink">
              Blog Sekil.id
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ash-700">
              Insight tentang karier, kepribadian, pendidikan, dan dunia kerja Indonesia —
              berbasis riset dan divalidasi tim UNJANI.
            </p>

            {/* Category filter pills — link to category pages */}
            <div className="mt-8 flex flex-wrap gap-2" aria-label="Filter kategori">
              <Link
                href="/blog"
                className="border-2 border-ink bg-ink px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-paper"
                aria-label="Semua (aktif)"
              >
                Semua
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog/kategori/${cat}`}
                  className="border-2 border-ink bg-paper px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ash-100"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* Featured post */}
        {featured && (
          <section className="border-b-2 border-ink bg-white py-10">
            <Container>
              <FeaturedPost post={featured} />
            </Container>
          </section>
        )}

        {/* Article grid */}
        <section className="border-b-2 border-ink bg-paper py-16">
          <Container>
            {restPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-ash-300 py-16 text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
                  Artikel segera hadir
                </p>
              </div>
            )}
          </Container>
        </section>

        {/* Newsletter CTA */}
        <section className="border-b-2 border-ink bg-blue-500 py-14">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow mb-4 text-sky-100">NEWSLETTER</p>
              <h2 className="font-display text-2xl font-bold text-white">
                Terima insight terbaru langsung ke email Anda
              </h2>
              <p className="mt-3 text-sky-100">
                Artikel, riset, dan update platform Sekil.id — tidak lebih dari 2 email per bulan.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/demo"
                  className="border-2 border-white px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-blue-500"
                >
                  Bergabung dengan Mailing List →
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  )
}
