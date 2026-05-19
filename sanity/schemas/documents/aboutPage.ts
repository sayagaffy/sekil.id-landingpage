import { defineField, defineType } from 'sanity'
import { InfoOutlineIcon } from '@sanity/icons'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page (/tentang)',
  type: 'document',
  icon: InfoOutlineIcon,
  // Singleton — only one document with _id "aboutPage" should exist
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'story', title: 'Cerita Kami' },
    { name: 'pillars', title: 'Tiga Pilar' },
    { name: 'team', title: 'Tim' },
    { name: 'milestones', title: 'Milestone' },
    { name: 'cta', title: 'CTA' },
  ],
  fields: [
    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroEyebrow',
      title: 'Hero — Eyebrow',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero — Heading',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero — Subheading',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),

    // ── Cerita Kami ───────────────────────────────────────────────────────────
    defineField({
      name: 'storyEyebrow',
      title: 'Cerita — Eyebrow',
      type: 'string',
      group: 'story',
    }),
    defineField({
      name: 'storyHeading',
      title: 'Cerita — Heading',
      type: 'string',
      group: 'story',
    }),
    defineField({
      name: 'storyParagraphs',
      title: 'Cerita — Paragraf',
      type: 'array',
      group: 'story',
      of: [{ type: 'text' }],
      description: 'Satu item = satu paragraf. Urutan menentukan tampilan.',
    }),

    // ── Tiga Pilar ────────────────────────────────────────────────────────────
    defineField({
      name: 'pillarsEyebrow',
      title: 'Pilar — Eyebrow',
      type: 'string',
      group: 'pillars',
    }),
    defineField({
      name: 'pillarsHeading',
      title: 'Pilar — Heading',
      type: 'string',
      group: 'pillars',
    }),
    defineField({
      name: 'pillars',
      title: 'Pilar — Items',
      type: 'array',
      group: 'pillars',
      of: [
        {
          type: 'object',
          name: 'pillar',
          title: 'Pilar',
          fields: [
            defineField({ name: 'label', title: 'Label (kecil)', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'partner', title: 'Nama Partner', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Deskripsi', type: 'text', rows: 3 }),
            defineField({
              name: 'accentColor',
              title: 'Warna Aksen',
              type: 'string',
              options: {
                list: [
                  { title: 'Peach (Akademik)', value: 'peach' },
                  { title: 'Blue (Teknologi)', value: 'blue' },
                  { title: 'Navy (Distribusi)', value: 'navy' },
                ],
                layout: 'radio',
              },
              initialValue: 'peach',
            }),
          ],
          preview: {
            select: { title: 'partner', subtitle: 'label' },
          },
        },
      ],
    }),

    // ── Tim ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'teamEyebrow',
      title: 'Tim — Eyebrow',
      type: 'string',
      group: 'team',
    }),
    defineField({
      name: 'teamHeading',
      title: 'Tim — Heading',
      type: 'string',
      group: 'team',
    }),
    defineField({
      name: 'teamNote',
      title: 'Tim — Catatan (opsional)',
      type: 'text',
      rows: 2,
      group: 'team',
      description: 'Teks kecil di bawah heading. Contoh: "Profil lengkap akan dipublikasikan bertahap..."',
    }),
    defineField({
      name: 'team',
      title: 'Tim — Anggota',
      type: 'array',
      group: 'team',
      of: [
        {
          type: 'object',
          name: 'teamMember',
          title: 'Anggota Tim',
          fields: [
            defineField({ name: 'name', title: 'Nama', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'role', title: 'Jabatan', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'bio', title: 'Bio Singkat', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'role' },
          },
        },
      ],
    }),

    // ── Milestone Timeline ────────────────────────────────────────────────────
    defineField({
      name: 'milestonesEyebrow',
      title: 'Milestone — Eyebrow',
      type: 'string',
      group: 'milestones',
    }),
    defineField({
      name: 'milestonesHeading',
      title: 'Milestone — Heading',
      type: 'string',
      group: 'milestones',
    }),
    defineField({
      name: 'milestones',
      title: 'Milestone — Items',
      type: 'array',
      group: 'milestones',
      of: [
        {
          type: 'object',
          name: 'milestone',
          title: 'Milestone',
          fields: [
            defineField({ name: 'period', title: 'Periode', type: 'string', description: 'Contoh: "2024 Q4"', validation: (Rule) => Rule.required() }),
            defineField({ name: 'event', title: 'Event', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Deskripsi', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'event', subtitle: 'period' },
          },
        },
      ],
    }),

    // ── CTA ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'ctaHeading',
      title: 'CTA — Heading',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubheading',
      title: 'CTA — Subheading',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({
      name: 'ctaCTAPrimary',
      title: 'CTA — Tombol Utama',
      type: 'object',
      group: 'cta',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string' }),
        defineField({ name: 'href', title: 'URL', type: 'string' }),
      ],
    }),
    defineField({
      name: 'ctaCTASecondary',
      title: 'CTA — Tombol Kedua',
      type: 'object',
      group: 'cta',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string' }),
        defineField({ name: 'href', title: 'URL', type: 'string' }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'About Page (/tentang)' }
    },
  },
})
