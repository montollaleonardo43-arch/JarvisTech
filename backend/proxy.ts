import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://jarvistechnology.cl',
]

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
const ALLOWED_HEADERS = ['Authorization', 'Content-Type', 'X-Requested-With', 'X-Cart-Id']

export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin)

  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '))
      response.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS.join(', '))
      response.headers.set('Access-Control-Max-Age', '3600')
    }
    return response
  }

  const response = NextResponse.next()
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  return response
}

export const config = {
  matcher: '/api/:path*',
}