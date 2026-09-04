import api from '@/shared/services/api'
import type { PaginatedResponse, Category } from '@/shared/types'

export const categoriesApi = {
  getAll(page = 0, size = 50) {
    return api.get<PaginatedResponse<Category>>('/categories', { params: { page, size } })
  },

  getById(id: number) {
    return api.get<Category>(`/categories/${id}`)
  },

  create(data: { name: string; description?: string; icon?: string }) {
    return api.post('/categories', data)
  },

  update(id: number, data: { name: string; description?: string; icon?: string }) {
    return api.put(`/categories/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/categories/${id}`)
  },
}
