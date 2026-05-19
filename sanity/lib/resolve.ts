import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation'

/**
 * Presentation tool URL resolver.
 * Maps each document type to its live preview URL(s) in the Next.js app.
 */
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    post: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? 'Untitled', href: `/blog/${doc?.slug ?? ''}` },
          { title: 'Blog', href: '/blog' },
        ],
      }),
    }),
    panduan: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? 'Untitled', href: `/panduan/${doc?.slug ?? ''}` },
          { title: 'Panduan', href: '/panduan' },
        ],
      }),
    }),
    personalityPost: defineLocations({
      select: { title: 'title', slug: 'personalitySlug' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? 'Untitled', href: `/kepribadian/${doc?.slug ?? ''}` },
        ],
      }),
    }),
    careerPost: defineLocations({
      select: { title: 'title', slug: 'careerSlug' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? 'Untitled', href: `/karier/${doc?.slug ?? ''}` },
        ],
      }),
    }),
    majorPost: defineLocations({
      select: { title: 'title', slug: 'majorSlug' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? 'Untitled', href: `/jurusan/${doc?.slug ?? ''}` },
        ],
      }),
    }),
    pricingPage: defineLocations({
      select: {},
      resolve: () => ({
        locations: [{ title: 'Pricing Page', href: '/harga' }],
      }),
    }),
    author: defineLocations({
      select: { title: 'name', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? 'Untitled', href: `/penulis/${doc?.slug ?? ''}` },
        ],
      }),
    }),
  },
}
