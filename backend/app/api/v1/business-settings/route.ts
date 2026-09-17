import { NextRequest } from 'next/server'
import { jsonOk, apiOk, withApi } from '@/lib/http'
import { requireAuth } from '@/lib/auth'
import type { BusinessSettingsResponseShape } from '@/services/businessSettings'
import * as businessSettingsService from '@/services/businessSettings'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async () => {
  const settings = await businessSettingsService.getSettings()
  return jsonOk(settings)
})

export const PUT = withApi(async (request: NextRequest) => {
  await requireAuth(request)
  const body = (await request.json()) as Partial<BusinessSettingsResponseShape>
  const result = await businessSettingsService.update(body)
  return apiOk('Configuracion actualizada exitosamente', result)
})