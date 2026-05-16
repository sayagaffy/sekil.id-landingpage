import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { SolutionHero } from '@/components/solution/SolutionHero';
import { ProblemList } from '@/components/solution/ProblemList';
import { UseCaseGrid } from '@/components/solution/UseCaseGrid';
import { SolutionStats } from '@/components/solution/SolutionStats';
import { SolutionProducts } from '@/components/solution/SolutionProducts';
import { SolutionTestimonial } from '@/components/solution/SolutionTestimonial';
import { SolutionFAQ } from '@/components/solution/SolutionFAQ';
import { SolutionCTA } from '@/components/solution/SolutionCTA';
import { SOLUTION_SEGMENTS, getSegmentBySlug } from '@/data/solutions';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
import { getSolutionWebPageSchema } from '@/lib/seo/solution-schema';

interface Props {
  params: { segment: string };
}

export function generateStaticParams() {
  return SOLUTION_SEGMENTS.map((s) => ({ segment: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const segment = getSegmentBySlug(params.segment);
  if (!segment) return {};
  return {
    title: segment.seoTitle,
    description: segment.seoDescription,
    alternates: { canonical: `https://sekil.id/solusi/${segment.slug}` },
    openGraph: {
      title: segment.seoTitle,
      description: segment.seoDescription,
      url: `https://sekil.id/solusi/${segment.slug}`,
      type: 'website',
    },
  };
}

export default function SolutionSegmentPage({ params }: Props) {
  const segment = getSegmentBySlug(params.segment);
  if (!segment) notFound();

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Solusi', url: '/solusi' },
    { name: segment.name, url: `/solusi/${segment.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={getSolutionWebPageSchema(segment)} />

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
                  <Link href="/solusi" className="transition-colors hover:text-blue-500">
                    Solusi
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li>
                  <span className="text-ink" aria-current="page">
                    {segment.name}
                  </span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* 1. Hero */}
        <SolutionHero segment={segment} />

        {/* 2. Stats strip */}
        <SolutionStats stats={segment.stats} />

        {/* 3. Problem list */}
        <ProblemList problems={segment.problems} />

        {/* 4. Use case grid */}
        <UseCaseGrid useCases={segment.useCases} />

        {/* 5. Recommended products */}
        <SolutionProducts productSlugs={segment.recommendedProducts} />

        {/* 6. Testimonial */}
        {segment.testimonial && <SolutionTestimonial testimonial={segment.testimonial} />}

        {/* 7. FAQ */}
        <SolutionFAQ faq={segment.faq} />

        {/* 8. CTA */}
        <SolutionCTA segment={segment} />
      </main>
    </>
  );
}
