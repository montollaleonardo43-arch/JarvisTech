import { MercadoPagoConfig, Preference } from 'mercadopago'
import { notImplemented } from '@/lib/errors'

export interface PaymentItem {
  id: string
  title: string
  description?: string
  quantity: number
  unit_price: number
  currency_id?: string
}

export interface CreatePreferenceOptions {
  items: PaymentItem[]
  externalReference: string
  backUrls?: { success?: string; failure?: string; pending?: string }
  autoReturn?: 'approved' | 'all'
}

let config: MercadoPagoConfig | null = null

export function getMercadoPagoConfig(): MercadoPagoConfig {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!token) {
    throw notImplemented('MercadoPago no configurado. Defina MERCADOPAGO_ACCESS_TOKEN.')
  }
  if (!config) {
    config = new MercadoPagoConfig({ accessToken: token })
  }
  return config
}

export async function createPreference(options: CreatePreferenceOptions) {
  const client = getMercadoPagoConfig()
  const preference = new Preference(client)
  return preference.create({
    body: {
      items: options.items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: item.currency_id ?? 'CLP',
      })),
      external_reference: options.externalReference,
      back_urls: options.backUrls,
      auto_return: options.autoReturn,
    },
  })
}