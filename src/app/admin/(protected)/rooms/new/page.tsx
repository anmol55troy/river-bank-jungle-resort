import React from 'react'
import Link from 'next/link'
import { RoomForm } from '../RoomForm'
import { getAllAmenities } from '@/lib/services/amenities'

export const dynamic = 'force-dynamic'

export default async function NewRoomPage() {
  const amenities = await getAllAmenities()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-espresso/60">
        <Link href="/admin/rooms" className="hover:text-espresso">
          Rooms & Suites
        </Link>
        <span>/</span>
        <span className="text-espresso font-medium">New Room</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-light text-espresso">Add New Room</h1>
      </div>

      <RoomForm amenitiesList={amenities} />
    </div>
  )
}
