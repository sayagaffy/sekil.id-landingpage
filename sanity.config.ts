import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import * as schemas from './sanity/schemas'
import { structure } from './sanity/lib/structure'
import { resolve } from './sanity/lib/resolve'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  name: 'sekilid',
  title: 'Sekil.id CMS',
  basePath: '/cms',

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),

    presentationTool({
      resolve,
      previewUrl: {
        // Use the canonical site URL so the preview iframe stays same-origin
        // as the Studio (both on sekil.id) and passes X-Frame-Options: SAMEORIGIN.
        // In local dev this falls back to localhost:3000.
        origin: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),

    // Vision: GROQ query playground (available in Studio only, not shipped to users)
    visionTool(),
  ],

  schema: {
    types: Object.values(schemas),
  },
})
