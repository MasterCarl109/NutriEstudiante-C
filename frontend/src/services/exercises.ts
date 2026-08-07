export type Goal = 'cardio' | 'fuerza' | 'movilidad' | 'resistencia' | 'equilibrio'

export interface Exercise {
  _id: string
  name: string
  description: string
  duration: string
  difficulty: 'baja' | 'media' | 'alta'
  goal: Goal
  instructions: string[]
  createdAt: string
  updatedAt: string
}

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string): Promise<T> {
  const token = localStorage.getItem('nutriestudiante_token')
  const res = await fetch(`${API_BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Error ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function fetchExercises(): Promise<Exercise[]> {
  const res = await request<{ exercises: Exercise[] }>('/exercises')
  return res.exercises
}

export async function fetchExercise(id: string): Promise<Exercise> {
  const res = await request<{ exercise: Exercise }>(`/exercises/${id}`)
  return res.exercise
}

export const DIFFICULTY_LABELS: Record<Exercise['difficulty'], string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
}

export const GOAL_LABELS: Record<Goal, string> = {
  cardio: 'Cardio',
  fuerza: 'Fuerza',
  movilidad: 'Movilidad',
  resistencia: 'Resistencia',
  equilibrio: 'Equilibrio',
}

export const GOALS: Goal[] = ['cardio', 'fuerza', 'movilidad', 'resistencia', 'equilibrio']
