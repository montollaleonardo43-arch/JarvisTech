import api from '@/shared/services/api'
import type { PaginatedResponse, Brand } from '@/shared/types'

export const brandsApi = {
  getAll(page = 0, size = 50) {
    return api.get<PaginatedResponse<Brand>>('/brands', { params: { page, size } })
  },

  create(data: { name: string; logo?: string }) {
    return api.post('/brands', data)
  },

  update(id: number, data: { name: string; logo?: string }) {
    return api.put(`/brands/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/brands/${id}`)
  },
}
