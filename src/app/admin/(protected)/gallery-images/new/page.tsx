import React from 'react'
import Link from 'next/link'
import { GalleryImageForm } from '../GalleryImageForm'

export const dynamic = 'force-dynamic'

export default function NewGalleryImagePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-espresso/60">
        <Link href="/admin/gallery-images" className="hover:text-espresso">
          Gallery Images
        </Link>
        <span>/</span>
        <span className="text-espresso font-medium">Add Image</span>
      </div>

      <h1 className="font-serif text-2xl font-light text-espresso">Add Image to Gallery</h1>
      <GalleryImageForm />
    </div>
  )
}
