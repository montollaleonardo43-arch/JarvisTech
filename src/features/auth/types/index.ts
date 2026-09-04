export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  type: string
  expiresIn: number
  user: UserSummary
}

export interface UserSummary {
  id: number
  name: string
  email: string
  role: string
}

export interface AuthState {
  user: UserSummary | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
