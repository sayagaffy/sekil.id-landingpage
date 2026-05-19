import { defineField, defineType } from 'sanity'
import { BulbOutlineIcon } from '@sanity/icons'

/**
 * Callout block — equivalent of the Keystatic `wrapper` component.
 * Contains its own portable text body so editors can write
 * arbitrary content inside the styled callout box.
 */
export const calloutBlock = defineType({
  name: 'calloutBlock',
  title: 'Callout',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'calloutType',
      title: 'Callout type',
      type: 'string',
      options: {
        list: [
          { title: '💡 Tip', value: 'tip' },
          { title: 'ℹ️ Info', value: 'info' },
          { title: '⚠️ Warning', value: 'warning' },
          { title: '🚨 Important', value: 'important' },
        ],
        layout: 'radio',
      },
      initialValue: 'info',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title (optional)',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { type: 'calloutType', title: 'title' },
    prepare({ type, title }: { type?: string; title?: string }) {
      const icons: Record<string, string> = { tip: '💡', info: 'ℹ️', warning: '⚠️', important: '🚨' }
      return { title: `${icons[type ?? 'info'] ?? ''} ${title || type || 'Callout'}` }
    },
  },
})
