export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  name: string
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
