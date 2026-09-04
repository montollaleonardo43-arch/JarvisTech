import api from '@/shared/services/api'
import type { PaginatedResponse, Promotion } from '@/shared/types'

export const promotionsApi = {
  getAll(page = 0, size = 20) {
    return api.get<PaginatedResponse<Promotion>>('/promotions', { params: { page, size } })
  },

  getById(id: number) {
    return api.get<Promotion>(`/promotions/${id}`)
  },

  create(data: Record<string, unknown>) {
    return api.post('/promotions', data)
  },

  update(id: number, data: Record<string, unknown>) {
    return api.put(`/promotions/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/promotions/${id}`)
  },
}
