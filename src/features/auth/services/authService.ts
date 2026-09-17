import api from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types'
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
    const response = data.data

    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.user))

    return response
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password })
  },

  async register(payload: RegisterRequest): Promise<LoginResponse> {
    const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/register', payload)
    const response = data.data

    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.user))

    return response
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  getUser(): import('../types').UserSummary | null {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },
}
