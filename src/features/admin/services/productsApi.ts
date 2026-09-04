import api from '@/shared/services/api'
import type { PaginatedResponse, Product, ApiResponse } from '@/shared/types'

export const productsApi = {
  getAll(page = 0, size = 20) {
    return api.get<PaginatedResponse<Product>>('/products', { params: { page, size } })
  },

  getById(id: number) {
    return api.get<Product>(`/products/${id}`)
  },

  create(data: Record<string, unknown>) {
    return api.post<ApiResponse<Product>>('/products', data)
  },

  update(id: number, data: Record<string, unknown>) {
    return api.put<ApiResponse<Product>>(`/products/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/products/${id}`)
  },
}
