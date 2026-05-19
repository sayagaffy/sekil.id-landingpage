import { defineField, defineType } from 'sanity'
import { CaseIcon } from '@sanity/icons'

/**
 * Optional enriched editorial content for programmatic
 * career pages (/karier/[slug]).
 */
export const careerPost = defineType({
  name: 'careerPost',
  title: 'Careers (Content)',
  type: 'document',
  icon: CaseIcon,
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'careerSlug',
      title: 'Career Slug',
      type: 'string',
      group: 'content',
      description: 'Slug karier, contoh: data-scientist, software-engineer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'articleBody',
      group: 'content',
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
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'authorCredential',
      title: 'Author Credential',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Reviewed By',
      type: 'string',
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
    select: { title: 'title', slug: 'careerSlug' },
    prepare({ title, slug }) {
      return { title, subtitle: `/karier/${slug ?? ''}` }
    },
  },
})
