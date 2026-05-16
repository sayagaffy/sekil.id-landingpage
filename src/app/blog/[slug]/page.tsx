import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { AuthorBio } from '@/components/blog/AuthorBio';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { mdxComponents } from '@/components/mdx/components';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
import { SITE_URL, SITE_NAME } from '@/lib/seo/site-schema';
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/mdx/index';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = getPostBySlug(params.slug);
  if (!result) return {};
  const { meta } = result;
  return {
    title: `${meta.title} | Sekil.id Blog`,
    description: meta.description,
    alternates: { canonical: `https://sekil.id/blog/${meta.slug}` },
    openGraph: {
      title: `${meta.title} | Sekil.id Blog`,
      description: meta.description,
      url: `https://sekil.id/blog/${meta.slug}`,
      type: 'article',
      publishedTime: meta.publishedAt,
      modifiedTime: meta.modifiedAt,
      authors: [meta.author],
      ...(meta.coverImage ? { images: [meta.coverImage] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta.title} | Sekil.id Blog`,
      description: meta.description,
    },
  };
}

function extractHeadings(content: string): { id: string; text: string }[] {
  const headingRegex = /^## (.+)$/gm;
  const headings: { id: string; text: string }[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1];
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ id, text });
  }
  return headings;
}

export default function BlogPostPage({ params }: Props) {
  const result = getPostBySlug(params.slug);
  if (!result) notFound();

  const { meta, content } = result;
  const related = getRelatedPosts(meta.slug, meta.category, 3);
  const headings = extractHeadings(content);

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: meta.category, url: '/blog' },
    { name: meta.title, url: `/blog/${meta.slug}` },
  ]);

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
          reviewedBy: { '@type': 'Person', name: meta.reviewedBy },
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={articleSchema} />

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
                <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
                <li>
                  <Link href="/blog" className="transition-colors hover:text-blue-500">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
                <li>
                  <span className="text-ink line-clamp-1" aria-current="page">
                    {meta.title}
                  </span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* Article hero */}
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

        {/* Article body + TOC */}
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
                            className="block text-sm leading-tight text-ash-700 hover:text-blue-500 transition-colors"
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
              <article
                className="prose-none min-w-0 max-w-prose"
                aria-label={meta.title}
              >
                <MDXRemote source={content} components={mdxComponents} />
              </article>
            </div>
          </Container>
        </div>

        {/* Author bio + related */}
        <div className="border-b-2 border-ink bg-paper py-12">
          <Container>
            <div className="max-w-3xl">
              <AuthorBio meta={meta} />
              <div className="mt-12">
                <RelatedPosts posts={related} />
              </div>
            </div>
          </Container>
        </div>

        {/* Newsletter CTA */}
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
  );
}
