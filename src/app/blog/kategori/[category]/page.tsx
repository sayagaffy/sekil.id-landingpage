import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { JsonLd } from '@/components/seo/JsonLd'
import { PostCard, type PostCardData } from '@/components/blog/PostCard'
import { sanityFetch } from '@/lib/sanity/live'
import { POSTS_BY_CATEGORY_QUERY } from '@/lib/sanity/queries'
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema'
import { SITE_URL } from '@/lib/seo/site-schema'

const VALID_CATEGORIES = ['Jurusan', 'Karier', 'Psikologi', 'Kepribadian', 'Panduan'] as const
type Category = (typeof VALID_CATEGORIES)[number]

interface Props {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  if (!VALID_CATEGORIES.includes(category as Category)) return {}

  const title = `Artikel Kategori: ${category} | Blog Sekil.id`
  const description = `Kumpulan artikel ${category} dari Sekil.id — berbasis riset, divalidasi tim UNJANI.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/blog/kategori/${category}` },
    openGraph: { title, description, url: `${SITE_URL}/blog/kategori/${category}`, type: 'website' },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params

  if (!VALID_CATEGORIES.includes(category as Category)) notFound()

  const { data: posts } = await sanityFetch({
    query: POSTS_BY_CATEGORY_QUERY,
    params: { category },
  })

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: category, url: `/blog/kategori/${category}` },
  ])

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Blog Sekil.id — ${category}`,
    url: `${SITE_URL}/blog/kategori/${category}`,
    description: `Kumpulan artikel ${category} dari Sekil.id`,
  }

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={collectionSchema} />

      <main id="main-content">
        {/* Breadcrumb */}
        <div className="border-b-2 border-ink bg-paper">
          <Container>
            <nav aria-label="Breadcrumb" className="py-3">
              <ol className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
                <li>
                  <Link href="/" className="transition-colors hover:text-blue-500">Beranda</Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
                <li>
                  <Link href="/blog" className="transition-colors hover:text-blue-500">Blog</Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
                <li>
                  <span className="text-ink" aria-current="page">{category}</span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* Hero */}
        <section className="border-b-2 border-ink bg-paper py-12">
          <Container>
            <p className="eyebrow mb-3">KATEGORI</p>
            <h1 className="font-display text-[clamp(32px,4vw,56px)] font-bold leading-tight text-ink">
              {category}
            </h1>
            <p className="mt-3 font-mono text-[12px] text-ash-700">
              {posts?.length ?? 0} artikel
            </p>

            {/* Category pills for cross-navigation */}
            <div className="mt-6 flex flex-wrap gap-2">
              {VALID_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog/kategori/${cat}`}
                  className={[
                    'border-2 border-ink px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors',
                    cat === category
                      ? 'bg-ink text-paper'
                      : 'bg-paper text-ink hover:bg-ash-100',
                  ].join(' ')}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* Posts grid */}
        <section className="border-b-2 border-ink bg-white py-14">
          <Container>
            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map(
                  (post: PostCardData & { _id: string }) => (
                    <PostCard key={post._id} post={post} />
                  ),
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-ash-300 py-16 text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-500">
                  Belum ada artikel dalam kategori ini
                </p>
                <Link
                  href="/blog"
                  className="mt-4 inline-block font-mono text-[11px] text-blue-600 underline"
                >
                  Lihat semua artikel →
                </Link>
              </div>
            )}
          </Container>
        </section>
      </main>
    </>
  )
}
