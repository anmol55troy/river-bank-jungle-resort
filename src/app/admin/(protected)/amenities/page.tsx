import React from 'react'
import { AmenitiesClient } from './AmenitiesClient'
import { getAllAmenities } from '@/lib/services/amenities'

export const dynamic = 'force-dynamic'

export default async function AmenitiesPage() {
  const amenities = await getAllAmenities()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-espresso">Amenities</h1>
          <p className="text-xs text-espresso/60 mt-0.5">
            Features and facilities assigned across guest rooms and resort suites
          </p>
        </div>
      </div>

      <AmenitiesClient initialAmenities={amenities} total={amenities.length} />
    </div>
  )
}
