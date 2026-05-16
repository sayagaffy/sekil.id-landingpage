import { SITE_URL } from './site-schema';
import type { SolutionSegment } from '@/data/solutions';

export function getSolutionFAQSchema(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function getSolutionWebPageSchema(segment: SolutionSegment) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}/solusi/${segment.slug}`,
    name: segment.seoTitle,
    description: segment.seoDescription,
    url: `${SITE_URL}/solusi/${segment.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Solusi', item: `${SITE_URL}/solusi` },
        {
          '@type': 'ListItem',
          position: 3,
          name: segment.name,
          item: `${SITE_URL}/solusi/${segment.slug}`,
        },
      ],
    },
  };
}
