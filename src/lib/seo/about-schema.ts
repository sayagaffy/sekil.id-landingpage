import { SITE_URL, SITE_NAME, BRAND_CANONICAL_DESCRIPTION } from './site-schema';

export function getAboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE_URL}/tentang`,
    name: `Tentang ${SITE_NAME}`,
    description: BRAND_CANONICAL_DESCRIPTION,
    url: `${SITE_URL}/tentang`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Tentang', item: `${SITE_URL}/tentang` },
      ],
    },
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: BRAND_CANONICAL_DESCRIPTION,
      foundingDate: '2024',
      areaServed: { '@type': 'Country', name: 'Indonesia' },
      knowsAbout: [
        'Asesmen Psikologi',
        'Pemetaan Minat Vokasional',
        'Preferensi Kepribadian',
        'Inventori Kebutuhan dan Peran Kerja',
        'Career Mapping',
        'Emotional Intelligence',
      ],
      memberOf: [
        {
          '@type': 'Organization',
          name: 'B One Corp',
          description: 'Partner distribusi sertifikasi profesional',
        },
        {
          '@type': 'EducationalOrganization',
          name: 'Universitas Jenderal Achmad Yani (UNJANI)',
          description: 'Mitra validasi akademik Fakultas Psikologi',
          url: 'https://unjani.ac.id',
        },
      ],
    },
  };
}
