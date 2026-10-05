import { cache } from 'react'

import type {
  BlogPost,
  DiningVenue,
  Experience,
  Faq,
  GalleryImage,
  Offer,
  Room,
  SiteSetting,
  Testimonial,
} from '@/payload-types'

import { getPayloadClient } from './payload'

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings' })
})

export const getRooms = cache(async (): Promise<Room[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'rooms', sort: 'order', limit: 50 })
  return docs
})

export const getRoomBySlug = cache(async (slug: string): Promise<Room | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'rooms',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
})

export const getDiningVenues = cache(async (): Promise<DiningVenue[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'dining-venues', sort: 'order', limit: 50, depth: 2 })
  return docs
})

export const getDiningVenueBySlug = cache(async (slug: string): Promise<DiningVenue | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'dining-venues',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
})

export const getExperiences = cache(async (): Promise<Experience[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'experiences', sort: 'order', limit: 50 })
  return docs
})

export const getActiveOffers = cache(async (): Promise<Offer[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'offers',
    where: { active: { equals: true } },
    sort: '-createdAt',
    limit: 50,
  })
  return docs
})

export const getBlogPosts = cache(async (limit = 50): Promise<BlogPost[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blog-posts',
    sort: '-publishedDate',
    limit,
  })
  return docs
})

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
})

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'testimonials', limit: 20 })
  return docs
})

export const getFAQs = cache(async (): Promise<Faq[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'faqs', sort: 'order', limit: 50 })
  return docs
})

export const getGalleryImages = cache(async (): Promise<GalleryImage[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'gallery-images', sort: 'order', limit: 200 })
  return docs
})
