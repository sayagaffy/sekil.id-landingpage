import { defineField, defineType } from 'sanity'

export const geoFields = defineType({
  name: 'geoFields',
  title: 'GEO (Generative Engine Optimization)',
  type: 'object',
  fields: [
    defineField({
      name: 'tldr',
      title: 'TL;DR',
      type: 'text',
      rows: 3,
      description: '2–3 kalimat untuk Google AI Overview',
    }),
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Guide', value: 'guide' },
          { title: 'Article', value: 'article' },
          { title: 'Research', value: 'research' },
          { title: 'Tool', value: 'tool' },
          { title: 'FAQ', value: 'faq' },
        ],
        layout: 'radio',
      },
      initialValue: 'article',
    }),
    defineField({
      name: 'readingLevel',
      title: 'Reading Level',
      type: 'string',
      options: {
        list: [
          { title: 'General audience', value: 'general' },
          { title: 'High school (SMA)', value: 'sma' },
          { title: 'University', value: 'university' },
          { title: 'Professional', value: 'professional' },
        ],
        layout: 'radio',
      },
      initialValue: 'general',
    }),
    defineField({
      name: 'keyTakeaways',
      title: 'Key Takeaways',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Poin utama yang dipelajari pembaca',
    }),
  ],
  options: { collapsible: true, collapsed: true },
})
