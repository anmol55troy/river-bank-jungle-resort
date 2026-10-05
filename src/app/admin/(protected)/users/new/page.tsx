import React from 'react'
import Link from 'next/link'
import { UserForm } from '../UserForm'

export const dynamic = 'force-dynamic'

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-espresso/60">
        <Link href="/admin/users" className="hover:text-espresso">
          Administrators
        </Link>
        <span>/</span>
        <span className="text-espresso font-medium">New Administrator</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-light text-espresso">Add Administrator</h1>
      </div>

      <UserForm />
    </div>
  )
}
