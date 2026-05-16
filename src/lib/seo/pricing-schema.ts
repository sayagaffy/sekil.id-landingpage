import { SITE_URL, SITE_NAME } from './site-schema';

export function getPricingFAQSchema(faq: { q: string; a: string }[]) {
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

export function getPricingPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}/harga`,
    name: `Harga Asesmen Psikologi | ${SITE_NAME}`,
    description:
      'Daftar harga asesmen psikologi dan karier Sekil.id. Diskon volume hingga 50% untuk institusi.',
    url: `${SITE_URL}/harga`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Harga', item: `${SITE_URL}/harga` },
      ],
    },
  };
}
