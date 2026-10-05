import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

const MEDIA_DIR = path.resolve(process.cwd(), 'public', 'media')

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await context.params
    if (!segments || segments.length === 0) {
      return new NextResponse('File Not Found', { status: 404 })
    }

    const safeFilename = path.normalize(segments.join('/')).replace(/^(\.\.[\/\\])+/, '')
    const filePath = path.resolve(MEDIA_DIR, safeFilename)

    // Ensure path traversal is blocked
    if (!filePath.startsWith(MEDIA_DIR)) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File Not Found', { status: 404 })
    }

    const stat = fs.statSync(filePath)
    if (!stat.isFile()) {
      return new NextResponse('File Not Found', { status: 404 })
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_MAP[ext] || 'application/octet-stream'

    const stream = fs.createReadStream(filePath)
    const readable = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk))
        stream.on('end', () => controller.close())
        stream.on('error', (err) => controller.error(err))
      },
      cancel() {
        stream.destroy()
      },
    })

    return new NextResponse(readable, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Last-Modified': stat.mtime.toUTCString(),
      },
    })
  } catch (error) {
    console.error('Error serving media file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
