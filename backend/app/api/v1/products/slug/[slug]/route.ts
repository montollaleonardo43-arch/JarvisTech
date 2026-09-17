import { NextRequest } from 'next/server'
import { jsonOk, withApi } from '@/lib/http'
import * as productService from '@/services/products'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (request: NextRequest, ctx: { params: Promise<{ slug: string }> }) => {
  const { slug } = await ctx.params
  const product = await productService.findBySlug(slug)
  return jsonOk(product)
})