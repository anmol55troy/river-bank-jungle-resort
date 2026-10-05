import React from 'react'
import Link from 'next/link'
import { ExperienceForm } from '../ExperienceForm'

export const dynamic = 'force-dynamic'

export default function NewExperiencePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-espresso/60">
        <Link href="/admin/experiences" className="hover:text-espresso">
          Experiences
        </Link>
        <span>/</span>
        <span className="text-espresso font-medium">New Experience</span>
      </div>

      <h1 className="font-serif text-2xl font-light text-espresso">Add New Experience</h1>
      <ExperienceForm />
    </div>
  )
}
