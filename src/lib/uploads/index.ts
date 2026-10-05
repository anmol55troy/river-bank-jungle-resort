import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { connectDB } from '../db/connect'
import { MediaModel } from '../db/models'
import { serializeDoc } from '../db/serialize'
import type { Media } from '../types'

const MEDIA_DIR = path.resolve(process.cwd(), 'public', 'media')

function ensureMediaDir(): void {
  if (!fs.existsSync(MEDIA_DIR)) {
    fs.mkdirSync(MEDIA_DIR, { recursive: true })
  }
}

function getUniqueFilename(originalName: string): string {
  ensureMediaDir()
  const ext = path.extname(originalName)
  const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_\-\s]/g, '').trim() || 'image'

  let filename = `${baseName}${ext}`
  let counter = 1

  while (fs.existsSync(path.join(MEDIA_DIR, filename))) {
    filename = `${baseName}-${counter}${ext}`
    counter++
  }

  return filename
}

export async function processAndSaveImage(
  buffer: Buffer,
  originalFilename: string,
  alt: string,
  caption?: string
): Promise<Media> {
  ensureMediaDir()
  await connectDB()

  const safeFilename = getUniqueFilename(originalFilename)
  const filePath = path.join(MEDIA_DIR, safeFilename)

  // Write original file
  fs.writeFileSync(filePath, buffer)

  // Inspect with sharp
  const image = sharp(buffer)
  const metadata = await image.metadata()

  const width = metadata.width || 0
  const height = metadata.height || 0
  const mimeType = metadata.format ? `image/${metadata.format}` : 'image/jpeg'
  const filesize = buffer.length

  const ext = path.extname(safeFilename)
  const base = path.basename(safeFilename, ext)

  // 1. Thumbnail (400w webp)
  const thumbWidth = Math.min(400, width || 400)
  const thumbBuffer = await sharp(buffer)
    .resize({ width: thumbWidth, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()
  const thumbMeta = await sharp(thumbBuffer).metadata()
  const thumbFilename = `${base}-${thumbMeta.width}x${thumbMeta.height}.webp`
  fs.writeFileSync(path.join(MEDIA_DIR, thumbFilename), thumbBuffer)

  // 2. Card (800w webp)
  const cardWidth = Math.min(800, width || 800)
  const cardBuffer = await sharp(buffer)
    .resize({ width: cardWidth, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer()
  const cardMeta = await sharp(cardBuffer).metadata()
  const cardFilename = `${base}-${cardMeta.width}x${cardMeta.height}.webp`
  fs.writeFileSync(path.join(MEDIA_DIR, cardFilename), cardBuffer)

  // 3. Hero (1920w webp)
  const heroWidth = Math.min(1920, width || 1920)
  const heroBuffer = await sharp(buffer)
    .resize({ width: heroWidth, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()
  const heroMeta = await sharp(heroBuffer).metadata()
  const heroFilename = `${base}-${heroMeta.width}x${heroMeta.height}.webp`
  fs.writeFileSync(path.join(MEDIA_DIR, heroFilename), heroBuffer)

  // 4. OG (1200x630 jpeg crop)
  const ogBuffer = await sharp(buffer)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 85 })
    .toBuffer()
  const ogFilename = `${base}-1200x630.jpg`
  fs.writeFileSync(path.join(MEDIA_DIR, ogFilename), ogBuffer)

  const doc = await MediaModel.create({
    alt,
    caption: caption || undefined,
    url: `/api/media/file/${encodeURIComponent(safeFilename)}`,
    thumbnailURL: `/api/media/file/${encodeURIComponent(thumbFilename)}`,
    filename: safeFilename,
    mimeType,
    filesize,
    width,
    height,
    focalX: 50,
    focalY: 50,
    sizes: {
      thumbnail: {
        url: `/api/media/file/${encodeURIComponent(thumbFilename)}`,
        width: thumbMeta.width,
        height: thumbMeta.height,
        mimeType: 'image/webp',
        filesize: thumbBuffer.length,
        filename: thumbFilename,
      },
      card: {
        url: `/api/media/file/${encodeURIComponent(cardFilename)}`,
        width: cardMeta.width,
        height: cardMeta.height,
        mimeType: 'image/webp',
        filesize: cardBuffer.length,
        filename: cardFilename,
      },
      hero: {
        url: `/api/media/file/${encodeURIComponent(heroFilename)}`,
        width: heroMeta.width,
        height: heroMeta.height,
        mimeType: 'image/webp',
        filesize: heroBuffer.length,
        filename: heroFilename,
      },
      og: {
        url: `/api/media/file/${encodeURIComponent(ogFilename)}`,
        width: 1200,
        height: 630,
        mimeType: 'image/jpeg',
        filesize: ogBuffer.length,
        filename: ogFilename,
      },
    },
  })

  return serializeDoc<Media>(doc)
}

export async function deleteMediaFiles(filename: string, sizes?: Record<string, { filename?: string | null }>): Promise<void> {
  const filesToDelete = [filename]

  if (sizes) {
    for (const size of Object.values(sizes)) {
      if (size?.filename) {
        filesToDelete.push(size.filename)
      }
    }
  }

  for (const f of filesToDelete) {
    try {
      const p = path.join(MEDIA_DIR, f)
      if (fs.existsSync(p)) {
        fs.unlinkSync(p)
      }
    } catch (err) {
      console.error(`Failed to delete media file ${f}:`, err)
    }
  }
}
