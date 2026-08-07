const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

const IMAGE_PATH_RE = /^\/uploads\/[A-Za-z0-9._-]+\.(jpg|jpeg|png|webp|gif)$/

export function isValidImagePath(value: string): boolean {
  return IMAGE_PATH_RE.test(value)
}

export function imageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (!isValidImagePath(path)) return null
  return `${API_BASE}${path}`
}
