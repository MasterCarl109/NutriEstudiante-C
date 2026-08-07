import type { BmiClassification } from '../utils/bmi'

export type RecipeCategory =
  | 'desayuno'
  | 'almuerzo'
  | 'cena'
  | 'snack'
  | 'batido'
  | 'postre'

export type BmiTarget = BmiClassification['id']

export interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Recipe {
  _id: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  nutrition?: Nutrition
  category: RecipeCategory
  suitableFor: BmiTarget[]
  image: string
  createdAt: string
  updatedAt: string
}

export const CATEGORY_LABELS: Record<RecipeCategory, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  cena: 'Cena',
  snack: 'Snack',
  batido: 'Batido',
  postre: 'Postre',
}

export const RECIPE_CATEGORIES: RecipeCategory[] = [
  'desayuno',
  'almuerzo',
  'cena',
  'snack',
  'batido',
  'postre',
]

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

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await request<{ recipes: Recipe[] }>('/recipes')
  return res.recipes
}

export async function fetchRecipe(id: string): Promise<Recipe> {
  const res = await request<{ recipe: Recipe }>(`/recipes/${id}`)
  return res.recipe
}
