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
  token: string
  user: User
}

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

const TOKEN_KEY = 'nutriestudiante_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(tokenStore.get() && { Authorization: `Bearer ${tokenStore.get()}` }),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Error ${res.status}`)
  }

  return res.json() as Promise<T>
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
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
