import { defineField, defineType } from 'sanity'
import { MenuIcon } from '@sanity/icons'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'headerItems',
      title: 'Header Navigation Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          title: 'Nav Item',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', title: 'URL Path', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'isExternal', title: 'External link?', type: 'boolean', initialValue: false }),
            defineField({
              name: 'children',
              title: 'Dropdown Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'navSubItem',
                  title: 'Sub-item',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'href', title: 'URL Path', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'description', title: 'Description', type: 'string' }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'href' } },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Header CTA Label',
      type: 'string',
      description: 'Button di kanan header, e.g. "Coba Gratis"',
    }),
    defineField({
      name: 'ctaHref',
      title: 'Header CTA URL',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation' }
    },
  },
})
