import api from '@/shared/services/api'
import type { ApiResponse, BusinessSettings } from '@/shared/types'

export const settingsApi = {
  get() {
    return api.get<BusinessSettings>('/business-settings')
  },

  update(data: Partial<BusinessSettings>) {
    return api.put('/business-settings', data)
  },

  uploadImage(field: 'logoLight' | 'heroImage', file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<ApiResponse<string>>(`/business-settings/upload/${field}`, formData)
  },
}
