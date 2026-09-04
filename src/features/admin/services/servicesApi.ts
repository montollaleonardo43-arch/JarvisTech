import api from '@/shared/services/api'
import type { PaginatedResponse, Service } from '@/shared/types'

export const servicesApi = {
  getAll(page = 0, size = 20) {
    return api.get<PaginatedResponse<Service>>('/services', { params: { page, size } })
  },

  getById(id: number) {
    return api.get<Service>(`/services/${id}`)
  },

  create(data: Record<string, unknown>) {
    return api.post('/services', data)
  },

  update(id: number, data: Record<string, unknown>) {
    return api.put(`/services/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/services/${id}`)
  },
}
