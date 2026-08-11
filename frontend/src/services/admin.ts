import type { Recipe } from './recipes'
import type { Exercise } from './exercises'
import type { Tip } from './tips'
import { sessionHeaders } from './token'

export type RecipeInput = Omit<Recipe, '_id' | 'createdAt' | 'updatedAt'>
export type ExerciseInput = Omit<Exercise, '_id' | 'createdAt' | 'updatedAt'>
export type TipInput = Omit<Tip, '_id' | 'createdAt' | 'updatedAt'>

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...sessionHeaders(),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(data?.error ?? `Error ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function createRecipe(input: RecipeInput): Promise<{ recipe: Recipe }> {
  return request<{ recipe: Recipe }>('/admin/recipes', 'POST', input)
}

export function updateRecipe(id: string, input: RecipeInput): Promise<{ recipe: Recipe }> {
  return request<{ recipe: Recipe }>(`/admin/recipes/${id}`, 'PUT', input)
}

export function deleteRecipe(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/admin/recipes/${id}`, 'DELETE')
}

export function createExercise(input: ExerciseInput): Promise<{ exercise: Exercise }> {
  return request<{ exercise: Exercise }>('/admin/exercises', 'POST', input)
}

export function updateExercise(id: string, input: ExerciseInput): Promise<{ exercise: Exercise }> {
  return request<{ exercise: Exercise }>(`/admin/exercises/${id}`, 'PUT', input)
}

export function deleteExercise(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/admin/exercises/${id}`, 'DELETE')
}

export function createTip(input: TipInput): Promise<{ tip: Tip }> {
  return request<{ tip: Tip }>('/admin/tips', 'POST', input)
}

export function updateTip(id: string, input: TipInput): Promise<{ tip: Tip }> {
  return request<{ tip: Tip }>(`/admin/tips/${id}`, 'PUT', input)
}

export function deleteTip(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/admin/tips/${id}`, 'DELETE')
}
