export interface WeightRecord {
  _id: string
  weight: number
  date: string
  createdAt: string
}

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('nutriestudiante_token')
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Error ${res.status}`)
  }

  return res.json() as Promise<T>
}

export async function fetchRecords(): Promise<WeightRecord[]> {
  const res = await request<{ records: WeightRecord[] }>('/tracking')
  return res.records
}

export async function createRecord(
  weight: number,
  date?: string,
): Promise<WeightRecord> {
  const res = await request<{ record: WeightRecord }>('/tracking', {
    method: 'POST',
    body: JSON.stringify({ weight, date }),
  })
  return res.record
}

export async function deleteRecord(id: string): Promise<void> {
  await request<{ message: string }>(`/tracking/${id}`, { method: 'DELETE' })
}
