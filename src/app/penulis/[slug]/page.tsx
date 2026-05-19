import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import { Container } from '@/components/layout/Container'
import { JsonLd } from '@/components/seo/JsonLd'
import { PostCard, type PostCardData } from '@/components/blog/PostCard'
import { SanityImage } from '@/components/sanity/SanityImage'
import { sanityFetch } from '@/lib/sanity/live'
import {
  AUTHOR_BY_SLUG_QUERY,
  AUTHOR_POSTS_QUERY,
  ALL_AUTHOR_SLUGS_QUERY,
} from '@/lib/sanity/queries'
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema'
import { SITE_URL } from '@/lib/seo/site-schema'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: ALL_AUTHOR_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })
  return (data ?? []).map((a: { slug: string }) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data: author } = await sanityFetch({
    query: AUTHOR_BY_SLUG_QUERY,
    params: { slug },
    stega: false,
  })
  if (!author) return {}

  const title = `${author.name}${author.credential ? `, ${author.credential}` : ''} | Sekil.id`
  const description = `Profil penulis ${author.name} di Sekil.id.${author.affiliation ? ` ${author.affiliation}` : ''}`

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/penulis/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/penulis/${slug}`,
      type: 'profile',
    },
  }
}

const ROLE_LABEL: Record<string, string> = {
  author: 'Content Author',
  reviewer: 'Academic Reviewer',
  editor: 'Editor',
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params

  const { data: author } = await sanityFetch({
    query: AUTHOR_BY_SLUG_QUERY,
    params: { slug },
  })

  if (!author) notFound()

  const { data: authorPosts } = await sanityFetch({
    query: AUTHOR_POSTS_QUERY,
    params: { authorId: author._id },
  })

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: author.name, url: `/penulis/${slug}` },
  ])

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    ...(author.credential ? { jobTitle: author.credential } : {}),
    ...(author.affiliation
      ? { worksFor: { '@type': 'Organization', name: author.affiliation } }
      : {}),
    url: `${SITE_URL}/penulis/${slug}`,
    ...(author.linkedin ? { sameAs: [author.linkedin] } : {}),
  }

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={personSchema} />

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
                  <span className="text-ink" aria-current="page">{author.name}</span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* Author profile */}
        <section className="border-b-2 border-ink bg-paper py-14">
          <Container>
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
              {author.photo && (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden border-2 border-ink">
                  <SanityImage
                    image={author.photo}
                    alt={author.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="eyebrow mb-2">
                  {ROLE_LABEL[author.role ?? 'author'] ?? 'Penulis'}
                </p>
                <h1 className="font-display text-3xl font-bold text-ink">{author.name}</h1>
                {author.credential && (
                  <p className="mt-1 font-mono text-[12px] text-ash-700">{author.credential}</p>
                )}
                {author.affiliation && (
                  <p className="mt-1 text-sm text-ash-700">{author.affiliation}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-3">
                  {author.linkedin && (
                    <a
                      href={author.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                      LinkedIn →
                    </a>
                  )}
                  {author.orcid && (
                    <a
                      href={`https://orcid.org/${author.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                      ORCID: {author.orcid}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {author.bio && author.bio.length > 0 && (
              <div className="mt-8 max-w-2xl border-t-2 border-ink pt-8 text-base leading-relaxed text-ash-800">
                <PortableText value={author.bio} />
              </div>
            )}
          </Container>
        </section>

        {/* Author's posts */}
        <section className="border-b-2 border-ink bg-white py-14">
          <Container>
            <h2 className="mb-8 font-display text-2xl font-bold text-ink">
              Artikel oleh {author.name}
            </h2>
            {authorPosts && authorPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {authorPosts.map(
                  (post: PostCardData & { _id: string }) => (
                    <PostCard key={post._id} post={post} />
                  ),
                )}
              </div>
            ) : (
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-500">
                Belum ada artikel yang dipublikasikan
              </p>
            )}
          </Container>
        </section>
      </main>
    </>
  )
}
