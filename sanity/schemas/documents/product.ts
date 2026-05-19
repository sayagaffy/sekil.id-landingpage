import { defineField, defineType } from 'sanity'
import { BasketIcon } from '@sanity/icons'

export const product = defineType({
  name: 'product',
  title: 'Produk Asesmen',
  type: 'document',
  icon: BasketIcon,
  groups: [
    { name: 'core', title: 'Utama', default: true },
    { name: 'detail', title: 'Detail & Output' },
    { name: 'faq', title: 'FAQ' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Ordering ──────────────────────────────────────────────────────────────
    defineField({
      name: 'order',
      title: 'Urutan Tampilan',
      type: 'number',
      group: 'core',
      description: '0 = paling kiri / pertama. Gunakan 0, 1, 2, 3, 4 …',
      validation: (Rule) => Rule.required().min(0).integer(),
      initialValue: 0,
    }),

    // ── Identity ──────────────────────────────────────────────────────────────
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'core',
      description: 'Contoh: career-interest → /produk/career-interest',
      options: { source: 'name', maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Nama Pendek',
      type: 'string',
      group: 'core',
      description: 'Contoh: "PsyAI" — dipakai di bundle, nav, dan breadcrumb',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameDisplay',
      title: 'Nama Lengkap',
      type: 'string',
      group: 'core',
      description: 'Contoh: "PsyAI — Profil Kepribadian Terintegrasi"',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'core',
      validation: (Rule) => Rule.required(),
    }),

    // ── Pricing ───────────────────────────────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Harga (Rp)',
      type: 'number',
      group: 'core',
      description: 'Angka saja, tanpa "Rp" dan titik — misal: 150000',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'duration',
      title: 'Durasi',
      type: 'string',
      group: 'core',
      description: 'Contoh: "15 menit"',
      validation: (Rule) => Rule.required(),
    }),

    // ── Targeting ─────────────────────────────────────────────────────────────
    defineField({
      name: 'targetPersonas',
      title: 'Target Pengguna',
      type: 'array',
      group: 'core',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Siswa SMA', value: 'siswa-sma' },
          { title: 'Mahasiswa', value: 'mahasiswa' },
          { title: 'Fresh Grad', value: 'fresh-grad' },
          { title: 'Karyawan', value: 'karyawan' },
          { title: 'Manager', value: 'manager' },
        ],
        layout: 'tags',
      },
    }),
    defineField({
      name: 'instruments',
      title: 'Instrumen Psikologi',
      type: 'array',
      group: 'core',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Holland Code (RIASEC)', value: 'holland' },
          { title: 'MBTI', value: 'mbti' },
          { title: 'Papi Kostick', value: 'papi' },
        ],
        layout: 'tags',
      },
    }),

    // ── Descriptions ──────────────────────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Deskripsi Singkat',
      type: 'text',
      rows: 3,
      group: 'detail',
      description: 'Muncul di ProductCard dan meta description default',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'longDescription',
      title: 'Deskripsi Panjang',
      type: 'text',
      rows: 6,
      group: 'detail',
      description: 'Paragraf penuh di halaman produk (/produk/[slug])',
    }),
    defineField({
      name: 'outputs',
      title: 'Yang Didapat (Output List)',
      type: 'array',
      group: 'detail',
      of: [{ type: 'string' }],
      description: 'Bullet list output yang diterima peserta',
    }),
    defineField({
      name: 'sampleReportTeaser',
      title: 'Sample Report Teaser',
      type: 'text',
      rows: 4,
      group: 'detail',
      description: 'Teks preview laporan sampel di halaman produk',
    }),
    defineField({
      name: 'bundleSuggestions',
      title: 'Saran Bundle (slug)',
      type: 'array',
      group: 'detail',
      of: [{ type: 'string' }],
      description: 'Slug produk lain yang disarankan sebagai bundle. Contoh: psyai',
    }),

    // ── FAQ ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'faq',
      title: 'FAQ Produk',
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

    // ── SEO ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Judul halaman untuk search engine (max 60 karakter)',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Meta description untuk search engine (max 160 karakter)',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'primaryKeyword',
      title: 'Primary Keyword',
      type: 'string',
      group: 'seo',
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
      subtitle: 'price',
      order: 'order',
    },
    prepare({ title, subtitle, order }) {
      return {
        title: `${order ?? '?'}. ${title ?? 'Unnamed'}`,
        subtitle: subtitle ? `Rp ${Number(subtitle).toLocaleString('id-ID')}` : '',
      }
    },
  },
})
