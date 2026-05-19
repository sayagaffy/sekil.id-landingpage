import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/react'
import { Container } from '@/components/layout/Container'
import { JsonLd } from '@/components/seo/JsonLd'
import { AuthorBio } from '@/components/blog/AuthorBio'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { SanityImage } from '@/components/sanity/SanityImage'
import { portableTextComponents } from '@/components/sanity/PortableTextComponents'
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema'
import { SITE_URL, SITE_NAME } from '@/lib/seo/site-schema'
import { client } from '@/lib/sanity/client'
import { sanityFetch } from '@/lib/sanity/live'
import type { PostFull } from '@/lib/sanity/types'
import {
  POST_BY_SLUG_QUERY,
  ALL_POST_SLUGS_QUERY,
  RELATED_POSTS_QUERY,
} from '@/lib/sanity/queries'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  // Use raw client (not sanityFetch) — generateStaticParams runs at build time,
  // outside a request scope, so draftMode() cannot be called here.
  const slugs = await client.fetch<Array<{ slug: string | null }>>(ALL_POST_SLUGS_QUERY)
  return (slugs ?? []).map((item) => ({ slug: item.slug ?? '' }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await sanityFetch({ query: POST_BY_SLUG_QUERY, params: { slug: params.slug } })
  const post = result.data as PostFull | null
  if (!post) return {}

  const title = post.seo?.metaTitle ?? `${post.title} | Sekil.id Blog`
  const description = post.seo?.metaDescription ?? post.description
  const canonical = post.seo?.canonical ?? `${SITE_URL}/blog/${post.slug}`
  const robotsDirective = post.seo?.robots ?? 'index, follow'
  const [robotsIndex, robotsFollow] = robotsDirective.split(',').map((s: string) => s.trim())

  return {
    title,
    description,
    robots: { index: robotsIndex !== 'noindex', follow: robotsFollow !== 'nofollow' },
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.modifiedAt ?? undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

/** Extract TOC headings from Portable Text blocks using the block _key as anchor id */
function extractHeadings(
  body: PortableTextBlock[] | undefined,
): { id: string; text: string }[] {
  if (!body) return []
  return body
    .filter(
      (block): block is PortableTextBlock & { _key: string; style: string } =>
        block._type === 'block' &&
        ['h2', 'h3'].includes((block as { style?: string }).style ?? ''),
    )
    .map((block) => {
      const text = (
        (block as { children?: Array<{ text?: string }> }).children ?? []
      )
        .map((child) => child.text ?? '')
        .join('')
      return { id: block._key, text }
    })
}

export default async function BlogPostPage({ params }: Props) {
  const postResult = await sanityFetch({
    query: POST_BY_SLUG_QUERY,
    params: { slug: params.slug },
  })
  const post = postResult.data as PostFull | null

  if (!post) notFound()

  const relatedResult = await sanityFetch({
    query: RELATED_POSTS_QUERY,
    params: { currentSlug: params.slug, category: post.category ?? '', limit: 3 },
  })
  const related = relatedResult.data as PostFull[] | null

  const headings = extractHeadings(post.body as PortableTextBlock[] | undefined)
  const faq = post.aeo?.faq ?? []
  const citations = (post.aeo?.citations ?? []).filter((c) => Boolean(c.text))
  const keyTakeaways = post.geo?.keyTakeaways ?? []
  const tldr = post.geo?.tldr

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.category ?? 'Blog', url: post.category ? `/blog/kategori/${post.category}` : '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ])

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}/blog/${post.slug}`,
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
          ...(post.author.slug ? { url: `${SITE_URL}/penulis/${post.author.slug}` } : {}),
          ...(post.author.credential ? { jobTitle: post.author.credential } : {}),
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    keywords: post.tags?.join(', '),
    articleSection: post.category,
    ...(post.reviewedBy
      ? {
          reviewedBy: {
            '@type': 'Person',
            name: post.reviewedBy.name,
            ...(post.reviewedBy.credential ? { jobTitle: post.reviewedBy.credential } : {}),
          },
        }
      : {}),
    ...(post.aeo?.quotableSummary ? { abstract: post.aeo.quotableSummary } : {}),
  }

  const faqSchema =
    faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }
      : null

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <main id="main-content">
        {/* 1 — Breadcrumb */}
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
                  <Link href="/blog" className="transition-colors hover:text-blue-500">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li>
                  <span className="line-clamp-1 text-ink" aria-current="page">
                    {post.title}
                  </span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* 2 — Hero */}
        <header className="border-b-2 border-ink bg-paper">
          {post.coverImage && (
            <div className="relative aspect-[21/9] w-full border-b-2 border-ink">
              <SanityImage
                image={post.coverImage}
                alt={post.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}
          <Container>
            <div className="py-10">
              <div className="flex flex-wrap items-center gap-2">
                {post.category && (
                  <Link
                    href={`/blog/kategori/${post.category}`}
                    className="border-2 border-ink bg-peach-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-peach-400"
                  >
                    {post.category}
                  </Link>
                )}
                {post.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="border border-ash-300 px-2 py-0.5 font-mono text-[10px] text-ash-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mt-4 font-display text-[clamp(28px,4vw,52px)] font-bold leading-tight text-ink">
                {post.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
                {post.author && (
                  <>
                    {post.author.slug ? (
                      <Link
                        href={`/penulis/${post.author.slug}`}
                        className="transition-colors hover:text-blue-500"
                      >
                        {post.author.name}
                      </Link>
                    ) : (
                      <span>{post.author.name}</span>
                    )}
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <time dateTime={post.publishedAt ?? ''}>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : ''}
                </time>
                {post.reviewedBy && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Direview: {post.reviewedBy.name}</span>
                  </>
                )}
              </div>
            </div>
          </Container>
        </header>

        {/* 3 — TL;DR */}
        {tldr && (
          <div className="border-b-2 border-ink bg-blue-500/5">
            <Container>
              <div className="py-6">
                <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                  TL;DR
                </p>
                <p className="max-w-3xl text-base leading-relaxed text-ink">{tldr}</p>
              </div>
            </Container>
          </div>
        )}

        {/* 4 — Key takeaways */}
        {keyTakeaways.length > 0 && (
          <div className="border-b-2 border-ink bg-paper">
            <Container>
              <div className="py-6">
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
                  Yang akan kamu pelajari
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {keyTakeaways.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ash-700">
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 border-2 border-blue-500 bg-blue-500/20"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </div>
        )}

        {/* 5 — TOC sidebar + article body */}
        <div className="border-b-2 border-ink bg-white py-12">
          <Container>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
              {/* TOC sidebar */}
              {headings.length > 1 && (
                <aside className="hidden lg:block">
                  <nav
                    aria-label="Daftar isi"
                    className="sticky top-8 border-2 border-ink p-4"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
                      Daftar Isi
                    </p>
                    <ol className="mt-3 space-y-2">
                      {headings.map(({ id, text }) => (
                        <li key={id}>
                          <a
                            href={`#${id}`}
                            className="block text-sm leading-tight text-ash-700 transition-colors hover:text-blue-500"
                          >
                            {text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </aside>
              )}

              {/* Article body */}
              <article className="prose-none min-w-0 max-w-prose" aria-label={post.title}>
                {post.body ? (
                  <PortableText
                    value={post.body as PortableTextBlock[]}
                    components={portableTextComponents}
                  />
                ) : (
                  <p className="font-mono text-[11px] text-ash-500">Konten segera tersedia.</p>
                )}
              </article>
            </div>
          </Container>
        </div>

        {/* 6 — FAQ section */}
        {faq.length > 0 && (
          <section
            className="border-b-2 border-ink bg-paper py-12"
            aria-labelledby="faq-heading"
          >
            <Container>
              <div className="max-w-3xl">
                <h2
                  id="faq-heading"
                  className="mb-6 font-display text-2xl font-bold text-ink"
                >
                  Pertanyaan Umum
                </h2>
                <div className="space-y-4">
                  {faq.map((item, i) => (
                    <div key={i} className="border-2 border-ink p-5">
                      <h3 className="font-display text-base font-bold text-ink">
                        {item.question}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ash-700">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* 7 — References / citations */}
        {citations.length > 0 && (
          <section className="border-b-2 border-ink bg-paper/60 py-8">
            <Container>
              <div className="max-w-3xl">
                <h2 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ash-700">
                  Referensi
                </h2>
                <ol className="space-y-1 pl-4">
                  {citations.map((c, i) => (
                    <li key={i} className="text-sm text-ash-700">
                      {c.url ? (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:text-blue-500"
                        >
                          {c.text}
                        </a>
                      ) : (
                        c.text
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </Container>
          </section>
        )}

        {/* 8 — Author bio */}
        <div className="border-b-2 border-ink bg-paper py-12">
          <Container>
            <div className="max-w-3xl">
              <AuthorBio
                author={post.author}
                reviewedBy={post.reviewedBy}
                authorCredential={post.authorCredential ?? undefined}
              />
            </div>
          </Container>
        </div>

        {/* 9 — Related posts */}
        {related && related.length > 0 && (
          <div className="border-b-2 border-ink bg-paper py-12">
            <Container>
              <RelatedPosts posts={related} />
            </Container>
          </div>
        )}

        {/* 10 — CTA */}
        <section className="bg-blue-500 py-14">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-xl font-bold text-white">
                Suka artikel ini? Terima insight terbaru via email
              </h2>
              <div className="mt-4 flex justify-center">
                <Link
                  href="/demo"
                  className="border-2 border-white px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-blue-500"
                >
                  Bergabung Mailing List →
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  )
}
