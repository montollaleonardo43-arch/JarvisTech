import { useState, useEffect } from 'react'
import api from '@/shared/services/api'
import type { BusinessSettings } from '@/shared/types'

let cachedSettings: BusinessSettings | null = null
let pendingPromise: Promise<BusinessSettings | null> | null = null

function fetchSettings(): Promise<BusinessSettings | null> {
  if (cachedSettings) return Promise.resolve(cachedSettings)
  if (pendingPromise) return pendingPromise

  pendingPromise = api
    .get<BusinessSettings>('/business-settings')
    .then(({ data }) => {
      cachedSettings = data
      return data
    })
    .catch(() => null)
    .finally(() => {
      pendingPromise = null
    })

  return pendingPromise
}

export function useBusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings | null>(cachedSettings)

  useEffect(() => {
    fetchSettings().then((data) => {
      if (data) setSettings(data)
    })
  }, [])

  return settings
}

export function getWhatsappUrl(settings: BusinessSettings | null, fallback = ''): string {
  const number = settings?.whatsapp
  if (number) {
    const clean = number.replace(/[^0-9]/g, '')
    return `https://wa.me/${clean}`
  }
  return fallback
}
