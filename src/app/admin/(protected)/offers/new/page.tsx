import React from 'react'
import Link from 'next/link'
import { OfferForm } from '../OfferForm'

export const dynamic = 'force-dynamic'

export default function NewOfferPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-espresso/60">
        <Link href="/admin/offers" className="hover:text-espresso">
          Offers
        </Link>
        <span>/</span>
        <span className="text-espresso font-medium">New Offer</span>
      </div>

      <h1 className="font-serif text-2xl font-light text-espresso">Add New Special Offer</h1>
      <OfferForm />
    </div>
  )
}
