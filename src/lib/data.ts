import { cache } from 'react'
import { connectDB } from './db/connect'
import {
  AmenityModel,
  BlogPostModel,
  DiningVenueModel,
  ExperienceModel,
  FaqModel,
  GalleryImageModel,
  MediaModel,
  OfferModel,
  RoomModel,
  SiteSettingModel,
  TestimonialModel,
} from './db/models'
import { serializeDoc, serializeDocs } from './db/serialize'
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
} from './types'

// Ensure models are registered in Mongoose
void AmenityModel
void MediaModel

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  await connectDB()
  const doc = await SiteSettingModel.findOne({ globalType: 'site-settings' })
    .populate('logo')
    .populate('defaultSeoImage')
    .populate('aboutBanner')
    .populate('aboutSecondaryImage')
    .populate('diningBanner')
    .populate('roomsBanner')
    .populate('experiencesBanner')
    .populate('offersBanner')
    .populate('galleryBanner')
    .populate('contactBanner')
    .populate('eventsBanner')
    .populate('sustainabilityBanner')
    .lean()

  return serializeDoc<SiteSetting>(doc) || {}
})

export const getRooms = cache(async (): Promise<Room[]> => {
  await connectDB()
  const docs = await RoomModel.find({})
    .sort({ order: 1 })
    .limit(50)
    .populate('amenities')
    .populate('gallery.image')
    .lean()

  return serializeDocs<Room>(docs)
})

export const getRoomBySlug = cache(async (slug: string): Promise<Room | null> => {
  await connectDB()
  const doc = await RoomModel.findOne({ slug })
    .populate('amenities')
    .populate('gallery.image')
    .lean()

  return serializeDoc<Room>(doc) ?? null
})

export const getDiningVenues = cache(async (): Promise<DiningVenue[]> => {
  await connectDB()
  const docs = await DiningVenueModel.find({})
    .sort({ order: 1 })
    .limit(50)
    .populate('image')
    .populate('gallery.image')
    .lean()

  return serializeDocs<DiningVenue>(docs)
})

export const getDiningVenueBySlug = cache(async (slug: string): Promise<DiningVenue | null> => {
  await connectDB()
  const doc = await DiningVenueModel.findOne({ slug })
    .populate('image')
    .populate('gallery.image')
    .lean()

  return serializeDoc<DiningVenue>(doc) ?? null
})

export const getExperiences = cache(async (): Promise<Experience[]> => {
  await connectDB()
  const docs = await ExperienceModel.find({})
    .sort({ order: 1 })
    .limit(50)
    .populate('image')
    .lean()

  return serializeDocs<Experience>(docs)
})

export const getActiveOffers = cache(async (): Promise<Offer[]> => {
  await connectDB()
  const docs = await OfferModel.find({ active: true })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('image')
    .lean()

  return serializeDocs<Offer>(docs)
})

export const getBlogPosts = cache(async (limit = 50): Promise<BlogPost[]> => {
  await connectDB()
  const docs = await BlogPostModel.find({})
    .sort({ publishedDate: -1 })
    .limit(limit)
    .populate('coverImage')
    .populate('relatedRooms')
    .populate('relatedExperiences')
    .lean()

  return serializeDocs<BlogPost>(docs)
})

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  await connectDB()
  const doc = await BlogPostModel.findOne({ slug })
    .populate('coverImage')
    .populate({
      path: 'relatedRooms',
      populate: { path: 'gallery.image' },
    })
    .populate('relatedExperiences')
    .lean()

  return serializeDoc<BlogPost>(doc) ?? null
})

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  await connectDB()
  const docs = await TestimonialModel.find({}).limit(20).lean()
  return serializeDocs<Testimonial>(docs)
})

export const getFAQs = cache(async (): Promise<Faq[]> => {
  await connectDB()
  const docs = await FaqModel.find({}).sort({ order: 1 }).limit(50).lean()
  return serializeDocs<Faq>(docs)
})

export const getGalleryImages = cache(async (): Promise<GalleryImage[]> => {
  await connectDB()
  const docs = await GalleryImageModel.find({})
    .sort({ order: 1 })
    .limit(200)
    .populate('image')
    .lean()

  return serializeDocs<GalleryImage>(docs)
})
