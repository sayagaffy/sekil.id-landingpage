import { SITE_URL, SITE_NAME } from './site-schema';

export function getContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/kontak`,
    name: `Kontak ${SITE_NAME}`,
    description: 'Hubungi Sekil.id untuk demo, partnership, akademik, atau pertanyaan data.',
    url: `${SITE_URL}/kontak`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Kontak', item: `${SITE_URL}/kontak` },
      ],
    },
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      email: 'hello@sekil.id',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Cukang Kawung No.11, Cigadung, Kec. Cibeunying Kaler',
        addressLocality: 'Kota Bandung',
        addressRegion: 'Jawa Barat',
        postalCode: '40125',
        addressCountry: 'ID',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: 'sales@sekil.id',
          availableLanguage: 'Indonesian',
        },
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'hello@sekil.id',
          availableLanguage: 'Indonesian',
        },
      ],
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    },
  };
}
