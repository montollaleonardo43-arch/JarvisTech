import { NextRequest } from 'next/server'
import { apiOk, withApi } from '@/lib/http'
import { validate, registerRequest } from '@/lib/validators'
import * as authService from '@/services/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const POST = withApi(async (request: NextRequest) => {
  const input = validate(registerRequest, await request.json())
  const result = await authService.register(input)
  return apiOk('Registro exitoso', result)
})