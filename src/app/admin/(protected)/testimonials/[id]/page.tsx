import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TestimonialForm } from '../TestimonialForm'
import { getAdminTestimonialById } from '@/lib/services/testimonials'

export const dynamic = 'force-dynamic'

export default async function EditTestimonialPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const testimonial = await getAdminTestimonialById(id)

  if (!testimonial) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-espresso/60">
        <Link href="/admin/testimonials" className="hover:text-espresso">
          Guest Reviews
        </Link>
        <span>/</span>
        <span className="text-espresso font-medium">{testimonial.guestName}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-espresso">Edit Review</h1>
          <p className="text-xs text-espresso/60 mt-0.5 font-mono">ID: {testimonial.id}</p>
        </div>
      </div>

      <TestimonialForm testimonial={testimonial} />
    </div>
  )
}
