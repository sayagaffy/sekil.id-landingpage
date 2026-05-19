import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/button';
import { PricingTable } from '@/components/pricing/PricingTable';
import { VolumeCalculator } from '@/components/pricing/VolumeCalculator';
import { BundleCard } from '@/components/pricing/BundleCard';
import { ATCDashboardCard } from '@/components/pricing/ATCDashboardCard';
import { PricingFAQ } from '@/components/pricing/PricingFAQ';
import { BUNDLES } from '@/data/solutions';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
import { getPricingPageSchema } from '@/lib/seo/pricing-schema';
import { getPricingPageData } from '@/lib/cms/pricing-reader';

export const metadata: Metadata = {
  title: 'Harga Asesmen Psikologi & Karier | Sekil.id',
  description:
    'Harga transparan asesmen psikologi dan karier Sekil.id. Mulai Rp 150.000/peserta dengan diskon volume hingga 50% untuk institusi. Kalkulator harga interaktif tersedia.',
  alternates: { canonical: 'https://sekil.id/harga' },
  openGraph: {
    title: 'Harga Asesmen Psikologi & Karier | Sekil.id',
    description:
      'Harga transparan asesmen Sekil.id. Mulai Rp 150.000/peserta dengan diskon volume hingga 50% untuk institusi.',
    url: 'https://sekil.id/harga',
    type: 'website',
  },
};

export default async function HargaPage() {
  const cms = await getPricingPageData();
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Harga', url: '/harga' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={getPricingPageSchema()} />

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
                    Harga
                  </span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* Hero */}
        <section className="border-b-2 border-ink bg-paper py-16">
          <Container>
            <p className="eyebrow mb-4">{cms.hero.eyebrow}</p>
            <h1 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.05] tracking-tight text-ink">
              {cms.hero.heading}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ash-700">
              {cms.hero.subheading}
            </p>

            {/* Key pillars */}
            {cms.hero.pillars.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-0 border-2 border-ink sm:grid-cols-3">
                {cms.hero.pillars.map((item, i) => (
                  <div
                    key={i}
                    className={[
                      'p-6',
                      i < cms.hero.pillars.length - 1
                        ? 'border-b-2 border-ink sm:border-b-0 sm:border-r-2'
                        : '',
                    ].join(' ')}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
                      {item.label}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-ink">{item.value}</p>
                    <p className="font-mono text-[11px] text-ash-700">{item.sub}</p>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* 1. Pricing table */}
        <PricingTable />

        {/* 2. Volume calculator */}
        <VolumeCalculator />

        {/* 3. Bundle offers */}
        <section className="border-b-2 border-ink bg-paper py-16" aria-labelledby="bundles-heading">
          <Container>
            <p className="eyebrow mb-4">PAKET BUNDLE</p>
            <h2
              id="bundles-heading"
              className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
            >
              Hemat lebih dengan bundle produk
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ash-700">
              Kombinasikan beberapa asesmen dalam satu paket dan dapatkan harga yang lebih efisien.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {BUNDLES.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} />
              ))}
            </div>
          </Container>
        </section>

        {/* 4. ATC Dashboard add-on */}
        <section className="border-b-2 border-ink bg-white py-16" aria-labelledby="atc-heading">
          <Container>
            <p className="eyebrow mb-4">ADD-ON ENTERPRISE</p>
            <h2
              id="atc-heading"
              className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
            >
              ATC Dashboard untuk enterprise
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ash-700">
              Platform monitoring asesmen terpusat untuk perusahaan dan yayasan dengan 100+
              karyawan atau penerima manfaat.
            </p>

            <div className="mt-10 max-w-xl">
              <ATCDashboardCard data={cms.atcDashboard} />
            </div>
          </Container>
        </section>

        {/* 5. Pricing FAQ */}
        <PricingFAQ items={cms.faq} />

        {/* 6. Final CTA */}
        <section className="bg-navy-900 py-14">
          <Container>
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <h2 className="font-display text-2xl font-bold text-paper">
                  {cms.ctaHeading}
                </h2>
                <p className="mt-2 max-w-lg leading-relaxed text-sky-200">
                  {cms.ctaSubheading}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Button variant="peach" size="lg" asChild>
                  <Link href="/demo">Hubungi Sales →</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-paper text-paper hover:bg-paper hover:text-ink"
                  asChild
                >
                  <Link href="/produk">Lihat Produk</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
