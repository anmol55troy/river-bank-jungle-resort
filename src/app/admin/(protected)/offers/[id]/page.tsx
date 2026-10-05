import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { OfferForm } from '../OfferForm'
import { getAdminOfferById } from '@/lib/services/offers'

export const dynamic = 'force-dynamic'

export default async function EditOfferPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const offer = await getAdminOfferById(id)

  if (!offer) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-espresso/60">
        <Link href="/admin/offers" className="hover:text-espresso">
          Offers
        </Link>
        <span>/</span>
        <span className="text-espresso font-medium">{offer.title}</span>
      </div>

      <div>
        <h1 className="font-serif text-2xl font-light text-espresso">Edit Special Offer</h1>
        <p className="text-xs text-espresso/60 mt-0.5 font-mono">ID: {offer.id}</p>
      </div>

      <OfferForm offer={offer} />
    </div>
  )
}
