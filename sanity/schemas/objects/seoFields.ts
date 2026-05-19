import { defineField, defineType } from 'sanity'

export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: '50–60 karakter',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: '150–160 karakter',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'focusKeyword',
      title: 'Focus Keyword',
      type: 'string',
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      type: 'url',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      description: '1200×630px recommended',
      options: { hotspot: true },
    }),
    defineField({
      name: 'robots',
      title: 'Robots directive',
      type: 'string',
      options: {
        list: [
          { title: 'index, follow', value: 'index, follow' },
          { title: 'noindex, follow', value: 'noindex, follow' },
          { title: 'noindex, nofollow', value: 'noindex, nofollow' },
        ],
        layout: 'radio',
      },
      initialValue: 'index, follow',
    }),
  ],
  options: { collapsible: true, collapsed: true },
})
