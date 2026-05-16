import { SITE_URL, SITE_NAME } from './site-schema';

const PUBLISHED_DATE = '2026-05-16';
const AUTHOR_NAME = 'Dr. [Placeholder UNJANI Lecturer Name], M.Psi., Psikolog';

export function getMethodologyArticleSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/metodologi#article`,
    headline: 'Metodologi Sekil.id: Holland Code, MBTI, dan Papi Kostick',
    description:
      'Sekil.id dibangun di atas 3 instrumen psikologi tervalidasi: Holland Code, MBTI, Papi Kostick. Divalidasi akademik oleh Fakultas Psikologi UNJANI.',
    url: `${SITE_URL}/metodologi`,
    datePublished: PUBLISHED_DATE,
    dateModified: PUBLISHED_DATE,
    inLanguage: 'id-ID',
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      jobTitle: 'Dosen Psikologi',
      affiliation: {
        '@type': 'Organization',
        name: 'Universitas Jenderal Achmad Yani',
        sameAs: 'https://www.unjani.ac.id',
      },
    },
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
      { '@type': 'Thing', name: 'Holland Code RIASEC' },
      { '@type': 'Thing', name: 'Myers-Briggs Type Indicator' },
      { '@type': 'Thing', name: 'Papi Kostick' },
      { '@type': 'Thing', name: 'Asesmen Psikologi' },
      { '@type': 'Thing', name: 'Pemetaan Karier Indonesia' },
    ],
    citation: [
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
    ],
  };
}
