import { defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

export const panduan = defineType({
  name: 'panduan',
  title: 'Panduan (Guides)',
  type: 'document',
  icon: BookIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Publishing' },
    { name: 'seo', title: 'SEO / AEO / GEO' },
  ],
  fields: [
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
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
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
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Reviewed By',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'meta',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({ name: 'seo', type: 'seoFields', group: 'seo' }),
    defineField({ name: 'aeo', type: 'aeoFields', group: 'seo' }),
    defineField({ name: 'geo', type: 'geoFields', group: 'seo' }),
  ],

  preview: {
    select: { title: 'title', author: 'author.name', status: 'status', media: 'coverImage' },
    prepare({ title, author, status, media }) {
      return { title, subtitle: `${status} · ${author ?? ''}`, media }
    },
  },
})
