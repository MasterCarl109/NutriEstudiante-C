import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { login as apiLogin, register as apiRegister, fetchMe, logout as apiLogout, type User } from '../services/auth'
import { sessionPartStore, clearLegacyToken } from '../services/token'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clearLegacyToken()
    fetchMe()
      .then(setUser)
      .catch(() => {
        sessionPartStore.clear()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    setUser(await apiLogin(email, password))
  }

  const register = async (name: string, email: string, password: string) => {
    setUser(await apiRegister(name, email, password))
  }

  const logout = () => {
    apiLogout().catch(() => {})
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return ctx
}
