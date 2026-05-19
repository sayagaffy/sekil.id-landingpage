import { defineField, defineType } from 'sanity'
import { InfoOutlineIcon } from '@sanity/icons'

export const disclaimerBlock = defineType({
  name: 'disclaimerBlock',
  title: 'Disclaimer Block (YMYL)',
  type: 'object',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Disclaimer type',
      type: 'string',
      options: {
        list: [
          { title: 'Psychological assessment', value: 'psikologi' },
          { title: 'Career guidance', value: 'karier' },
          { title: 'Educational guidance', value: 'pendidikan' },
          { title: 'General', value: 'general' },
        ],
        layout: 'radio',
      },
      initialValue: 'psikologi',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customText',
      title: 'Custom text (optional)',
      type: 'text',
      rows: 3,
      description: 'Kosongkan untuk menggunakan teks default sesuai tipe',
    }),
  ],
  preview: {
    select: { type: 'type' },
    prepare({ type }: { type?: string }) {
      return { title: `Disclaimer: ${type ?? ''}` }
    },
  },
})
