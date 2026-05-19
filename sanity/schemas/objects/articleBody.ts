import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Reusable Portable Text body field — used by blog, panduan,
 * personalityPost, careerPost, and majorPost document types.
 *
 * Contains standard text blocks + all custom article blocks.
 */
export const articleBody = defineType({
  name: 'articleBody',
  title: 'Article Body',
  type: 'array',
  of: [
    // ── Standard rich text block ───────────────────────────────────────────
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Inline code', value: 'code' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
        ],
        annotations: [
          defineField({
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule) =>
                  Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
              }),
              defineField({
                name: 'blank',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          }),
        ],
      },
    }),

    // ── Custom blocks ─────────────────────────────────────────────────────
    defineArrayMember({ type: 'articleImageBlock' }),
    defineArrayMember({ type: 'pullQuoteBlock' }),
    defineArrayMember({ type: 'comparisonTableBlock' }),
    defineArrayMember({ type: 'disclaimerBlock' }),
    defineArrayMember({ type: 'calloutBlock' }),
    defineArrayMember({ type: 'citationBlock' }),
  ],
})
