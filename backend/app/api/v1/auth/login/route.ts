import { NextRequest } from 'next/server'
import { apiOk, withApi } from '@/lib/http'
import { validate, loginRequest } from '@/lib/validators'
import * as authService from '@/services/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const POST = withApi(async (request: NextRequest) => {
  const input = validate(loginRequest, await request.json())
  const result = await authService.login(input)
  return apiOk('Login exitoso', result)
})