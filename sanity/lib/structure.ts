import type { StructureResolver } from 'sanity/structure'

/**
 * Custom desk structure.
 * - Singletons (homePage, pricingPage, siteSettings, navigation) are pinned
 *   as direct links so editors can never accidentally create duplicates.
 * - Collections are grouped by purpose.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Sekil.id CMS')
    .items([
      // ── Content ────────────────────────────────────────────────────────
      S.listItem()
        .title('Content')
        .child(
          S.list()
            .title('Content')
            .items([
              S.documentTypeListItem('post').title('Blog Posts'),
              S.documentTypeListItem('panduan').title('Panduan (Guides)'),
              S.documentTypeListItem('author').title('Authors'),
            ])
        ),

      S.divider(),

      // ── Programmatic SEO ───────────────────────────────────────────────
      S.listItem()
        .title('Programmatic SEO')
        .child(
          S.list()
            .title('Programmatic SEO')
            .items([
              S.documentTypeListItem('personalityPost').title('Personality Types'),
              S.documentTypeListItem('careerPost').title('Careers'),
              S.documentTypeListItem('majorPost').title('Majors (Jurusan)'),
            ])
        ),

      S.divider(),

      // ── Produk & Solusi ────────────────────────────────────────────────
      S.listItem()
        .title('Produk & Solusi')
        .child(
          S.list()
            .title('Produk & Solusi')
            .items([
              S.documentTypeListItem('product').title('Produk Asesmen'),
              S.documentTypeListItem('solutionSegment').title('Segmen Solusi'),
            ])
        ),

      S.divider(),

      // ── Halaman (Singletons) ───────────────────────────────────────────
      S.listItem()
        .title('Halaman')
        .child(
          S.list()
            .title('Halaman')
            .items([
              S.listItem()
                .title('Home Page (/)')
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                ),
              S.listItem()
                .title('About Page (/tentang)')
                .child(
                  S.document()
                    .schemaType('aboutPage')
                    .documentId('aboutPage')
                ),
              S.listItem()
                .title('Pricing Page (/harga)')
                .child(
                  S.document()
                    .schemaType('pricingPage')
                    .documentId('pricingPage')
                ),
            ])
        ),

      S.divider(),

      // ── Settings (Singletons) ──────────────────────────────────────────
      S.listItem()
        .title('Settings')
        .child(
          S.list()
            .title('Settings')
            .items([
              S.listItem()
                .title('Site Settings')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                ),
              S.listItem()
                .title('Navigation')
                .child(
                  S.document()
                    .schemaType('navigation')
                    .documentId('navigation')
                ),
            ])
        ),
    ])
