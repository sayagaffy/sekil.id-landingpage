import type { Product } from '@/data/products';
import { SITE_URL, SITE_NAME } from './site-schema';

export function getProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/produk/${product.slug}#product`,
    name: product.name,
    description: product.description,
    keywords: product.primaryKeyword,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/produk/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
        '@id': `${SITE_URL}/#organization`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/produk/${product.slug}`,
    },
  };
}

export function getProductFAQSchema(faq: { q: string; a: string }[]) {
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

export function getProductHubItemListSchema(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Katalog Produk Asesmen Sekil.id',
    description: 'Daftar asesmen psikologi dan karier yang tersedia di Sekil.id',
    numberOfItems: products.length,
    itemListElement: products.map((product, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        url: `${SITE_URL}/produk/${product.slug}`,
        offers: {
          '@type': 'Offer',
          price: product.price.toString(),
          priceCurrency: 'IDR',
        },
      },
    })),
  };
}
