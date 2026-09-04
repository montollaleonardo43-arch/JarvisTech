import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

function isTokenExpired(token: string): boolean {
  try {
    const part = token.split('.')[1]
    if (!part) return true
    const payload = JSON.parse(atob(part))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

function handleUnauthorized() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  onUnauthorized?.()
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/admin/login'
  }
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    if (isTokenExpired(token)) {
      handleUnauthorized()
      return Promise.reject(new Error('Token expirado'))
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorized()
    }
    return Promise.reject(error)
  }
)

export default api
