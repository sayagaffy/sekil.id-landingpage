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
