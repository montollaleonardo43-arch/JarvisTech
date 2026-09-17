import api from '@/shared/services/api'
import type { Product, PaginatedResponse } from '@/shared/types'

export const storeApi = {
  getAll: (page = 0, size = 12) =>
    api.get<PaginatedResponse<Product>>('/products', { params: { page, size } }),

  getFeatured: (page = 0, size = 8) =>
    api.get<PaginatedResponse<Product>>('/products/featured', { params: { page, size } }),

  getBySlug: (slug: string) =>
    api.get<Product>(`/products/slug/${slug}`),

  search: (q: string, page = 0, size = 12) =>
    api.get<PaginatedResponse<Product>>('/products/search', { params: { q, page, size } }),
}
