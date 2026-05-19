import { defineField, defineType } from 'sanity'
import { ThListIcon } from '@sanity/icons'

export const comparisonTableBlock = defineType({
  name: 'comparisonTableBlock',
  title: 'Comparison Table',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'headers',
      title: 'Column Headers',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.min(2),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tableRow',
          title: 'Row',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
          preview: {
            select: { cells: 'cells' },
            prepare({ cells }: { cells?: string[] }) {
              return { title: cells?.join(' | ') ?? 'Row' }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { headers: 'headers' },
    prepare({ headers }: { headers?: string[] }) {
      return { title: `Table: ${headers?.join(', ') ?? ''}` }
    },
  },
})
