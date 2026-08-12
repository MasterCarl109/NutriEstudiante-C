const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

const IMAGE_PATH_RE = /^\/uploads\/[A-Za-z0-9._-]+\.(jpg|jpeg|png|webp|gif)$/

export function isValidImagePath(value: string): boolean {
  return IMAGE_PATH_RE.test(value)
}

function assetOrigin(): string {
  if (!API_BASE || API_BASE.startsWith('/')) return ''
  return API_BASE.replace(/\/+$/, '').replace(/\/api$/, '')
}

export function imageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (!isValidImagePath(path)) return null
  return `${assetOrigin()}${path}`
}
