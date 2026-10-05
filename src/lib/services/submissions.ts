'use server'

import { connectDB } from '../db/connect'
import { FormSubmissionModel, NewsletterSignupModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import type { FormSubmission, NewsletterSignup } from '../types'

export async function getAdminSubmissions(options?: {
  formType?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: FormSubmission[]; total: number; totalPages: number }> {
  await requireAdmin()
  await connectDB()

  const page = Math.max(1, options?.page || 1)
  const limit = Math.max(1, Math.min(100, options?.limit || 20))
  const skip = (page - 1) * limit

  const query: Record<string, any> = {}
  if (options?.formType && options.formType !== 'all') {
    query.formType = options.formType
  }
  if (options?.search && options.search.trim()) {
    const s = options.search.trim()
    query.$or = [
      { name: { $regex: s, $options: 'i' } },
      { email: { $regex: s, $options: 'i' } },
      { subject: { $regex: s, $options: 'i' } },
    ]
  }

  const [docs, total] = await Promise.all([
    FormSubmissionModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    FormSubmissionModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<FormSubmission>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getAdminSubmissionById(id: string): Promise<FormSubmission | null> {
  await requireAdmin()
  await connectDB()
  const doc = await FormSubmissionModel.findById(id).lean()
  return serializeDoc<FormSubmission>(doc) ?? null
}

export async function deleteSubmission(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()
  try {
    await FormSubmissionModel.findByIdAndDelete(id)
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete submission.' }
  }
}

export async function getAdminNewsletterSignups(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: NewsletterSignup[]; total: number; totalPages: number }> {
  await requireAdmin()
  await connectDB()

  const page = Math.max(1, options?.page || 1)
  const limit = Math.max(1, Math.min(100, options?.limit || 50))
  const skip = (page - 1) * limit

  const query: Record<string, any> = {}
  if (options?.search && options.search.trim()) {
    query.email = { $regex: options.search.trim(), $options: 'i' }
  }

  const [docs, total] = await Promise.all([
    NewsletterSignupModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    NewsletterSignupModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<NewsletterSignup>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function deleteNewsletterSignup(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()
  try {
    await NewsletterSignupModel.findByIdAndDelete(id)
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete signup.' }
  }
}
