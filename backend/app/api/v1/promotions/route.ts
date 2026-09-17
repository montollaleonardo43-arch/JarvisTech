import { NextRequest } from 'next/server'
import { jsonOk, apiOk, withApi } from '@/lib/http'
import { parsePageable } from '@/lib/pagination'
import { validate, promotionRequest } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import * as promotionService from '@/services/promotions'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (request: NextRequest) => {
  const pageable = parsePageable(new URL(request.url), 20)
  const page = await promotionService.findAll(pageable)
  return jsonOk(page)
})

export const POST = withApi(async (request: NextRequest) => {
  await requireAuth(request)
  const input = validate(promotionRequest, await request.json())
  const result = await promotionService.create(input)
  return apiOk('Promocion creada exitosamente', result, 201)
})