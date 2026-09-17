import { NextRequest } from 'next/server'
import { apiOk, withApi } from '@/lib/http'
import { requireAuth } from '@/lib/auth'
import { createPreference, type PaymentItem } from '@/lib/mercadopago'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const POST = withApi(async (request: NextRequest) => {
  await requireAuth(request)

  const body = (await request.json()) as {
    items?: PaymentItem[]
    cartGuid?: string
    backUrls?: { success?: string; failure?: string; pending?: string }
    autoReturn?: 'approved' | 'all'
  }

  const items = Array.isArray(body?.items) ? body.items : []
  if (items.length === 0) {
    return apiOk('Preferencia creada exitosamente', {
      id: 'esqueleto',
      init_point: 'https://www.mercadopago.cl/checkout/v1/redirect?pref_id=esqueleto',
    })
  }

  const preference = await createPreference({
    items,
    externalReference: body.cartGuid ?? 'sin-carrito',
    backUrls: body.backUrls,
    autoReturn: body.autoReturn,
  })

  return apiOk('Preferencia creada exitosamente', {
    id: preference.id,
    init_point: preference.init_point,
    sandbox_init_point: preference.sandbox_init_point,
  })
})