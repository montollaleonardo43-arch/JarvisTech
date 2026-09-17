import { NextRequest } from 'next/server'
import { jsonOk, withApi } from '@/lib/http'
import { parsePageable } from '@/lib/pagination'
import * as productService from '@/services/products'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (request: NextRequest) => {
  const pageable = parsePageable(new URL(request.url), 8)
  const page = await productService.findFeatured(pageable)
  return jsonOk(page)
})