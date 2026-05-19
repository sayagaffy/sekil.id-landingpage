import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const author = defineType({
  name: 'author',
  title: 'Authors',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      description: 'URL-friendly ID untuk halaman profil /penulis/[slug]',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'credential',
      title: 'Credential / Title',
      type: 'string',
      description: 'e.g. "M.Psi., Psikolog", "S.T., MBA"',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Content Author', value: 'author' },
          { title: 'Academic Reviewer', value: 'reviewer' },
          { title: 'Editor', value: 'editor' },
        ],
        layout: 'radio',
      },
      initialValue: 'author',
    }),
    defineField({
      name: 'affiliation',
      title: 'Institution / Affiliation',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'orcid',
      title: 'ORCID',
      type: 'string',
      description: 'e.g. 0000-0000-0000-0000',
    }),
    defineField({
      name: 'isAcademicReviewer',
      title: 'Is Academic Reviewer?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'credential', media: 'photo' },
  },
})
