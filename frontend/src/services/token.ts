const PART_KEY = 'nse_aux'
const LEGACY_TOKEN_KEY = 'nutriestudiante_token'

export function clearLegacyToken(): void {
  localStorage.removeItem(LEGACY_TOKEN_KEY)
}

export const sessionPartStore = {
  get: () => sessionStorage.getItem(PART_KEY),
  set: (part: string) => sessionStorage.setItem(PART_KEY, part),
  clear: () => sessionStorage.removeItem(PART_KEY),
}

export function sessionHeaders(): Record<string, string> {
  const part = sessionPartStore.get()
  return part ? { 'X-Session-Part': part } : {}
}
