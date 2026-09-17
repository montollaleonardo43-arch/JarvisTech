import { NextRequest } from 'next/server'
import { apiOk, withApi } from '@/lib/http'
import { requireAuth } from '@/lib/auth'
import * as imageService from '@/services/images'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const PUT = withApi(
  async (request: NextRequest, ctx: { params: Promise<{ imageId: string }> }) => {
    await requireAuth(request)
    const { imageId } = await ctx.params
    await imageService.setPrimary(Number(imageId))
    return apiOk('Imagen principal actualizada', null)
  },
)