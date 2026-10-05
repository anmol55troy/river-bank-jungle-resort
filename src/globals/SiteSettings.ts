import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    description: 'Sitewide contact details, links and defaults.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', defaultValue: 'River Bank Jungle Resort' },
            { name: 'tagline', type: 'text', defaultValue: 'A riverside sanctuary on the edge of Chitwan National Park' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'footerText', type: 'textarea' },
            {
              name: 'defaultSeoImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Fallback Open Graph image (1200×630).' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'address', type: 'text', defaultValue: 'Bharatpur-22, Patihani, Chitwan, Nepal' },
            { name: 'salesOffice', type: 'text', defaultValue: 'Sales Office: Maharajgunj, Kathmandu, Nepal' },
            {
              name: 'phones',
              type: 'array',
              fields: [{ name: 'number', type: 'text', required: true }],
            },
            {
              name: 'emails',
              type: 'array',
              fields: [{ name: 'email', type: 'email', required: true }],
            },
            { name: 'whatsapp', type: 'text', defaultValue: '+9779761734722', admin: { description: 'Full number with country code, digits only after +.' } },
            { name: 'mapUrl', type: 'text', defaultValue: 'https://maps.app.goo.gl/zGQW2VfhALDefCGf8' },
          ],
        },
        {
          label: 'Links',
          fields: [
            { name: 'bookingUrl', type: 'text', defaultValue: 'https://book-directonline.com/properties/riverbankjungleresortpvtltd' },
            { name: 'virtualTourUrl', type: 'text', defaultValue: 'https://virtualtour.airliftventures.com/riverbank-jungle-resort/' },
            { name: 'facebook', type: 'text', defaultValue: 'https://www.facebook.com/profile.php?id=61555768349361' },
            { name: 'instagram', type: 'text', defaultValue: 'https://www.instagram.com/river_bank_jungle_resort/' },
            { name: 'linkedin', type: 'text', defaultValue: 'https://www.linkedin.com/company/104239283' },
            { name: 'bookingCom', type: 'text', admin: { description: 'Booking.com listing URL' } },
            { name: 'tripadvisor', type: 'text', admin: { description: 'TripAdvisor listing URL' } },
            { name: 'makemytrip', type: 'text', admin: { description: 'MakeMyTrip listing URL' } },
          ],
        },
        {
          label: 'Page Banners',
          description: 'Manage the hero banner images shown at the top of each page.',
          fields: [
            { name: 'aboutBanner', type: 'upload', relationTo: 'media', admin: { description: 'Hero image for the About page' } },
            { name: 'diningBanner', type: 'upload', relationTo: 'media', admin: { description: 'Hero image for the Dining page' } },
            { name: 'roomsBanner', type: 'upload', relationTo: 'media', admin: { description: 'Hero image for the Rooms & Suites page' } },
            { name: 'experiencesBanner', type: 'upload', relationTo: 'media', admin: { description: 'Hero image for the Experiences page' } },
            { name: 'offersBanner', type: 'upload', relationTo: 'media', admin: { description: 'Hero image for the Offers page' } },
            { name: 'galleryBanner', type: 'upload', relationTo: 'media', admin: { description: 'Hero image for the Gallery page' } },
            { name: 'contactBanner', type: 'upload', relationTo: 'media', admin: { description: 'Hero image for the Contact page' } },
            { name: 'eventsBanner', type: 'upload', relationTo: 'media', admin: { description: 'Hero image for the Weddings & Events page' } },
            { name: 'sustainabilityBanner', type: 'upload', relationTo: 'media', admin: { description: 'Hero image for the Sustainability page' } },
          ],
        },
      ],
    },
  ],
}
