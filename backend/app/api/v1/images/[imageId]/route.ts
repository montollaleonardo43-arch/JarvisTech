import { NextRequest } from 'next/server'
import { apiOk, withApi } from '@/lib/http'
import { requireAdmin } from '@/lib/auth'
import * as imageService from '@/services/images'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const DELETE = withApi(async (request: NextRequest, ctx: { params: Promise<{ imageId: string }> }) => {
  await requireAdmin(request)
  const { imageId } = await ctx.params
  await imageService.deleteById(Number(imageId))
  return apiOk('Imagen eliminada exitosamente', null)
})
