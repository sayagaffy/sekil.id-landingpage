import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export const citationBlock = defineType({
  name: 'citationBlock',
  title: 'Inline Citation',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Citation text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'text', subtitle: 'year' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title ?? 'Citation', subtitle: subtitle }
    },
  },
})
