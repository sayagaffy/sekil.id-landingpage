import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
import { SOLUTION_SEGMENTS } from '@/data/solutions';
import { sanityFetch } from '@/lib/sanity/live';
import type { SanitySolutionSegment } from '@/lib/sanity/types';
import { ALL_SEGMENTS_QUERY } from '@/lib/sanity/queries';

export const metadata: Metadata = {
  title: 'Solusi Asesmen Institusional | Sekil.id',
  description:
    'Solusi asesmen psikologi dan karier Sekil.id untuk sekolah, perguruan tinggi, perusahaan, dan yayasan. Diskon volume dan dashboard institusional tersedia.',
  alternates: { canonical: 'https://sekil.id/solusi' },
  openGraph: {
    title: 'Solusi Asesmen Institusional | Sekil.id',
    description:
      'Solusi asesmen psikologi dan karier Sekil.id untuk sekolah, perguruan tinggi, perusahaan, dan yayasan.',
    url: 'https://sekil.id/solusi',
    type: 'website',
  },
};

// Maps heroAccent value → Tailwind background class for the card header
const ACCENT_BG: Record<string, string> = {
  peach: 'bg-peach-300',
  blue: 'bg-blue-500',
  navy: 'bg-navy-900',
  ink: 'bg-ink',
};

const ACCENT_TEXT: Record<string, string> = {
  peach: 'text-ink',
  blue: 'text-white',
  navy: 'text-white',
  ink: 'text-white',
};

// Fallback: map segment slug → heroAccent for hardcoded data
const SLUG_TO_ACCENT: Record<string, string> = {
  'untuk-sekolah': 'peach',
  'untuk-perguruan-tinggi': 'blue',
  'untuk-perusahaan': 'navy',
  'untuk-yayasan': 'ink',
};

interface SegmentCard {
  slug: string;
  name: string;
  eyebrow: string;
  subheadline: string;
  heroAccent: string;
  recommendedProducts: string[];
}

export default async function SolusiPage() {
  const result = await sanityFetch({ query: ALL_SEGMENTS_QUERY });
  const rawSegments = result.data as SanitySolutionSegment[] | null;

  const segments: SegmentCard[] =
    rawSegments && rawSegments.length > 0
      ? rawSegments.map((s) => ({
          slug: s.slug,
          name: s.name,
          eyebrow: s.eyebrow ?? '',
          subheadline: s.subheadline ?? '',
          heroAccent: s.heroAccent ?? SLUG_TO_ACCENT[s.slug] ?? 'peach',
          recommendedProducts: s.recommendedProducts ?? [],
        }))
      : SOLUTION_SEGMENTS.map((s) => ({
          slug: s.slug,
          name: s.name,
          eyebrow: s.eyebrow,
          subheadline: s.subheadline,
          heroAccent: SLUG_TO_ACCENT[s.slug] ?? 'peach',
          recommendedProducts: s.recommendedProducts,
        }));

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Solusi', url: '/solusi' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />

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
                    Solusi
                  </span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* Hero */}
        <section className="border-b-2 border-ink bg-paper py-16">
          <Container>
            <p className="eyebrow mb-4">SOLUSI INSTITUSIONAL · {segments.length} SEGMEN</p>
            <h1 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.05] tracking-tight text-ink">
              Solusi untuk setiap institusi
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ash-700">
              Dari sekolah hingga perusahaan: platform asesmen psikologi dan karier yang diadaptasi
              untuk kebutuhan spesifik institusi Anda. Dengan diskon volume dan dashboard yang mudah
              dikelola.
            </p>
          </Container>
        </section>

        {/* Segment cards */}
        <section className="border-b-2 border-ink bg-white py-16">
          <Container>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {segments.map((segment) => {
                const accent = segment.heroAccent;
                return (
                  <Link
                    key={segment.slug}
                    href={`/solusi/${segment.slug}`}
                    className="group flex flex-col border-2 border-ink transition-shadow hover:shadow-[4px_4px_0_0_#0a1230]"
                  >
                    <div
                      className={[
                        'border-b-2 border-ink p-6',
                        ACCENT_BG[accent] ?? 'bg-paper',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          'font-mono text-[10px] uppercase tracking-[0.16em] opacity-70',
                          ACCENT_TEXT[accent] ?? 'text-ink',
                        ].join(' ')}
                      >
                        {segment.eyebrow}
                      </p>
                      <h2
                        className={[
                          'mt-2 font-display text-xl font-bold',
                          ACCENT_TEXT[accent] ?? 'text-ink',
                        ].join(' ')}
                      >
                        {segment.name}
                      </h2>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-sm leading-relaxed text-ash-700">{segment.subheadline}</p>
                      <div className="mt-4 flex flex-wrap gap-1">
                        {segment.recommendedProducts.slice(0, 3).map((slug) => (
                          <span
                            key={slug}
                            className="border border-ash-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ash-700"
                          >
                            {slug.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-blue-500 transition-colors group-hover:text-ink">
                        Lihat solusi →
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
