import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'
import type { UserSummary } from '../types'
import { authService } from '../services/authService'
import { setUnauthorizedHandler } from '@/shared/services/api'

interface AuthContextType {
  user: UserSummary | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<UserSummary>
  register: (name: string, email: string, password: string) => Promise<UserSummary>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = authService.getToken()
    const storedUser = authService.getUser()

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    const response = await authService.login({ email, password, rememberMe })
    setToken(response.token)
    setUser(response.user)
    return response.user
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await authService.register({ name, email, password })
    setToken(response.token)
    setUser(response.user)
    return response.user
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [logout])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
