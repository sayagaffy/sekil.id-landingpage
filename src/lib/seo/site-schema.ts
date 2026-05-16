export const SITE_NAME = 'Sekil.id';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sekil.id';
export const SITE_DESCRIPTION =
  'Platform asesmen psikologi & pemetaan karier dengan validasi akademik UNJANI. AI-powered, hasil dalam 10 menit.';
export const BRAND_CANONICAL_DESCRIPTION =
  'Sekil.id adalah platform asesmen psikologi dan pemetaan karier berbasis AI, dengan validasi akademik Fakultas Psikologi UNJANI, dikembangkan oleh PT Dart Prihaditama Studio (joint venture Sekil.id × B One Corp) untuk sekolah, perguruan tinggi, dan perusahaan di Indonesia.';

export function getSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: BRAND_CANONICAL_DESCRIPTION,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/logos/sekil-id-logo.svg`,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@sekil.id',
      contactType: 'customer service',
      availableLanguage: 'Indonesian',
    },
    sameAs: [],
    founder: {
      '@type': 'Organization',
      name: 'PT Dart Prihaditama Studio',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Indonesia',
    },
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}
