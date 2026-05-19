import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export const solutionSegment = defineType({
  name: 'solutionSegment',
  title: 'Segmen Solusi',
  type: 'document',
  icon: UsersIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'content', title: 'Konten' },
    { name: 'products', title: 'Produk' },
    { name: 'social', title: 'Testimoni & Stats' },
    { name: 'faq', title: 'FAQ' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Ordering ──────────────────────────────────────────────────────────────
    defineField({
      name: 'order',
      title: 'Urutan Tampilan',
      type: 'number',
      group: 'hero',
      description: '0 = pertama di halaman /solusi. Gunakan 0, 1, 2, 3',
      validation: (Rule) => Rule.required().min(0).integer(),
      initialValue: 0,
    }),

    // ── Identity ──────────────────────────────────────────────────────────────
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'hero',
      description: 'Contoh: untuk-sekolah → /solusi/untuk-sekolah',
      options: { source: 'name', maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Nama Segmen',
      type: 'string',
      group: 'hero',
      description: 'Contoh: "Untuk Sekolah" — tampil di card dan breadcrumb',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'hero',
      description: 'Teks kecil di atas headline. Contoh: "SOLUSI · SEKOLAH & SMA"',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroAccent',
      title: 'Warna Aksen Hero',
      type: 'string',
      group: 'hero',
      options: {
        list: [
          { title: 'Peach (Sekolah)', value: 'peach' },
          { title: 'Blue (Perguruan Tinggi)', value: 'blue' },
          { title: 'Navy (Perusahaan)', value: 'navy' },
          { title: 'Ink (Yayasan)', value: 'ink' },
        ],
        layout: 'radio',
      },
      initialValue: 'peach',
    }),

    // ── Problems ──────────────────────────────────────────────────────────────
    defineField({
      name: 'problems',
      title: 'Masalah yang Diselesaikan',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: 'Bullet points masalah yang dihadapi segmen ini (ditampilkan di ProblemList)',
    }),

    // ── Use Cases ─────────────────────────────────────────────────────────────
    defineField({
      name: 'useCases',
      title: 'Use Cases',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'useCase',
          title: 'Use Case',
          fields: [
            defineField({
              name: 'title',
              title: 'Judul',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Deskripsi',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        },
      ],
    }),

    // ── ATC Dashboard toggle ──────────────────────────────────────────────────
    defineField({
      name: 'showATCDashboard',
      title: 'Tampilkan ATC Dashboard section?',
      type: 'boolean',
      group: 'content',
      description: 'Aktifkan untuk perusahaan dan yayasan yang butuh enterprise add-on',
      initialValue: false,
    }),

    // ── Recommended Products (references) ────────────────────────────────────
    defineField({
      name: 'recommendedProducts',
      title: 'Produk yang Direkomendasikan',
      type: 'array',
      group: 'products',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description:
        'Pilih produk dari katalog — urutan menentukan tampilan. Harga otomatis terambil dari dokumen produk.',
    }),

    // ── Stats ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'stats',
      title: 'Statistik Kunci',
      type: 'array',
      group: 'social',
      of: [
        {
          type: 'object',
          name: 'stat',
          title: 'Stat',
          fields: [
            defineField({
              name: 'value',
              title: 'Nilai',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),

    // ── Testimonial ───────────────────────────────────────────────────────────
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'object',
      group: 'social',
      fields: [
        defineField({ name: 'quote', title: 'Kutipan', type: 'text', rows: 4 }),
        defineField({ name: 'author', title: 'Nama', type: 'string' }),
        defineField({ name: 'role', title: 'Jabatan', type: 'string' }),
        defineField({ name: 'institution', title: 'Institusi', type: 'string' }),
      ],
    }),

    // ── FAQ ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'faq',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            defineField({
              name: 'q',
              title: 'Pertanyaan',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'a',
              title: 'Jawaban',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: 'q' } },
        },
      ],
    }),

    // ── SEO ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Max 60 karakter',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Max 160 karakter',
      validation: (Rule) => Rule.max(160),
    }),
  ],

  orderings: [
    {
      title: 'Urutan Tampilan',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'headline',
      order: 'order',
    },
    prepare({ title, subtitle, order }) {
      return {
        title: `${order ?? '?'}. ${title ?? 'Unnamed'}`,
        subtitle: subtitle ?? '',
      }
    },
  },
})
