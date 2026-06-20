import { SITE_URL, SITE_NAME } from './site-schema';

const PUBLISHED_DATE = '2026-05-16';
const MODIFIED_DATE = '2026-05-20';
// __NEEDS_REAL_VALUE__: ganti ke Person dengan nama dosen asli setelah MoU UNJANI ditandatangani
const AUTHOR_ORG = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Tim Akademik Sekil.id',
} as const;

const FULL_CITATIONS = [
  {
    '@type': 'ScholarlyArticle',
    name: 'Making Vocational Choices: A Theory of Vocational Personalities and Work Environments',
    author: { '@type': 'Person', name: 'Holland, J. L.' },
    datePublished: '1997',
    publisher: { '@type': 'Organization', name: 'Psychological Assessment Resources' },
  },
  {
    '@type': 'ScholarlyArticle',
    name: 'Gifts Differing: Understanding Personality Type',
    author: [
      { '@type': 'Person', name: 'Myers, I. B.' },
      { '@type': 'Person', name: 'Myers, P. B.' },
    ],
    datePublished: '1995',
    publisher: { '@type': 'Organization', name: 'Davies-Black Publishing' },
  },
  {
    '@type': 'ScholarlyArticle',
    name: 'PAPI Manual',
    author: { '@type': 'Person', name: 'Kostick, M. M.' },
    datePublished: '1976',
    publisher: { '@type': 'Organization', name: 'PA Consulting Group' },
  },
  {
    '@type': 'ScholarlyArticle',
    name: "The development, evolution, and status of Holland's theory of vocational personalities",
    author: { '@type': 'Person', name: 'Nauta, M. M.' },
    datePublished: '2010',
    isPartOf: {
      '@type': 'Periodical',
      name: 'Journal of Counseling Psychology',
      volumeNumber: '57',
      issueNumber: '1',
    },
    pageStart: '11',
    pageEnd: '22',
  },
  {
    '@type': 'ScholarlyArticle',
    name: 'The utility of the Myers-Briggs Type Indicator',
    author: { '@type': 'Person', name: 'Pittenger, D. J.' },
    datePublished: '1993',
    isPartOf: {
      '@type': 'Periodical',
      name: 'Review of Educational Research',
      volumeNumber: '63',
      issueNumber: '4',
    },
    pageStart: '467',
    pageEnd: '488',
  },
];

/**
 * Public /metodologi JSON-LD — de-branded: no instrument names in `about`,
 * no citations (those are on the buyer page). Updated dateModified on de-brand.
 */
export function getMethodologyArticleSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/metodologi#article`,
    headline: 'Metodologi Asesmen Psikologi Sekil.id: Instrumen Tervalidasi untuk Konteks Indonesia',
    description:
      'Sekil.id dibangun di atas 3 instrumen psikologi akademik yang telah diuji selama puluhan tahun, divalidasi ulang untuk konteks Indonesia oleh Fakultas Psikologi UNJANI.',
    url: `${SITE_URL}/metodologi`,
    datePublished: PUBLISHED_DATE,
    dateModified: MODIFIED_DATE,
    inLanguage: 'id-ID',
    author: AUTHOR_ORG,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      '@id': `${SITE_URL}/#organization`,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-color.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/metodologi`,
    },
    about: [
      { '@type': 'Thing', name: 'Asesmen Psikologi' },
      { '@type': 'Thing', name: 'Pemetaan Karier Indonesia' },
      { '@type': 'Thing', name: 'Instrumen Psikometri Tervalidasi' },
    ],
  };
}

/**
 * Buyer /institusi/metodologi JSON-LD — full technical details + citations.
 * Page is noindex so this only helps if the page is somehow linked.
 */
export function getBuyerMethodologySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/institusi/metodologi#article`,
    headline: 'Spesifikasi Teknis Instrumen Asesmen Sekil.id: Kerangka Minat Vokasional, Preferensi Kepribadian, dan Inventori Peran Kerja',
    description:
      'Dokumentasi teknis lengkap instrumen psikologi Sekil.id — untuk mitra institusi (sekolah, kampus, perusahaan). Mencakup sitasi akademik, dimensi, dan adaptasi Indonesia.',
    url: `${SITE_URL}/institusi/metodologi`,
    datePublished: PUBLISHED_DATE,
    dateModified: MODIFIED_DATE,
    inLanguage: 'id-ID',
    author: AUTHOR_ORG,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      '@id': `${SITE_URL}/#organization`,
    },
    about: [
      { '@type': 'Thing', name: 'Kerangka Minat Vokasional' },
      { '@type': 'Thing', name: 'Kerangka Preferensi Kepribadian' },
      { '@type': 'Thing', name: 'Inventori Kebutuhan & Peran Kerja' },
      { '@type': 'Thing', name: 'Asesmen Psikologi' },
      { '@type': 'Thing', name: 'Pemetaan Karier Indonesia' },
    ],
    citation: FULL_CITATIONS,
  };
}
