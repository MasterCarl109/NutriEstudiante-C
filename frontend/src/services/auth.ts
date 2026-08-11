import { sessionPartStore, sessionHeaders } from './token'

export interface User {
  _id: string
  name: string
  email: string
  age?: number
  weight?: number
  height?: number
  sex?: 'male' | 'female' | 'other'
  role?: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  sessionPart: string
}

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...sessionHeaders(),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Error ${res.status}`)
  }

  return res.json() as Promise<T>
}

export async function login(email: string, password: string): Promise<User> {
  const res = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  sessionPartStore.set(res.sessionPart)
  return res.user
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const res = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  sessionPartStore.set(res.sessionPart)
  return res.user
}

export async function fetchMe(): Promise<User> {
  const res = await request<{ user: User }>('/auth/me')
  return res.user
}

export interface ProfileUpdate {
  name?: string
  age?: number | null
  weight?: number | null
  height?: number | null
  sex?: 'male' | 'female' | 'other' | null
}

export async function updateProfile(data: ProfileUpdate): Promise<User> {
  const res = await request<{ user: User }>('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return res.user
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<string> {
  const res = await request<{ message: string }>('/profile/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  return res.message
}

export async function logout(): Promise<void> {
  await request<{ message: string }>('/auth/logout', { method: 'POST' }).catch(
    () => {},
  )
  sessionPartStore.clear()
}
