import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { JsonLd } from '@/components/seo/JsonLd'
import { Button } from '@/components/ui/button'
import { PricingTable } from '@/components/pricing/PricingTable'
import { VolumeCalculator } from '@/components/pricing/VolumeCalculator'
import { BundleCard } from '@/components/pricing/BundleCard'
import { ATCDashboardCard } from '@/components/pricing/ATCDashboardCard'
import { PricingFAQ } from '@/components/pricing/PricingFAQ'
import { BUNDLES } from '@/data/solutions'
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema'
import { getPricingPageSchema } from '@/lib/seo/pricing-schema'
import { sanityFetch } from '@/lib/sanity/live'
import type { PricingPageData } from '@/lib/sanity/types'
import { PRICING_PAGE_QUERY } from '@/lib/sanity/queries'

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
}

// ── Fallback defaults (shown when Sanity doc is unpublished / empty) ──────────

const DEFAULT_HERO = {
  eyebrow: 'HARGA TRANSPARAN · DISKON VOLUME',
  heading: 'Harga yang sesuai dengan skala Anda',
  subheading:
    'Mulai dari Rp 150.000 per peserta untuk individu. Dapatkan diskon hingga 50% untuk pembelian institusional. Tidak ada biaya setup, tidak ada biaya tersembunyi.',
  pillars: [
    { label: 'Harga mulai dari', value: 'Rp 150.000', sub: 'per peserta' },
    { label: 'Diskon volume', value: 'Hingga 50%', sub: 'untuk 50.000+ seat' },
    { label: 'Bundle hemat', value: '–7% hingga –17%', sub: 'paket multi-produk' },
  ],
}

const DEFAULT_FAQ = [
  {
    q: 'Bagaimana sistem pembayaran untuk institusi?',
    a: 'Institusi dapat melakukan pembelian seat secara bulk via transfer bank (BCA, Mandiri, BNI) atau kartu kredit. Setelah pembayaran dikonfirmasi, seat akan aktif dan link tes dapat didistribusikan ke peserta. Untuk pembelian 500+ seat, tersedia opsi invoice dan pembayaran Net-30.',
  },
  {
    q: 'Apakah seat yang dibeli ada masa berlakunya?',
    a: 'Ya. Seat berlaku selama 12 bulan sejak tanggal pembelian. Seat yang belum digunakan tidak dapat di-refund setelah masa berlaku berakhir. Kami merekomendasikan membeli sesuai kebutuhan aktual dan melakukan top-up jika diperlukan.',
  },
  {
    q: 'Apakah diskon volume berlaku per produk atau per total peserta?',
    a: 'Diskon berlaku per-asesmen per-seat. Jika Anda membeli 1.000 seat untuk Career Interest dan 500 seat untuk PsyAI, masing-masing mendapatkan diskon berdasarkan jumlah seat produk tersebut.',
  },
  {
    q: 'Apakah ada uji coba gratis untuk institusi?',
    a: 'Kami menyediakan demo produk dan penjelasan metodologi untuk pengambil keputusan institusi — bukan akses tes gratis untuk peserta. Untuk pilot program dengan 50 seat atau lebih, hubungi tim kami untuk mendiskusikan kemungkinan harga pilot.',
  },
  {
    q: 'Bagaimana jika saya ingin produk yang berbeda untuk kelompok peserta yang berbeda?',
    a: 'Tidak ada masalah. Anda bisa membeli seat untuk beberapa produk secara bersamaan atau terpisah. Setiap pembelian produk dihitung diskon volumenya secara independen.',
  },
]

const DEFAULT_ATC = {
  price: 'Rp 30 juta',
  priceUnit: '/tahun',
  features: [
    'Pantau status asesmen seluruh karyawan dalam satu dashboard',
    'Analisis distribusi profil kepribadian dan EQ per departemen',
    'Ekspor data ke HRIS (CSV, JSON, Webhook)',
    'Laporan agregat untuk kebutuhan audit dan talent review',
    'Dedicated account manager dan SLA 99.5% uptime',
    'Integrasi SSO dan LDAP/Active Directory',
  ],
}

export default async function HargaPage() {
  const pricingResult = await sanityFetch({ query: PRICING_PAGE_QUERY })
  const sanityData = pricingResult.data as PricingPageData | null

  // Merge Sanity data with hardcoded defaults
  const hero = {
    eyebrow: sanityData?.heroEyebrow ?? DEFAULT_HERO.eyebrow,
    heading: sanityData?.heroHeading ?? DEFAULT_HERO.heading,
    subheading: sanityData?.heroSubheading ?? DEFAULT_HERO.subheading,
    pillars:
      sanityData?.heroPillars && sanityData.heroPillars.length > 0
        ? sanityData.heroPillars.map((p) => ({
            label: p.label ?? '',
            value: p.value ?? '',
            sub: p.sub ?? '',
          }))
        : DEFAULT_HERO.pillars,
  }

  const faq =
    sanityData?.faq && sanityData.faq.length > 0
      ? sanityData.faq.map((item) => ({ q: item.q ?? '', a: item.a ?? '' }))
      : DEFAULT_FAQ

  const atcDashboard = sanityData?.atcDashboard
    ? {
        price: sanityData.atcDashboard.price ?? DEFAULT_ATC.price,
        priceUnit: sanityData.atcDashboard.priceUnit ?? DEFAULT_ATC.priceUnit,
        features: sanityData.atcDashboard.features ?? DEFAULT_ATC.features,
      }
    : DEFAULT_ATC

  const ctaHeading =
    sanityData?.ctaHeading ?? 'Butuh penawaran khusus untuk institusi Anda?'
  const ctaSubheading =
    sanityData?.ctaSubheading ??
    'Tim sales Sekil.id siap membantu menyusun proposal yang sesuai dengan anggaran dan kebutuhan program Anda. Respons dalam 1 hari kerja.'

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Harga', url: '/harga' },
  ])

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
            <p className="eyebrow mb-4">{hero.eyebrow}</p>
            <h1 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.05] tracking-tight text-ink">
              {hero.heading}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ash-700">
              {hero.subheading}
            </p>

            {/* Key pillars */}
            {hero.pillars.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-0 border-2 border-ink sm:grid-cols-3">
                {hero.pillars.map((item, i) => (
                  <div
                    key={i}
                    className={[
                      'p-6',
                      i < hero.pillars.length - 1
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
        <section
          className="border-b-2 border-ink bg-paper py-16"
          aria-labelledby="bundles-heading"
        >
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
        <section
          className="border-b-2 border-ink bg-white py-16"
          aria-labelledby="atc-heading"
        >
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
              <ATCDashboardCard data={atcDashboard} />
            </div>
          </Container>
        </section>

        {/* 5. Pricing FAQ */}
        <PricingFAQ items={faq} />

        {/* 6. Final CTA */}
        <section className="bg-navy-900 py-14">
          <Container>
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <h2 className="font-display text-2xl font-bold text-paper">{ctaHeading}</h2>
                <p className="mt-2 max-w-lg leading-relaxed text-sky-200">{ctaSubheading}</p>
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
  )
}
