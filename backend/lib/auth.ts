import { NextRequest } from 'next/server'
import type { users, roles } from '@prisma/client'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/jwt'
import { notAuthenticated } from '@/lib/errors'

export type AuthUser = users & { roles: roles }

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null

  const token = authHeader.slice('Bearer '.length).trim()
  const email = await verifyToken(token)
  if (!email) return null

  const user = await prisma.users.findUnique({ where: { email }, include: { roles: true } })
  if (!user || !user.active) return null
  return user
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(request)
  if (!user) {
    throw notAuthenticated(new URL(request.url).pathname)
  }
  return user
}