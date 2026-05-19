import { defineField, defineType } from 'sanity'

export const aeoFields = defineType({
  name: 'aeoFields',
  title: 'AEO (AI Engine Optimization)',
  type: 'object',
  fields: [
    defineField({
      name: 'quotableSummary',
      title: 'Quotable Summary',
      type: 'text',
      rows: 3,
      description: '1–2 kalimat untuk AI engines (Perplexity, ChatGPT)',
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'question' } },
        },
      ],
    }),
    defineField({
      name: 'citations',
      title: 'Citations',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'citation',
          title: 'Citation',
          fields: [
            defineField({ name: 'text', title: 'Citation text', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: { select: { title: 'text' } },
        },
      ],
    }),
    defineField({
      name: 'entityTags',
      title: 'Entity Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
  ],
  options: { collapsible: true, collapsed: true },
})
