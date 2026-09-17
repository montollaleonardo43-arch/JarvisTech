import { NextRequest } from 'next/server'
import { jsonOk, apiOk, withApi } from '@/lib/http'
import { validate, categoryRequest } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import * as categoryService from '@/services/categories'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (_request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params
  const category = await categoryService.findById(Number(id))
  return jsonOk(category)
})

export const PUT = withApi(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  await requireAuth(request)
  const { id } = await ctx.params
  const input = validate(categoryRequest, await request.json())
  const result = await categoryService.update(Number(id), input)
  return apiOk('Categoria actualizada exitosamente', result)
})

export const DELETE = withApi(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  await requireAuth(request)
  const { id } = await ctx.params
  await categoryService.deactivate(Number(id))
  return apiOk('Categoria desactivada exitosamente', null)
})