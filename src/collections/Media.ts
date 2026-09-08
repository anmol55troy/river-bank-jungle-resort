import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    description: 'Images used across the site. Always provide descriptive alt text.',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for screen readers and SEO, e.g. "Canoe gliding down the Rapti River at sunset".',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'card',
        width: 800,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'hero',
        width: 1920,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'centre',
        formatOptions: { format: 'jpeg', options: { quality: 85 } },
      },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
}
