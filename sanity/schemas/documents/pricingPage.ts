import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const pricingPage = defineType({
  name: 'pricingPage',
  title: 'Pricing Page (/harga)',
  type: 'document',
  icon: TagIcon,
  groups: [
    { name: 'hero', title: 'Hero Section', default: true },
    { name: 'content', title: 'Content' },
    { name: 'cta', title: 'CTA' },
  ],
  fields: [
    // ── Hero ───────────────────────────────────────────────────────────────
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroPillars',
      title: 'Key Stats (max 3)',
      type: 'array',
      group: 'hero',
      of: [
        {
          type: 'object',
          name: 'pillar',
          title: 'Stat',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'sub', title: 'Sub-label', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),

    // ── Content ─────────────────────────────────────────────────────────────
    defineField({
      name: 'faq',
      title: 'Pricing FAQ',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            defineField({ name: 'q', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'a', title: 'Answer', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'q' } },
        },
      ],
    }),
    defineField({
      name: 'atcDashboard',
      title: 'ATC Dashboard Add-on',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'price', title: 'Price', type: 'string', description: 'e.g. "Rp 30 juta"', validation: (Rule) => Rule.required() }),
        defineField({ name: 'priceUnit', title: 'Price Unit', type: 'string', description: 'e.g. "/tahun"' }),
        defineField({
          name: 'features',
          title: 'Feature List',
          type: 'array',
          of: [{ type: 'string' }],
        }),
      ],
    }),
    defineField({
      name: 'products',
      title: 'Produk & Harga',
      description: 'Daftar produk di tabel harga dan kalkulator. Kosongkan → pakai default kode.',
      type: 'array',
      group: 'content',
      of: [{
        type: 'object',
        name: 'pricingProduct',
        fields: [
          defineField({ name: 'slug', title: 'Slug', type: 'string', description: 'career-interest, psyai, path-finder-ai, dll', validation: (Rule) => Rule.required() }),
          defineField({ name: 'name', title: 'Nama Produk', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'duration', title: 'Durasi', type: 'string', description: 'mis. "15 menit"' }),
          defineField({ name: 'price', title: 'Harga (Rp)', type: 'number', validation: (Rule) => Rule.required().min(0) }),
        ],
        preview: { select: { title: 'name', subtitle: 'price' } },
      }],
    }),
    defineField({
      name: 'volumeTiers',
      title: 'Tingkatan Diskon Volume',
      description: 'Urutan dari minSeats terkecil ke terbesar. Kosongkan → pakai default kode.',
      type: 'array',
      group: 'content',
      of: [{
        type: 'object',
        name: 'volumeTier',
        fields: [
          defineField({ name: 'minSeats', title: 'Minimum Seat', type: 'number', validation: (Rule) => Rule.required().min(0) }),
          defineField({ name: 'discountRate', title: 'Diskon (0–1)', type: 'number', description: '0.15 = 15%, 0.5 = 50%', validation: (Rule) => Rule.required().min(0).max(1) }),
          defineField({ name: 'label', title: 'Label tampilan', type: 'string', description: 'mis. "500–1.999"' }),
        ],
        preview: { select: { title: 'label', subtitle: 'discountRate' } },
      }],
    }),
    defineField({
      name: 'bundles',
      title: 'Bundle Paket',
      description: 'Paket bundel produk. Kosongkan → pakai default kode.',
      type: 'array',
      group: 'content',
      of: [{
        type: 'object',
        name: 'bundle',
        fields: [
          defineField({ name: 'bundleId', title: 'ID (slug)', type: 'string', description: 'mis. career-starter (dipakai di URL ?bundle=...)', validation: (Rule) => Rule.required() }),
          defineField({ name: 'name', title: 'Nama Bundle', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
          defineField({ name: 'productSlugs', title: 'Produk dalam Bundle', type: 'array', of: [{ type: 'string' }], description: 'Slug produk: career-interest, psyai, dll' }),
          defineField({ name: 'bundlePrice', title: 'Harga Bundle (Rp)', type: 'number', validation: (Rule) => Rule.min(0) }),
          defineField({ name: 'comingSoon', title: 'Coming Soon?', type: 'boolean', initialValue: false }),
        ],
        preview: { select: { title: 'name', subtitle: 'bundlePrice' } },
      }],
    }),

    // ── CTA ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'ctaHeading',
      title: 'Bottom CTA Heading',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubheading',
      title: 'Bottom CTA Subheading',
      type: 'text',
      rows: 3,
      group: 'cta',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Pricing Page (/harga)' }
    },
  },
})
