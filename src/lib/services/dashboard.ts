'use server'

import { connectDB } from '../db/connect'
import {
  AmenityModel,
  BlogPostModel,
  DiningVenueModel,
  ExperienceModel,
  FaqModel,
  FormSubmissionModel,
  GalleryImageModel,
  MediaModel,
  NewsletterSignupModel,
  OfferModel,
  RoomModel,
  TestimonialModel,
  UserModel,
} from '../db/models'
import { serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import type { FormSubmission } from '../types'

export interface DashboardStats {
  roomsCount: number
  diningCount: number
  experiencesCount: number
  offersCount: number
  activeOffersCount: number
  blogsCount: number
  galleryCount: number
  testimonialsCount: number
  faqsCount: number
  amenitiesCount: number
  mediaCount: number
  submissionsCount: number
  newsletterCount: number
  usersCount: number
  recentSubmissions: FormSubmission[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin()
  await connectDB()

  const [
    roomsCount,
    diningCount,
    experiencesCount,
    offersCount,
    activeOffersCount,
    blogsCount,
    galleryCount,
    testimonialsCount,
    faqsCount,
    amenitiesCount,
    mediaCount,
    submissionsCount,
    newsletterCount,
    usersCount,
    recentSubmissionsDocs,
  ] = await Promise.all([
    RoomModel.countDocuments(),
    DiningVenueModel.countDocuments(),
    ExperienceModel.countDocuments(),
    OfferModel.countDocuments(),
    OfferModel.countDocuments({ active: true }),
    BlogPostModel.countDocuments(),
    GalleryImageModel.countDocuments(),
    TestimonialModel.countDocuments(),
    FaqModel.countDocuments(),
    AmenityModel.countDocuments(),
    MediaModel.countDocuments(),
    FormSubmissionModel.countDocuments(),
    NewsletterSignupModel.countDocuments(),
    UserModel.countDocuments(),
    FormSubmissionModel.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])

  return {
    roomsCount,
    diningCount,
    experiencesCount,
    offersCount,
    activeOffersCount,
    blogsCount,
    galleryCount,
    testimonialsCount,
    faqsCount,
    amenitiesCount,
    mediaCount,
    submissionsCount,
    newsletterCount,
    usersCount,
    recentSubmissions: serializeDocs<FormSubmission>(recentSubmissionsDocs),
  }
}
