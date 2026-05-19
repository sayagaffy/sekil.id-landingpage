import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  // Singleton — only one document with _id "homePage" should exist
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'products', title: 'Product Cards' },
    { name: 'stats', title: 'Stats Band' },
    { name: 'cta', title: 'CTA Section' },
    { name: 'faq', title: 'FAQ' },
  ],
  fields: [
    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroEyebrow',
      title: 'Hero — Eyebrow',
      type: 'string',
      group: 'hero',
      description: 'Contoh: "SEKIL.ID · ASESMEN AI"',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero — Heading',
      type: 'string',
      group: 'hero',
      description: 'Baris pertama heading (sebelum teks biru). Contoh: "Pahami diri Anda."',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroHeadingAccent',
      title: 'Hero — Heading (teks biru)',
      type: 'string',
      group: 'hero',
      description: 'Bagian berwarna biru dari heading. Contoh: "Tanpa tebakan."',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero — Subheading',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroCTAPrimary',
      title: 'Hero — CTA Utama',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string' }),
        defineField({ name: 'href', title: 'URL', type: 'string' }),
      ],
    }),
    defineField({
      name: 'heroCTASecondary',
      title: 'Hero — CTA Kedua',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string' }),
        defineField({ name: 'href', title: 'URL', type: 'string' }),
      ],
    }),
    defineField({
      name: 'heroMeta',
      title: 'Hero — Meta Strip',
      type: 'array',
      group: 'hero',
      description: 'Angka-angka kecil di bawah CTA. Contoh: "+62,000 SISWA"',
      of: [
        {
          type: 'object',
          name: 'metaItem',
          title: 'Item',
          fields: [
            defineField({ name: 'val', title: 'Nilai', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'val', subtitle: 'label' } },
        },
      ],
    }),

    // ── Products section ──────────────────────────────────────────────────────
    defineField({
      name: 'productsEyebrow',
      title: 'Products — Eyebrow',
      type: 'string',
      group: 'products',
    }),
    defineField({
      name: 'productsHeading',
      title: 'Products — Heading',
      type: 'string',
      group: 'products',
    }),
    defineField({
      name: 'products',
      title: 'Products — Kartu Produk',
      type: 'array',
      group: 'products',
      description: 'Kartu produk di homepage (max 3). Berbeda dari katalog /produk.',
      of: [
        {
          type: 'object',
          name: 'productCard',
          title: 'Product Card',
          fields: [
            defineField({ name: 'tag', title: 'Tag (nama atas)', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'iconName',
              title: 'Icon',
              type: 'string',
              description: 'Nama icon Lucide yang dipakai',
              options: {
                list: [
                  { title: 'Brain (PsyAI)', value: 'brain' },
                  { title: 'Compass (Path Finder)', value: 'compass' },
                  { title: 'Target (Goal Align)', value: 'target' },
                  { title: 'Bar Chart', value: 'bar-chart' },
                  { title: 'Zap', value: 'zap' },
                  { title: 'Star', value: 'star' },
                ],
                layout: 'radio',
              },
            }),
            defineField({ name: 'title', title: 'Judul Kartu', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'body', title: 'Deskripsi', type: 'text', rows: 2 }),
            defineField({
              name: 'meta',
              title: 'Meta tags (badge kecil)',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Contoh: "12 MIN", "18 DIMENSI", "EVIDENCE-LED"',
            }),
            defineField({
              name: 'variant',
              title: 'Warna Kartu',
              type: 'string',
              options: {
                list: [
                  { title: 'Putih (default)', value: 'default' },
                  { title: 'Peach', value: 'peach' },
                  { title: 'Navy', value: 'navy' },
                ],
                layout: 'radio',
              },
              initialValue: 'default',
            }),
            defineField({ name: 'href', title: 'Link URL', type: 'string' }),
          ],
          preview: {
            select: { title: 'tag', subtitle: 'title' },
          },
        },
      ],
    }),

    // ── Stats Band ────────────────────────────────────────────────────────────
    defineField({
      name: 'statsEyebrow',
      title: 'Stats — Eyebrow',
      type: 'string',
      group: 'stats',
    }),
    defineField({
      name: 'statsHeading',
      title: 'Stats — Heading',
      type: 'text',
      rows: 2,
      group: 'stats',
      description: 'Gunakan \\n untuk baris baru. Contoh: "Hasil nyata.\\nBukan tebakan."',
    }),
    defineField({
      name: 'stats',
      title: 'Stats — Data',
      type: 'array',
      group: 'stats',
      of: [
        {
          type: 'object',
          name: 'stat',
          title: 'Stat',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'value', title: 'Nilai', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'unit', title: 'Unit (opsional)', type: 'string', description: 'Contoh: "+", "%", " min"' }),
            defineField({ name: 'featured', title: 'Highlight (peach)?', type: 'boolean', initialValue: false }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),

    // ── CTA Section ───────────────────────────────────────────────────────────
    defineField({
      name: 'ctaEyebrow',
      title: 'CTA — Eyebrow',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'CTA — Heading',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubheading',
      title: 'CTA — Subheading',
      type: 'text',
      rows: 3,
      group: 'cta',
    }),
    defineField({
      name: 'ctaCTAPrimary',
      title: 'CTA — Tombol Utama',
      type: 'object',
      group: 'cta',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string' }),
        defineField({ name: 'href', title: 'URL', type: 'string' }),
      ],
    }),
    defineField({
      name: 'ctaCTASecondary',
      title: 'CTA — Tombol Kedua',
      type: 'object',
      group: 'cta',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string' }),
        defineField({ name: 'href', title: 'URL', type: 'string' }),
      ],
    }),

    // ── FAQ ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'faqHeading',
      title: 'FAQ — Heading',
      type: 'string',
      group: 'faq',
    }),
    defineField({
      name: 'faq',
      title: 'FAQ — Items',
      type: 'array',
      group: 'faq',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            defineField({ name: 'q', title: 'Pertanyaan', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'a', title: 'Jawaban', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'q' } },
        },
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})
