import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/react'
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { PendingReviewBanner } from '@/components/programmatic/PendingReviewBanner';
import { RelatedPersonalities } from '@/components/programmatic/RelatedPersonalities';
import { RelatedCareers } from '@/components/programmatic/RelatedCareers';
import { UniversityList } from '@/components/programmatic/UniversityList';
import { portableTextComponents } from '@/components/sanity/PortableTextComponents'
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
import { SITE_URL } from '@/lib/seo/site-schema';
import { client } from '@/lib/sanity/client'
import { MAJOR_POST_QUERY } from '@/lib/sanity/queries'
import type { ProgrammaticPost } from '@/lib/sanity/types'
import { getMajorBySlug, getAllMajorSlugs, type Major } from '@/data/majors';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllMajorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const major = getMajorBySlug(params.slug);
  if (!major) return {};

  const sanityPost = await client.fetch<ProgrammaticPost | null>(
    MAJOR_POST_QUERY,
    { slug: params.slug },
  )
  const hasContent = !!(sanityPost?.body && sanityPost.body.length > 0)

  const title = sanityPost?.seo?.metaTitle ?? major.seoTitle
  const description = sanityPost?.seo?.metaDescription ?? major.seoDescription

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/jurusan/${params.slug}` },
    robots: hasContent ? 'index,follow' : 'noindex,nofollow',
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/jurusan/${params.slug}`,
      type: 'article',
    },
  };
}

function MajorDataTemplate({ major }: { major: Major }) {
  return (
    <main id="main-content">
      <PendingReviewBanner />

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
                <span className="text-ink">Panduan Jurusan</span>
              </li>
              <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
              <li>
                <span className="text-ink" aria-current="page">
                  {major.name}
                </span>
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      {/* Hero */}
      <header className="border-b-2 border-ink bg-paper py-10">
        <Container>
          <div className="flex flex-wrap items-center gap-2">
            <span className="border-2 border-ink bg-peach-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
              {major.faculty}
            </span>
            <span className="border-2 border-ink bg-paper px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ash-700">
              {major.typicalDuration}
            </span>
          </div>
          <h1 className="mt-3 font-display text-[clamp(28px,4.5vw,56px)] font-bold leading-tight text-ink">
            {major.name}
          </h1>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.12em] text-ash-700">
            {major.shortName}
          </p>
        </Container>
      </header>

      {/* Content */}
      <div className="border-b-2 border-ink bg-white py-12">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 space-y-10">
              {/* Description */}
              <section>
                <p className="text-base leading-relaxed text-ink">{major.description}</p>
              </section>

              {/* Career paths */}
              <section>
                <h2 className="font-display text-xl font-bold text-ink">Prospek Karier</h2>
                <p className="mt-2 text-sm text-ash-700">
                  Beberapa jalur karier utama untuk lulusan {major.name}:
                </p>
                <RelatedCareers slugs={major.careerPaths} />
              </section>

              {/* Holland */}
              <section>
                <h2 className="font-display text-xl font-bold text-ink">
                  Cocok untuk Profil Minat Vokasional
                </h2>
                <p className="mt-2 text-sm text-ash-700">
                  Mahasiswa dengan profil minat vokasional berikut cenderung puas dan berhasil di jurusan
                  ini:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {major.hollandCodes.map((code) => (
                    <Link
                      key={code}
                      href={`/kepribadian/holland-${code.toLowerCase()}`}
                      className="border-2 border-ink px-3 py-1.5 font-mono text-sm font-bold text-ink transition-colors hover:bg-blue-500 hover:text-white"
                    >
                      {code}
                    </Link>
                  ))}
                </div>
              </section>

              {/* Disclaimer */}
              <aside className="border-2 border-ink bg-ash-300/20 p-5">
                <p className="font-mono text-[11px] text-ash-700">
                  <strong>Catatan:</strong> Informasi jurusan ini bersifat indikatif dan mengacu pada
                  kurikulum umum yang berlaku. Kurikulum spesifik bervariasi antar universitas. Hasil
                  ini bukan pengganti konsultasi dengan konselor atau pihak universitas.
                </p>
              </aside>

              {/* Related personalities */}
              <RelatedPersonalities slugs={major.commonPersonalities} />
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <UniversityList universities={major.topUniversitiesIndonesia} />

              <div className="border-2 border-ink bg-paper p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
                  Yakin {major.name} jurusan yang tepat?
                </p>
                <p className="mt-2 text-sm text-ink">
                  Gunakan Path Finder AI untuk mendapatkan rekomendasi jurusan berdasarkan profil
                  minat dan kepribadian Anda.
                </p>
                <Link
                  href="/produk/path-finder-ai"
                  className="mt-4 block border-2 border-ink bg-blue-500 px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-blue-600"
                >
                  Path Finder AI →
                </Link>
                <Link
                  href="/produk/career-interest"
                  className="mt-2 block border-2 border-ink px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  Career Interest Test →
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </div>

      {/* CTA */}
      <section className="border-b-2 border-ink bg-peach-300 py-14">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold text-ink">
              Temukan jurusan yang paling cocok untuk Anda
            </h2>
            <p className="mt-3 text-base text-ink/80">
              Path Finder AI menganalisis profil minat dan kepribadian Anda untuk merekomendasikan 5
              jurusan terbaik — berdasarkan data, bukan tebakan.
            </p>
            <Link
              href="/demo"
              className="mt-6 inline-block border-2 border-ink bg-ink px-8 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-blue-500"
            >
              Minta Demo →
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default async function MajorPage({ params }: Props) {
  const major = getMajorBySlug(params.slug);
  if (!major) notFound();

  const sanityPost = await client.fetch<ProgrammaticPost | null>(
    MAJOR_POST_QUERY,
    { slug: params.slug },
  )
  const hasContent = !!(sanityPost?.body && sanityPost.body.length > 0)

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Panduan Jurusan', url: '/jurusan' },
    { name: major.name, url: `/jurusan/${params.slug}` },
  ]);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/jurusan/${params.slug}`,
    headline: major.seoTitle,
    description: major.seoDescription,
    url: `${SITE_URL}/jurusan/${params.slug}`,
    keywords: major.primaryKeyword,
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
    },
  };

  if (hasContent) {
    return (
      <>
        <JsonLd data={breadcrumb} />
        <JsonLd data={articleSchema} />
        <main id="main-content">
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
                    <span className="text-ink" aria-current="page">
                      {major.name}
                    </span>
                  </li>
                </ol>
              </nav>
            </Container>
          </div>
          <div className="border-b-2 border-ink bg-white py-12">
            <Container>
              <article className="prose-none mx-auto max-w-3xl">
                <PortableText
                  value={sanityPost!.body as PortableTextBlock[]}
                  components={portableTextComponents}
                />
              </article>
              {sanityPost!.reviewedBy && (
                <p className="mx-auto mt-8 max-w-3xl font-mono text-[11px] text-ash-700">
                  Direview oleh: {sanityPost!.reviewedBy}
                </p>
              )}
            </Container>
          </div>
          <div className="border-b-2 border-ink bg-paper py-12">
            <Container>
              <div className="mx-auto max-w-3xl space-y-10">
                <UniversityList universities={major.topUniversitiesIndonesia} />
                <RelatedPersonalities slugs={major.commonPersonalities} />
                <RelatedCareers slugs={major.careerPaths} />
              </div>
            </Container>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={articleSchema} />
      <MajorDataTemplate major={major} />
    </>
  );
}
