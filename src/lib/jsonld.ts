import type { Faq, SiteSetting, Testimonial } from '@/lib/types'

import { DEFAULTS, SITE_NAME, SITE_URL } from './constants'

type JsonLd = Record<string, unknown>

const lexicalToPlainText = (richText: unknown): string => {
  const walk = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const n = node as { text?: string; children?: unknown[] }
    if (typeof n.text === 'string') return n.text
    if (Array.isArray(n.children)) return n.children.map(walk).join(' ')
    return ''
  }
  const root = (richText as { root?: unknown })?.root
  return walk(root).replace(/\s+/g, ' ').trim()
}

export function resortSchema(settings: SiteSetting | null): JsonLd {
  const phones = settings?.phones?.map((p) => p.number) ?? [...DEFAULTS.phones]
  /* sameAs must point at profiles for this exact entity — the OTA listing
     counts, a site-wide search URL does not. */
  const sameAs = [
    settings?.facebook ?? DEFAULTS.facebook,
    settings?.instagram ?? DEFAULTS.instagram,
    settings?.linkedin ?? DEFAULTS.linkedin,
    DEFAULTS.bookingCom,
  ].filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'Resort',
    '@id': `${SITE_URL}/#resort`,
    name: settings?.siteName ?? SITE_NAME,
    description:
      'A riverside jungle resort in Patihani, Chitwan, on the banks of the Rapti River beside Chitwan National Park, Nepal.',
    url: SITE_URL,
    telephone: phones[0],
    email: settings?.emails?.[0]?.email ?? DEFAULTS.emails[0],
    priceRange: '$$',
    image: [`${SITE_URL}/hero/slider1.webp`, `${SITE_URL}/hero/riverside.webp`],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bharatpur-22, Patihani',
      addressLocality: 'Chitwan',
      addressRegion: 'Bagmati Province',
      addressCountry: 'NP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: DEFAULTS.geo.latitude,
      longitude: DEFAULTS.geo.longitude,
    },
    hasMap: settings?.mapUrl ?? DEFAULTS.mapUrl,
    sameAs,
    amenityFeature: [
      'Air conditioning',
      'Free Wi-Fi',
      'Outdoor swimming pool',
      'Restaurant',
      'Bar',
      'Room service',
      'Airport pickup',
      'Jungle safari activities',
    ].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
    checkinTime: '14:00',
    checkoutTime: '12:00',
  }
}

export function faqSchema(faqs: Faq[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: lexicalToPlainText(faq.answer),
      },
    })),
  }
}

export function reviewsSchema(testimonials: Testimonial[]): JsonLd | null {
  if (testimonials.length === 0) return null
  const avg =
    testimonials.reduce((sum, t) => sum + (t.rating ?? 5), 0) / testimonials.length

  return {
    '@context': 'https://schema.org',
    '@type': 'Resort',
    '@id': `${SITE_URL}/#resort`,
    name: SITE_NAME,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Number(avg.toFixed(1)),
      reviewCount: testimonials.length,
      bestRating: 5,
    },
    review: testimonials.slice(0, 10).map((t) => ({
      '@type': 'Review',
      reviewBody: t.quote,
      reviewRating: { '@type': 'Rating', ratingValue: t.rating ?? 5, bestRating: 5 },
      author: { '@type': 'Person', name: t.guestName },
    })),
  }
}

export function blogPostingSchema(args: {
  title: string
  description: string
  slug: string
  author?: string | null
  publishedDate?: string | null
  image?: string | null
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: args.title,
    description: args.description,
    url: `${SITE_URL}/blog/${args.slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${args.slug}`,
    ...(args.image ? { image: args.image.startsWith('http') ? args.image : `${SITE_URL}${args.image}` } : {}),
    ...(args.publishedDate ? { datePublished: args.publishedDate } : {}),
    author: { '@type': 'Organization', name: args.author ?? SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}
