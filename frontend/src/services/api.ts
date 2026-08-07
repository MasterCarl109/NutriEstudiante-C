const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    throw new Error(`Error ${res.status} en ${path}`)
  }
  return res.json() as Promise<T>
}

export const api = { get }
