import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
import { SOLUTION_SEGMENTS } from '@/data/solutions';

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

const ACCENT_BG: Record<string, string> = {
  'untuk-sekolah': 'bg-peach-300',
  'untuk-perguruan-tinggi': 'bg-blue-500',
  'untuk-perusahaan': 'bg-navy-900',
  'untuk-yayasan': 'bg-ink',
};

const ACCENT_TEXT: Record<string, string> = {
  'untuk-sekolah': 'text-ink',
  'untuk-perguruan-tinggi': 'text-white',
  'untuk-perusahaan': 'text-white',
  'untuk-yayasan': 'text-white',
};

export default function SolusiPage() {
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
            <p className="eyebrow mb-4">SOLUSI INSTITUSIONAL · 4 SEGMEN</p>
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
              {SOLUTION_SEGMENTS.map((segment) => (
                <Link
                  key={segment.slug}
                  href={`/solusi/${segment.slug}`}
                  className="group flex flex-col border-2 border-ink transition-shadow hover:shadow-[4px_4px_0_0_#0a1230]"
                >
                  <div
                    className={[
                      'border-b-2 border-ink p-6',
                      ACCENT_BG[segment.slug] ?? 'bg-paper',
                    ].join(' ')}
                  >
                    <p
                      className={[
                        'font-mono text-[10px] uppercase tracking-[0.16em] opacity-70',
                        ACCENT_TEXT[segment.slug] ?? 'text-ink',
                      ].join(' ')}
                    >
                      {segment.eyebrow}
                    </p>
                    <h2
                      className={[
                        'mt-2 font-display text-xl font-bold',
                        ACCENT_TEXT[segment.slug] ?? 'text-ink',
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
              ))}
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
