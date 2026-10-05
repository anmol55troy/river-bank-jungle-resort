import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/constants'
import { getBlogPosts, getDiningVenues, getRooms } from '@/lib/data'

export const revalidate = 3600

const STATIC_PATHS = [
  '',
  '/about',
  '/rooms',
  '/dining',
  '/experiences',
  '/events',
  '/sustainability',
  '/offers',
  '/gallery',
  '/awards',
  '/blog',
  '/contact',
  '/privacy-policy',
  '/terms',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [rooms, venues, posts] = await Promise.all([
    getRooms().catch(() => []),
    getDiningVenues().catch(() => []),
    getBlogPosts().catch(() => []),
  ])

  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }))

  const roomEntries: MetadataRoute.Sitemap = rooms.map((room) => ({
    url: `${SITE_URL}/rooms/${room.slug}`,
    lastModified: room.updatedAt ? new Date(room.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  const venueEntries: MetadataRoute.Sitemap = venues.map((venue) => ({
    url: `${SITE_URL}/dining/${venue.slug}`,
    lastModified: venue.updatedAt ? new Date(venue.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticEntries, ...roomEntries, ...venueEntries, ...postEntries]
}
