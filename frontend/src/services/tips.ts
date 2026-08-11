import { sessionHeaders } from './token'

export interface Tip {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: sessionHeaders(),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Error ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function fetchTips(): Promise<Tip[]> {
  const res = await request<{ tips: Tip[] }>('/tips')
  return res.tips
}
