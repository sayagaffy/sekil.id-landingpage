import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { PendingReviewBanner } from '@/components/programmatic/PendingReviewBanner';
import { RelatedCareers } from '@/components/programmatic/RelatedCareers';
import { RelatedMajors } from '@/components/programmatic/RelatedMajors';
import { mdxComponents } from '@/components/mdx/components';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
import { SITE_URL } from '@/lib/seo/site-schema';
import { getProgrammaticContent } from '@/lib/mdx/programmatic';
import {
  getPersonalityBySlug,
  getAllPersonalitySlugs,
  type PersonalityType,
} from '@/data/personality-types';

interface Props {
  params: { type: string };
}

export function generateStaticParams() {
  return getAllPersonalitySlugs().map((type) => ({ type }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const personality = getPersonalityBySlug(params.type);
  if (!personality) return {};

  const hasMdx = !!getProgrammaticContent('kepribadian', params.type);

  return {
    title: personality.seoTitle,
    description: personality.seoDescription,
    alternates: { canonical: `${SITE_URL}/kepribadian/${params.type}` },
    robots: hasMdx ? 'index,follow' : 'noindex,nofollow',
    openGraph: {
      title: personality.seoTitle,
      description: personality.seoDescription,
      url: `${SITE_URL}/kepribadian/${params.type}`,
      type: 'article',
    },
  };
}

function PersonalityDataTemplate({ personality }: { personality: PersonalityType }) {
  const isHolland = personality.type === 'holland';

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
                <span className="text-ink">{isHolland ? 'Holland Code' : 'MBTI'}</span>
              </li>
              <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
              <li>
                <span className="text-ink" aria-current="page">
                  {personality.code}
                </span>
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      {/* Hero */}
      <header className="border-b-2 border-ink bg-paper py-10">
        <Container>
          <span className="inline-block border-2 border-ink bg-peach-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
            {isHolland ? `Holland Code ${personality.code}` : `MBTI · ${personality.code}`}
          </span>
          <h1 className="mt-3 font-display text-[clamp(32px,5vw,64px)] font-bold leading-tight text-ink">
            {personality.code}
            <span className="ml-3 font-display text-[clamp(18px,2.5vw,32px)] font-normal text-ash-700">
              {personality.name}
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ash-700">{personality.tagline}</p>
        </Container>
      </header>

      {/* Content */}
      <div className="border-b-2 border-ink bg-white py-12">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 space-y-10">
              {/* Description */}
              <section>
                <p className="text-base leading-relaxed text-ink">{personality.description}</p>
              </section>

              {/* Core traits */}
              <section>
                <h2 className="font-display text-xl font-bold text-ink">
                  Ciri-Ciri Utama {personality.code}
                </h2>
                <ul className="mt-4 space-y-3">
                  {personality.coreTraits.map((trait) => (
                    <li key={trait} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 inline-block h-2 w-2 shrink-0 bg-blue-500"
                        aria-hidden="true"
                      />
                      <span className="text-ink">{trait}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Strengths */}
              <section>
                <h2 className="font-display text-xl font-bold text-ink">Kekuatan</h2>
                <ul className="mt-4 space-y-2">
                  {personality.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 inline-block h-2 w-2 shrink-0 bg-peach-300"
                        aria-hidden="true"
                      />
                      <span className="text-ink">{s}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Challenges */}
              <section>
                <h2 className="font-display text-xl font-bold text-ink">
                  Tantangan yang Perlu Diperhatikan
                </h2>
                <ul className="mt-4 space-y-2">
                  {personality.challenges.map((c) => (
                    <li key={c} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 inline-block h-2 w-2 shrink-0 border-2 border-ink"
                        aria-hidden="true"
                      />
                      <span className="text-ink">{c}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Disclaimer */}
              <aside className="border-2 border-ink bg-ash-300/20 p-5">
                <p className="font-mono text-[11px] text-ash-700">
                  <strong>Catatan penting:</strong> Informasi di halaman ini bersifat deskriptif dan
                  edukatif — bukan diagnosis klinis. Hasil tes kepribadian bukan pengganti konsultasi
                  profesional. Hasil ini bersifat indikatif dan bergantung pada respons yang diberikan.
                </p>
              </aside>

              {/* Karier */}
              <RelatedCareers slugs={personality.commonCareers} />

              {/* Jurusan */}
              <RelatedMajors slugs={personality.commonMajors} />
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="border-2 border-ink bg-paper p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
                  Ukur Tipe Kepribadian Anda
                </p>
                <p className="mt-2 text-sm text-ink">
                  Ingin tahu tipe kepribadian Anda secara akurat? Gunakan instrumen asesmen yang
                  divalidasi akademik oleh Tim Psikologi UNJANI.
                </p>
                <Link
                  href="/produk/psyai"
                  className="mt-4 block border-2 border-ink bg-blue-500 px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-blue-600"
                >
                  Mulai Tes PsyAI →
                </Link>
                <Link
                  href="/produk/career-interest"
                  className="mt-2 block border-2 border-ink px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  Career Interest Test →
                </Link>
              </div>

              <div className="border-2 border-ink p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
                  Tipe Kepribadian Lain
                </p>
                <div className="mt-3 space-y-1.5">
                  {personality.relatedProducts.map((p) => (
                    <Link
                      key={p}
                      href={`/produk/${p}`}
                      className="block text-sm text-ash-700 hover:text-blue-500"
                    >
                      {p} →
                    </Link>
                  ))}
                </div>
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
              Temukan tipe kepribadian Anda yang sebenarnya
            </h2>
            <p className="mt-3 text-base text-ink/80">
              Asesmen psikologi terstandar dengan validasi akademik Fakultas Psikologi UNJANI.
              Hasilnya jauh lebih akurat dari kuis internet.
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

export default function PersonalityTypePage({ params }: Props) {
  const personality = getPersonalityBySlug(params.type);
  if (!personality) notFound();

  const mdxResult = getProgrammaticContent('kepribadian', params.type);

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: personality.type === 'holland' ? 'Holland Code' : 'MBTI', url: '/kepribadian' },
    { name: `${personality.code} — ${personality.name}`, url: `/kepribadian/${params.type}` },
  ]);

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/kepribadian/${params.type}`,
    headline: personality.seoTitle,
    description: personality.seoDescription,
    url: `${SITE_URL}/kepribadian/${params.type}`,
    keywords: personality.primaryKeyword,
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
    },
  };

  if (mdxResult) {
    const { meta, content } = mdxResult;
    return (
      <>
        <JsonLd data={breadcrumb} />
        <JsonLd data={webPageSchema} />
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
                      {personality.code}
                    </span>
                  </li>
                </ol>
              </nav>
            </Container>
          </div>

          <div className="border-b-2 border-ink bg-white py-12">
            <Container>
              <article className="prose-none mx-auto max-w-3xl">
                <MDXRemote source={content} components={mdxComponents} />
              </article>
              {meta.reviewedBy && (
                <p className="mx-auto mt-8 max-w-3xl font-mono text-[11px] text-ash-700">
                  Direview oleh: {meta.reviewedBy}
                </p>
              )}
            </Container>
          </div>

          <div className="border-b-2 border-ink bg-paper py-12">
            <Container>
              <div className="mx-auto max-w-3xl space-y-10">
                <RelatedCareers slugs={personality.commonCareers} />
                <RelatedMajors slugs={personality.commonMajors} />
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
      <JsonLd data={webPageSchema} />
      <PersonalityDataTemplate personality={personality} />
    </>
  );
}
