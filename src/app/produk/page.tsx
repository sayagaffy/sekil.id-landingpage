import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { PRODUCTS, ACCENT_SEQUENCE } from '@/data/products';
import { getProductHubItemListSchema } from '@/lib/seo/product-schema';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
import { sanityFetch } from '@/lib/sanity/live';
import type { SanityProduct } from '@/lib/sanity/types';
import { ALL_PRODUCTS_QUERY } from '@/lib/sanity/queries';

function sanityToProduct(p: SanityProduct): (typeof PRODUCTS)[number] {
  return {
    slug: p.slug,
    name: p.name,
    nameDisplay: p.nameDisplay ?? p.name,
    tagline: p.tagline,
    description: p.description,
    longDescription: p.longDescription ?? '',
    duration: p.duration,
    price: p.price,
    priceDisplay: `Rp ${p.price.toLocaleString('id-ID')}`,
    targetPersonas: (p.targetPersonas ?? []) as (typeof PRODUCTS)[number]['targetPersonas'],
    instruments: (p.instruments ?? []) as (typeof PRODUCTS)[number]['instruments'],
    outputs: p.outputs ?? [],
    sampleReportTeaser: p.sampleReportTeaser ?? '',
    bundleSuggestions: p.bundleSuggestions ?? [],
    faq: p.faq ?? [],
    seoTitle: p.seoTitle ?? `${p.name} | Sekil.id`,
    seoDescription: p.seoDescription ?? p.description,
    primaryKeyword: p.primaryKeyword ?? '',
  };
}

export const metadata: Metadata = {
  title: 'Asesmen & Tes Kepribadian',
  description:
    'Katalog 5 asesmen psikologi & karier Sekil.id: Career Interest, PsyAI, Path Finder AI, Leadership Styles, EQ Test. Validasi akademik UNJANI.',
  alternates: { canonical: 'https://sekil.id/produk' },
  openGraph: {
    title: 'Asesmen & Tes Kepribadian',
    description:
      'Katalog 5 asesmen psikologi & karier Sekil.id: Career Interest, PsyAI, Path Finder AI, Leadership Styles, EQ Test. Validasi akademik UNJANI.',
    url: 'https://sekil.id/produk',
    type: 'website',
  },
};

const FILTER_PILLS = [
  'Semua',
  'Untuk Siswa SMA',
  'Untuk Mahasiswa',
  'Untuk Karyawan',
  'Untuk Manager',
];

export default async function ProdukPage() {
  const result = await sanityFetch({ query: ALL_PRODUCTS_QUERY })
  const rawProducts = result.data as SanityProduct[] | null
  const products =
    rawProducts && rawProducts.length > 0
      ? rawProducts.map(sanityToProduct)
      : PRODUCTS

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Produk', url: '/produk' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={getProductHubItemListSchema(products)} />

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
                    Produk
                  </span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* Hero */}
        <section className="border-b-2 border-ink bg-paper py-14">
          <Container>
            <p className="eyebrow mb-4">KATALOG ASESMEN · 5 PRODUK</p>
            <h1 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.05] tracking-tight text-ink">
              Asesmen Sekil.id
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ash-700">
              5 instrumen tervalidasi untuk memetakan kepribadian, minat, dan karier. Mulai dari{' '}
              <strong className="text-ink">Rp 150.000</strong> per peserta. Semua divalidasi
              akademik oleh Fakultas Psikologi UNJANI.
            </p>

            {/* Filter pills — V1 visual only, no interactivity */}
            <div
              className="mt-8 flex flex-wrap gap-2"
              aria-label="Filter produk"
              role="group"
            >
              {FILTER_PILLS.map((label, i) => (
                <span
                  key={label}
                  className={[
                    'border-2 border-ink px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em]',
                    i === 0 ? 'bg-ink text-paper' : 'bg-paper text-ink cursor-default select-none opacity-60',
                  ].join(' ')}
                  aria-label={i === 0 ? `${label} (aktif)` : label}
                >
                  {label}
                </span>
              ))}
            </div>
          </Container>
        </section>

        {/* Product grid */}
        <section className="border-b-2 border-ink bg-white py-16">
          <Container>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, i) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  accentVariant={ACCENT_SEQUENCE[i]}
                />
              ))}
            </div>
          </Container>
        </section>

        {/* "Tidak yakin?" CTA */}
        <section className="bg-navy-900 py-14">
          <Container>
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <h2 className="font-display text-2xl font-bold text-paper">
                  Tidak yakin mana yang cocok?
                </h2>
                <p className="mt-2 max-w-lg leading-relaxed text-sky-200">
                  Tim Sekil.id siap membantu menentukan asesmen yang paling sesuai dengan kebutuhan
                  institusi atau individu Anda — tanpa komitmen.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Button variant="peach" size="lg" asChild>
                  <Link href="/demo">Diskusi dengan Tim →</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-paper text-paper hover:bg-paper hover:text-ink" asChild>
                  <Link href="/metodologi">Baca Metodologi</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
