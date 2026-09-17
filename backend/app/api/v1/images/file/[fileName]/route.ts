import { NextRequest } from 'next/server'
import { withApi } from '@/lib/http'
import * as imageService from '@/services/images'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (_request: NextRequest, ctx: { params: Promise<{ fileName: string }> }) => {
  const { fileName } = await ctx.params
  return imageService.serve(fileName)
})