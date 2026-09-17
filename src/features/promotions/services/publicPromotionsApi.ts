import api from '@/shared/services/api'
import type { Promotion, PaginatedResponse } from '@/shared/types'

export const promotionsApi = {
  getCurrent: (page = 0, size = 20) =>
    api.get<PaginatedResponse<Promotion>>('/promotions/current', { params: { page, size } }),
}
