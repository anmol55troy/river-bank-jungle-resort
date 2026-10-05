import { redirect } from 'next/navigation'
import { getSessionUser } from './session'
import type { User } from '../types'

export async function getCurrentUser(): Promise<User | null> {
  return getSessionUser()
}

export async function requireAdmin(): Promise<User> {
  const user = await getSessionUser()

  if (!user) {
    redirect('/admin/login')
  }

  return user
}
