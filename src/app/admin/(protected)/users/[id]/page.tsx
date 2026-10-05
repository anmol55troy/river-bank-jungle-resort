import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { UserForm } from '../UserForm'
import { getAdminUserById } from '@/lib/services/users'
import { getCurrentUser } from '@/lib/auth/guard'

export const dynamic = 'force-dynamic'

export default async function EditUserPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const [user, currentUser] = await Promise.all([
    getAdminUserById(id),
    getCurrentUser(),
  ])

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-espresso/60">
        <Link href="/admin/users" className="hover:text-espresso">
          Administrators
        </Link>
        <span>/</span>
        <span className="text-espresso font-medium">{user.email}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-espresso">Edit Administrator</h1>
          <p className="text-xs text-espresso/60 mt-0.5 font-mono">ID: {user.id}</p>
        </div>
      </div>

      <UserForm user={user} currentUserId={currentUser?.id} />
    </div>
  )
}
