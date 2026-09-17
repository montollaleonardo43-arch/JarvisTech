import { NextRequest } from 'next/server'
import { jsonOk, withApi } from '@/lib/http'
import { parsePageable } from '@/lib/pagination'
import * as productService from '@/services/products'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (request: NextRequest) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q') ?? ''
  const pageable = parsePageable(url, 20)
  const page = await productService.search(q, pageable)
  return jsonOk(page)
})