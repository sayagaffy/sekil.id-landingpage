import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Container } from '@/components/layout/Container'
import { JsonLd } from '@/components/seo/JsonLd'
import { AuthorBio } from '@/components/blog/AuthorBio'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { mdxComponents } from '@/components/mdx/components'
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema'
import { SITE_URL, SITE_NAME } from '@/lib/seo/site-schema'
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/mdx/index'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = getPostBySlug(params.slug)
  if (!result) return {}
  const { meta } = result
  const title = meta.seo?.metaTitle ?? `${meta.title} | Sekil.id Blog`
  const description = meta.seo?.metaDescription ?? meta.description
  const canonical = meta.seo?.canonical ?? `${SITE_URL}/blog/${meta.slug}`
  const robotsDirective = meta.seo?.robots ?? 'index, follow'
  const [robotsIndex, robotsFollow] = robotsDirective.split(',').map((s) => s.trim())
  return {
    title,
    description,
    robots: { index: robotsIndex !== 'noindex', follow: robotsFollow !== 'nofollow' },
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/blog/${meta.slug}`,
      type: 'article',
      publishedTime: meta.publishedAt,
      modifiedTime: meta.modifiedAt,
      authors: [meta.author],
      ...(meta.coverImage ? { images: [meta.coverImage] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

function extractHeadings(content: string): { id: string; text: string }[] {
  const headingRegex = /^## (.+)$/gm
  const headings: { id: string; text: string }[] = []
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1]
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    headings.push({ id, text })
  }
  return headings
}

export default function BlogPostPage({ params }: Props) {
  const result = getPostBySlug(params.slug)
  if (!result) notFound()

  const { meta, content } = result
  const related = getRelatedPosts(meta.slug, meta.category, 3)
  const headings = extractHeadings(content)
  const faq = meta.aeo?.faq ?? []
  const citations = (meta.aeo?.citations ?? []).filter((c) => c.text)
  const keyTakeaways = meta.geo?.keyTakeaways ?? []
  const tldr = meta.geo?.tldr

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: meta.category, url: '/blog' },
    { name: meta.title, url: `/blog/${meta.slug}` },
  ])

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}/blog/${meta.slug}`,
    headline: meta.title,
    description: meta.description,
    url: `${SITE_URL}/blog/${meta.slug}`,
    datePublished: meta.publishedAt,
    dateModified: meta.modifiedAt,
    author: {
      '@type': 'Person',
      name: meta.author,
      ...(meta.authorCredential ? { jobTitle: meta.authorCredential } : {}),
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    keywords: meta.tags.join(', '),
    articleSection: meta.category,
    ...(meta.coverImage ? { image: meta.coverImage } : {}),
    ...(meta.reviewedBy
      ? {
          reviewedBy: {
            '@type': 'Person',
            name: meta.reviewedBy,
            ...(meta.reviewedByCredential ? { jobTitle: meta.reviewedByCredential } : {}),
          },
        }
      : {}),
    ...(meta.aeo?.quotableSummary ? { abstract: meta.aeo.quotableSummary } : {}),
  }

  const faqSchema =
    faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
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
                    {meta.title}
                  </span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* 2 — Hero */}
        <header className="border-b-2 border-ink bg-paper">
          {meta.coverImage && (
            <div className="relative aspect-[21/9] w-full border-b-2 border-ink">
              <Image
                src={meta.coverImage}
                alt={meta.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
          )}
          <Container>
            <div className="py-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="border-2 border-ink bg-peach-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
                  {meta.category}
                </span>
                {meta.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="border border-ash-300 px-2 py-0.5 font-mono text-[10px] text-ash-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mt-4 font-display text-[clamp(28px,4vw,52px)] font-bold leading-tight text-ink">
                {meta.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
                <span>{meta.author}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={meta.publishedAt}>
                  {new Date(meta.publishedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                <span aria-hidden="true">·</span>
                <span>{meta.readingTime}</span>
                {meta.reviewedBy && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Direview: {meta.reviewedBy}</span>
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
                      <span className="mt-1.5 h-2 w-2 shrink-0 border-2 border-blue-500 bg-blue-500/20" aria-hidden />
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

              {/* MDX content */}
              <article className="prose-none min-w-0 max-w-prose" aria-label={meta.title}>
                <MDXRemote source={content} components={mdxComponents} />
              </article>
            </div>
          </Container>
        </div>

        {/* 6 — FAQ section */}
        {faq.length > 0 && (
          <section className="border-b-2 border-ink bg-paper py-12" aria-labelledby="faq-heading">
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

        {/* 8+9 — Author bio + reviewer bio */}
        <div className="border-b-2 border-ink bg-paper py-12">
          <Container>
            <div className="max-w-3xl">
              <AuthorBio meta={meta} />
            </div>
          </Container>
        </div>

        {/* 10 — Related posts */}
        {related.length > 0 && (
          <div className="border-b-2 border-ink bg-paper py-12">
            <Container>
              <div className="max-w-3xl">
                <RelatedPosts posts={related} />
              </div>
            </Container>
          </div>
        )}

        {/* 11 — CTA */}
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
