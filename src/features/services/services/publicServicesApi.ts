import api from '@/shared/services/api'
import type { Service, PaginatedResponse } from '@/shared/types'

export const servicesApi = {
  getAll: (page = 0, size = 20) =>
    api.get<PaginatedResponse<Service>>('/services', { params: { page, size } }),

  getFeatured: (page = 0, size = 8) =>
    api.get<PaginatedResponse<Service>>('/services/featured', { params: { page, size } }),

  getById: (id: number) =>
    api.get<Service>(`/services/${id}`),

  search: (q: string, page = 0, size = 20) =>
    api.get<PaginatedResponse<Service>>('/services/search', { params: { q, page, size } }),
}

export default servicesApi