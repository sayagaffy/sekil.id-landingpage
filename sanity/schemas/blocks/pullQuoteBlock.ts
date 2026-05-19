import { defineField, defineType } from 'sanity'
import { BlockquoteIcon } from '@sanity/icons'

export const pullQuoteBlock = defineType({
  name: 'pullQuoteBlock',
  title: 'Pull Quote',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'quote', subtitle: 'attribution' },
    prepare({ title, subtitle }) {
      return {
        title: `"${title?.slice(0, 60) ?? ''}…"`,
        subtitle: subtitle || 'Pull Quote',
      }
    },
  },
})
