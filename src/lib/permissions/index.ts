import type { User } from '../types'

export type PermissionAction =
  | 'manage_users'
  | 'manage_settings'
  | 'manage_content'
  | 'manage_media'
  | 'view_submissions'
  | 'delete_submissions'

export function can(user: User | null | undefined, action: PermissionAction): boolean {
  if (!user) return false
  // For now all authenticated admin users have full permissions
  // This abstraction allows easily adding more granular roles in the future
  return user.role === 'admin' || !user.role
}

export function assertCan(user: User | null | undefined, action: PermissionAction): void {
  if (!can(user, action)) {
    throw new Error('Forbidden: You do not have permission to perform this action.')
  }
}
