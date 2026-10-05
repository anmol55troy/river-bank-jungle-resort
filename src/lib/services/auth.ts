'use server'

import { redirect } from 'next/navigation'
import { connectDB } from '../db/connect'
import { UserModel } from '../db/models'
import { verifyPassword, hashPassword } from '../auth/password'
import { createSession, destroySession, getSessionUser } from '../auth/session'

export type AuthState = {
  success?: boolean
  error?: string
}

export async function loginAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')

  if (!email || !password) {
    return { error: 'Please enter both email and password.' }
  }

  await connectDB()
  const user = await UserModel.findOne({ email })

  if (!user) {
    return { error: 'Invalid email or password.' }
  }

  // Check lockout
  if (user.lockUntil && user.lockUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / (60 * 1000))
    return { error: `Account locked due to too many failed attempts. Try again in ${minutesLeft} minutes.` }
  }

  const { valid, needsUpgrade } = await verifyPassword(password, {
    passwordHash: user.passwordHash,
    hash: user.hash,
    salt: user.salt,
  })

  if (!valid) {
    const attempts = (user.loginAttempts || 0) + 1
    const updates: Record<string, any> = { loginAttempts: attempts }

    if (attempts >= 5) {
      updates.lockUntil = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes lock
    }

    await UserModel.findByIdAndUpdate(user._id, updates)
    return { error: 'Invalid email or password.' }
  }

  // Reset login attempts on success
  const successUpdates: Record<string, any> = {
    loginAttempts: 0,
    lockUntil: null,
  }

  // Upgrade legacy PBKDF2 hash to scrypt transparently
  if (needsUpgrade) {
    const newScrypt = await hashPassword(password)
    successUpdates.passwordHash = newScrypt
    successUpdates.$unset = { hash: 1, salt: 1 }
  }

  await UserModel.findByIdAndUpdate(user._id, successUpdates)

  // Create session and set cookie
  await createSession(user._id.toString())

  redirect('/admin')
}

export async function logoutAction(): Promise<void> {
  await destroySession()
  redirect('/admin/login')
}

export async function updateOwnPasswordAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const currentUser = await getSessionUser()
  if (!currentUser) {
    return { error: 'Not authenticated.' }
  }

  const currentPassword = String(formData.get('currentPassword') || '')
  const newPassword = String(formData.get('newPassword') || '')
  const confirmPassword = String(formData.get('confirmPassword') || '')

  if (!currentPassword || !newPassword) {
    return { error: 'Please fill in all password fields.' }
  }

  if (newPassword.length < 8) {
    return { error: 'New password must be at least 8 characters long.' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match.' }
  }

  await connectDB()
  const user = await UserModel.findById(currentUser.id)
  if (!user) {
    return { error: 'User not found.' }
  }

  const { valid } = await verifyPassword(currentPassword, {
    passwordHash: user.passwordHash,
    hash: user.hash,
    salt: user.salt,
  })

  if (!valid) {
    return { error: 'Current password is incorrect.' }
  }

  const newHash = await hashPassword(newPassword)
  await UserModel.findByIdAndUpdate(user._id, {
    passwordHash: newHash,
    $unset: { hash: 1, salt: 1 },
  })

  return { success: true }
}
