import { NextRequest } from 'next/server'
import { withApi } from '@/lib/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const POST = withApi(async (request: NextRequest) => {
  const body = await request.json().catch(() => null)
  const id = body?.data?.id ?? body?.id ?? null
  return new Response(JSON.stringify({ received: true, id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})