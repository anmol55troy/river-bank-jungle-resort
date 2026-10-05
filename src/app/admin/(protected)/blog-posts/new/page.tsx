import React from 'react'
import Link from 'next/link'
import { BlogPostForm } from '../BlogPostForm'
import { getRooms, getExperiences } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function NewBlogPostPage() {
  const [rooms, experiences] = await Promise.all([
    getRooms(),
    getExperiences(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-espresso/60">
        <Link href="/admin/blog-posts" className="hover:text-espresso">
          Blog Posts
        </Link>
        <span>/</span>
        <span className="text-espresso font-medium">New Post</span>
      </div>

      <h1 className="font-serif text-2xl font-light text-espresso">Write New Article</h1>
      <BlogPostForm roomsList={rooms} experiencesList={experiences} />
    </div>
  )
}
