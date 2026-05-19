import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default OG Image',
      type: 'image',
      description: '1200×630px — used when page has no specific OG image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'twitter', title: 'Twitter / X', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube', type: 'url' }),
        defineField({ name: 'tiktok', title: 'TikTok', type: 'url' }),
      ],
    }),
    defineField({
      name: 'announcement',
      title: 'Site-wide Announcement Banner',
      type: 'object',
      description: 'Optional banner shown sitewide (e.g. maintenance, promo)',
      fields: [
        defineField({ name: 'enabled', title: 'Enable banner?', type: 'boolean', initialValue: false }),
        defineField({ name: 'message', title: 'Message', type: 'string' }),
        defineField({ name: 'linkLabel', title: 'Link label', type: 'string' }),
        defineField({ name: 'linkHref', title: 'Link URL', type: 'string' }),
        defineField({
          name: 'variant',
          title: 'Variant',
          type: 'string',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Warning', value: 'warning' },
              { title: 'Success', value: 'success' },
            ],
          },
          initialValue: 'info',
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'siteName' },
  },
})
