import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { PendingReviewBanner } from '@/components/programmatic/PendingReviewBanner';
import { RelatedPersonalities } from '@/components/programmatic/RelatedPersonalities';
import { RelatedMajors } from '@/components/programmatic/RelatedMajors';
import { SalaryChart } from '@/components/programmatic/SalaryChart';
import { mdxComponents } from '@/components/mdx/components';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
import { SITE_URL } from '@/lib/seo/site-schema';
import { getProgrammaticContent } from '@/lib/mdx/programmatic';
import { getCareerBySlug, getAllCareerSlugs, type Career } from '@/data/careers';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllCareerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const career = getCareerBySlug(params.slug);
  if (!career) return {};

  const hasMdx = !!getProgrammaticContent('karier', params.slug);

  return {
    title: career.seoTitle,
    description: career.seoDescription,
    alternates: { canonical: `${SITE_URL}/karier/${params.slug}` },
    robots: hasMdx ? 'index,follow' : 'noindex,nofollow',
    openGraph: {
      title: career.seoTitle,
      description: career.seoDescription,
      url: `${SITE_URL}/karier/${params.slug}`,
      type: 'article',
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  teknologi: 'Teknologi',
  bisnis: 'Bisnis',
  kesehatan: 'Kesehatan',
  pendidikan: 'Pendidikan',
  kreatif: 'Kreatif',
  sosial: 'Sosial',
  hukum: 'Hukum',
  teknik: 'Teknik',
  keuangan: 'Keuangan',
};

const GROWTH_COLORS: Record<string, string> = {
  'Sangat Tinggi': 'bg-blue-500 text-white',
  Tinggi: 'bg-peach-300 text-ink',
  Sedang: 'bg-ash-300/50 text-ink',
  Rendah: 'bg-paper text-ash-700',
};

function formatRupiah(amount: number): string {
  if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(0)} jt`;
  return `Rp ${(amount / 1000).toFixed(0)} rb`;
}

function CareerDataTemplate({ career }: { career: Career }) {
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
                <span className="text-ink">Panduan Karier</span>
              </li>
              <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
              <li>
                <span className="text-ink" aria-current="page">
                  {career.name}
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
              {CATEGORY_LABELS[career.category] ?? career.category}
            </span>
            <span
              className={`border-2 border-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${GROWTH_COLORS[career.growthOutlook] ?? 'bg-paper text-ink'}`}
            >
              Prospek: {career.growthOutlook}
            </span>
          </div>
          <h1 className="mt-3 font-display text-[clamp(28px,4.5vw,56px)] font-bold leading-tight text-ink">
            {career.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
            <span>Pendidikan minimum: {career.educationLevel}</span>
            <span aria-hidden="true">·</span>
            <span>
              Gaji: {formatRupiah(career.salaryRange.min)} –{' '}
              {formatRupiah(career.salaryRange.max)} / bulan
            </span>
          </div>
        </Container>
      </header>

      {/* Content */}
      <div className="border-b-2 border-ink bg-white py-12">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 space-y-10">
              {/* Description */}
              <section>
                <p className="text-base leading-relaxed text-ink">{career.description}</p>
              </section>

              {/* Skills */}
              <section>
                <h2 className="font-display text-xl font-bold text-ink">
                  Skill yang Dibutuhkan
                </h2>
                <ul className="mt-4 space-y-2">
                  {career.requiredSkills.map((skill) => (
                    <li key={skill} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 inline-block h-2 w-2 shrink-0 bg-blue-500"
                        aria-hidden="true"
                      />
                      <span className="text-ink">{skill}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Holland */}
              <section>
                <h2 className="font-display text-xl font-bold text-ink">Profil Holland Code</h2>
                <p className="mt-2 text-sm text-ash-700">
                  Karier ini cocok untuk profil minat Holland Code:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {career.hollandCodes.map((code) => (
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
                  <strong>Catatan:</strong> Data gaji bersifat estimasi berdasarkan survey LinkedIn
                  Indonesia 2025. Angka aktual bervariasi tergantung perusahaan, lokasi, pengalaman,
                  dan negosiasi. Informasi ini bukan pengganti konsultasi karier profesional.
                </p>
              </aside>

              {/* Related */}
              <RelatedPersonalities slugs={career.commonPersonalities} />
              <RelatedMajors slugs={career.relatedMajors} />
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <SalaryChart
                min={career.salaryRange.min}
                max={career.salaryRange.max}
                currency={career.salaryRange.currency}
              />

              <div className="border-2 border-ink bg-paper p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
                  Cek apakah karier ini cocok untuk Anda
                </p>
                <p className="mt-2 text-sm text-ink">
                  Gunakan asesmen minat karier untuk memvalidasi kesesuaian profil Anda dengan
                  jalur karier ini.
                </p>
                <Link
                  href="/produk/career-interest"
                  className="mt-4 block border-2 border-ink bg-blue-500 px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-blue-600"
                >
                  Career Interest Test →
                </Link>
                <Link
                  href="/produk/psyai"
                  className="mt-2 block border-2 border-ink px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  PsyAI — Profil Lengkap →
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
              Apakah {career.name} cocok untuk profil Anda?
            </h2>
            <p className="mt-3 text-base text-ink/80">
              Gunakan asesmen psikologi tervalidasi UNJANI untuk mendapat jawaban yang akurat — bukan
              sekadar dugaan.
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

export default function CareerPage({ params }: Props) {
  const career = getCareerBySlug(params.slug);
  if (!career) notFound();

  const mdxResult = getProgrammaticContent('karier', params.slug);

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Panduan Karier', url: '/karier' },
    { name: career.name, url: `/karier/${params.slug}` },
  ]);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/karier/${params.slug}`,
    headline: career.seoTitle,
    description: career.seoDescription,
    url: `${SITE_URL}/karier/${params.slug}`,
    keywords: career.primaryKeyword,
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
                      {career.name}
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
                <SalaryChart
                  min={career.salaryRange.min}
                  max={career.salaryRange.max}
                  currency={career.salaryRange.currency}
                />
                <RelatedPersonalities slugs={career.commonPersonalities} />
                <RelatedMajors slugs={career.relatedMajors} />
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
      <CareerDataTemplate career={career} />
    </>
  );
}
