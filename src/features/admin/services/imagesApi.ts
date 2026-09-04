import api from '@/shared/services/api'
import type { ApiResponse, Image } from '@/shared/types'

export const imagesApi = {
  uploadProduct(productId: number, file: File, altText?: string, isPrimary = false) {
    const formData = new FormData()
    formData.append('file', file)
    if (altText) formData.append('altText', altText)
    formData.append('isPrimary', String(isPrimary))
    return api.post<ApiResponse<Image>>(`/images/product/${productId}`, formData)
  },

  uploadService(serviceId: number, file: File, altText?: string, isPrimary = false) {
    const formData = new FormData()
    formData.append('file', file)
    if (altText) formData.append('altText', altText)
    formData.append('isPrimary', String(isPrimary))
    return api.post<ApiResponse<Image>>(`/images/service/${serviceId}`, formData)
  },

  uploadPromotion(promotionId: number, file: File, altText?: string, isPrimary = false) {
    const formData = new FormData()
    formData.append('file', file)
    if (altText) formData.append('altText', altText)
    formData.append('isPrimary', String(isPrimary))
    return api.post<ApiResponse<Image>>(`/images/promotion/${promotionId}`, formData)
  },

  delete(imageId: number) {
    return api.delete(`/images/${imageId}`)
  },

  setPrimary(imageId: number) {
    return api.put(`/images/${imageId}/primary`)
  },
}
