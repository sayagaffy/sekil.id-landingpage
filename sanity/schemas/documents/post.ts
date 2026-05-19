import { defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export const post = defineType({
  name: 'post',
  title: 'Blog Posts',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Publishing' },
    { name: 'seo', title: 'SEO / AEO / GEO' },
  ],
  fields: [
    // ── Content ────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'content',
      description: '150–160 karakter',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required() }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'articleBody',
      group: 'content',
    }),

    // ── Publishing ─────────────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In Review', value: 'review' },
          { title: 'Approved', value: 'approved' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
      description: 'Tanggal publikasi. Isi dengan tanggal ke depan untuk dijadwalkan.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'modifiedAt',
      title: 'Last Modified At',
      type: 'datetime',
      group: 'meta',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'meta',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorCredential',
      title: 'Author Credential (override)',
      type: 'string',
      group: 'meta',
      description: 'Kosongkan untuk pakai credential dari profil author',
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Reviewed By',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'meta',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Jurusan', value: 'Jurusan' },
          { title: 'Karier', value: 'Karier' },
          { title: 'Psikologi', value: 'Psikologi' },
          { title: 'Kepribadian', value: 'Kepribadian' },
          { title: 'Panduan', value: 'Panduan' },
        ],
      },
      initialValue: 'Panduan',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post?',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Tampilkan di atas blog listing',
    }),

    // ── SEO / AEO / GEO ────────────────────────────────────────────────────
    defineField({ name: 'seo', type: 'seoFields', group: 'seo' }),
    defineField({ name: 'aeo', type: 'aeoFields', group: 'seo' }),
    defineField({ name: 'geo', type: 'geoFields', group: 'seo' }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      status: 'status',
      media: 'coverImage',
    },
    prepare({ title, author, status, media }) {
      const badges: Record<string, string> = { draft: '📝', review: '👀', approved: '✅', published: '🟢' }
      return {
        title,
        subtitle: `${badges[status] ?? ''} ${status} · ${author ?? 'No author'}`,
        media,
      }
    },
  },

  orderings: [
    { title: 'Published (newest)', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'Published (oldest)', name: 'publishedAtAsc', by: [{ field: 'publishedAt', direction: 'asc' }] },
    { title: 'Title', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
})
