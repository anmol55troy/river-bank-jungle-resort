import React from 'react'
import Link from 'next/link'
import { TestimonialForm } from '../TestimonialForm'

export const dynamic = 'force-dynamic'

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-espresso/60">
        <Link href="/admin/testimonials" className="hover:text-espresso">
          Guest Reviews
        </Link>
        <span>/</span>
        <span className="text-espresso font-medium">New Review</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-light text-espresso">Add Guest Review</h1>
      </div>

      <TestimonialForm />
    </div>
  )
}
