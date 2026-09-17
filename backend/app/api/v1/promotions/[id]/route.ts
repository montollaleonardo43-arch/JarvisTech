import { NextRequest } from 'next/server'
import { jsonOk, apiOk, withApi } from '@/lib/http'
import { validate, promotionRequest } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import * as promotionService from '@/services/promotions'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (_request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params
  const promotion = await promotionService.findById(Number(id))
  return jsonOk(promotion)
})

export const PUT = withApi(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  await requireAuth(request)
  const { id } = await ctx.params
  const input = validate(promotionRequest, await request.json())
  const result = await promotionService.update(Number(id), input)
  return apiOk('Promocion actualizada exitosamente', result)
})

export const DELETE = withApi(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  await requireAuth(request)
  const { id } = await ctx.params
  await promotionService.deactivate(Number(id))
  return apiOk('Promocion desactivada exitosamente', null)
})