import { NextRequest } from 'next/server'
import { jsonOk, apiOk, withApi } from '@/lib/http'
import { validate, serviceRequest } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import * as serviceService from '@/services/repairServices'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (_request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params
  const service = await serviceService.findById(Number(id))
  return jsonOk(service)
})

export const PUT = withApi(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  await requireAuth(request)
  const { id } = await ctx.params
  const input = validate(serviceRequest, await request.json())
  const result = await serviceService.update(Number(id), input)
  return apiOk('Servicio actualizado exitosamente', result)
})

export const DELETE = withApi(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  await requireAuth(request)
  const { id } = await ctx.params
  await serviceService.deactivate(Number(id))
  return apiOk('Servicio desactivado exitosamente', null)
})