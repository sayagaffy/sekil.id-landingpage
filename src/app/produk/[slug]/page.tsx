import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/button';
import { ProductHero } from '@/components/product/ProductHero';
import { PersonaMatch } from '@/components/product/PersonaMatch';
import { OutputList } from '@/components/product/OutputList';
import { MethodologySnippet } from '@/components/product/MethodologySnippet';
import { SampleReportTeaser } from '@/components/product/SampleReportTeaser';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { ProductFAQ } from '@/components/product/ProductFAQ';
import { PRODUCTS, getProductBySlug } from '@/data/products';
import { getProductSchema } from '@/lib/seo/product-schema';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
import { sanityFetch } from '@/lib/sanity/live';
import type { SanityProduct } from '@/lib/sanity/types';
import { PRODUCT_BY_SLUG_QUERY, ALL_PRODUCT_SLUGS_QUERY } from '@/lib/sanity/queries';

interface Props {
  params: { slug: string };
}

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

export async function generateStaticParams() {
  try {
    const { data } = await sanityFetch({ query: ALL_PRODUCT_SLUGS_QUERY })
    const sanitySlug = data as { slug: string }[] | null
    if (sanitySlug && sanitySlug.length > 0) return sanitySlug
  } catch {}
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await sanityFetch({ query: PRODUCT_BY_SLUG_QUERY, params: { slug: params.slug } })
  const sanityProduct = data as SanityProduct | null
  const product = sanityProduct ? sanityToProduct(sanityProduct) : getProductBySlug(params.slug)
  if (!product) return {};
  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: { canonical: `https://sekil.id/produk/${product.slug}` },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      url: `https://sekil.id/produk/${product.slug}`,
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { data } = await sanityFetch({ query: PRODUCT_BY_SLUG_QUERY, params: { slug: params.slug } })
  const sanityProduct = data as SanityProduct | null
  const product = sanityProduct ? sanityToProduct(sanityProduct) : getProductBySlug(params.slug)
  if (!product) notFound();

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Produk', url: '/produk' },
    { name: product.name, url: `/produk/${product.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={getProductSchema(product)} />

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
                  <Link href="/produk" className="transition-colors hover:text-blue-500">
                    Produk
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li>
                  <span className="text-ink" aria-current="page">
                    {product.name}
                  </span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* 2. Hero */}
        <ProductHero product={product} />

        {/* 3. Untuk Siapa */}
        <PersonaMatch personas={product.targetPersonas} />

        {/* 4. Apa yang Anda Dapat */}
        <OutputList outputs={product.outputs} />

        {/* 5. Metodologi */}
        <MethodologySnippet instruments={product.instruments} />

        {/* 6. Sample Report */}
        <SampleReportTeaser teaser={product.sampleReportTeaser} productName={product.name} />

        {/* 7. Related Products */}
        <RelatedProducts slugs={product.bundleSuggestions} currentSlug={product.slug} />

        {/* 8. FAQ */}
        <ProductFAQ faq={product.faq} productName={product.name} />

        {/* 9. Final CTA strip */}
        <section className="bg-navy-900 py-14">
          <Container>
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <h2 className="font-display text-2xl font-bold text-paper">
                  Siap mulai dengan {product.name}?
                </h2>
                <p className="mt-2 max-w-lg leading-relaxed text-sky-200">
                  Hubungi tim Sekil.id untuk penawaran institusional atau diskusi kebutuhan Anda.
                  Belum yakin?{' '}
                  <Link href="/demo" className="font-medium text-peach-300 hover:underline">
                    Diskusi dengan tim kami →
                  </Link>
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Button variant="peach" size="lg" asChild>
                  <Link href={`/demo?product=${product.slug}`}>
                    Hubungi Sales →
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-paper text-paper hover:bg-paper hover:text-ink"
                  asChild
                >
                  <Link href="/produk">Lihat Produk Lain</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
