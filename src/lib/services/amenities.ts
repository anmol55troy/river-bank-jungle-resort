'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { AmenityModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import type { Amenity } from '../types'

export async function getAdminAmenities(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: Amenity[]; total: number; totalPages: number }> {
  await requireAdmin()
  await connectDB()

  const page = Math.max(1, options?.page || 1)
  const limit = Math.max(1, Math.min(100, options?.limit || 50))
  const skip = (page - 1) * limit

  const query: Record<string, any> = {}
  if (options?.search && options.search.trim()) {
    query.name = { $regex: options.search.trim(), $options: 'i' }
  }

  const [docs, total] = await Promise.all([
    AmenityModel.find(query).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    AmenityModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<Amenity>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getAllAmenities(): Promise<Amenity[]> {
  await connectDB()
  const docs = await AmenityModel.find({}).sort({ name: 1 }).lean()
  return serializeDocs<Amenity>(docs)
}

export async function saveAmenity(
  id: string | null,
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  await connectDB()

  const name = String(formData.get('name') || '').trim()
  if (!name) return { success: false, error: 'Amenity name is required.' }

  const existing = await AmenityModel.findOne({ name, ...(id ? { _id: { $ne: id } } : {}) })
  if (existing) {
    return { success: false, error: `An amenity named "${name}" already exists.` }
  }

  try {
    let savedId = id
    if (id) {
      await AmenityModel.findByIdAndUpdate(id, { name })
    } else {
      const created = await AmenityModel.create({ name })
      savedId = created._id.toString()
    }

    revalidatePath('/[locale]/rooms', 'page')
    return { success: true, id: savedId! }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save amenity.' }
  }
}

export async function deleteAmenity(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()
  try {
    await AmenityModel.findByIdAndDelete(id)
    revalidatePath('/[locale]/rooms', 'page')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete amenity.' }
  }
}
