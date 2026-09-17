import api from '@/shared/services/api'
import type { PaginatedResponse, ServiceCategory } from '@/shared/types'

export const serviceCategoriesApi = {
  getAll(page = 0, size = 50) {
    return api.get<PaginatedResponse<ServiceCategory>>('/service-categories', { params: { page, size } })
  },

  create(data: Record<string, unknown>) {
    return api.post('/service-categories', data)
  },

  update(id: number, data: Record<string, unknown>) {
    return api.put(`/service-categories/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/service-categories/${id}`)
  },
}
