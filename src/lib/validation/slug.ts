export function formatSlug(val: string): string {
  return val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function generateSlug(slugOrTitle: string, fallback?: string): string {
  if (slugOrTitle && slugOrTitle.trim().length > 0) {
    return formatSlug(slugOrTitle)
  }
  if (fallback && fallback.trim().length > 0) {
    return formatSlug(fallback)
  }
  return ''
}
