import bcrypt from 'bcryptjs'
import { createHash, randomBytes } from 'node:crypto'
import { prisma } from '@/lib/db'
import { authenticationError, badRequest, conflict, invalidCredentials } from '@/lib/errors'
import { signToken } from '@/lib/jwt'
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from '@/lib/validators'
import type { AuthUser } from '@/lib/auth'

export interface LoginResult {
  token: string
  type: string
  expiresIn: number
  user: {
    id: number
    name: string
    email: string
    role: string
  }
}

function toUserSummary(user: AuthUser): LoginResult['user'] {
  return {
    id: Number(user.user_id),
    name: user.name,
    email: user.email,
    role: user.roles.name,
  }
}

async function ensureCustomerRole() {
  let role = await prisma.roles.findFirst({ where: { name: 'CUSTOMER' } })
  if (!role) {
    role = await prisma.roles.create({
      data: { name: 'CUSTOMER', description: 'Cliente de la tienda' },
    })
  }
  return role
}

async function buildUsername(email: string): Promise<string> {
  const base = email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, '')
    .slice(0, 40) || 'user'
  let username = base
  let suffix = 1
  while (await prisma.users.findUnique({ where: { username } })) {
    username = `${base}${suffix}`.slice(0, 50)
    suffix += 1
  }
  return username
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const user = await prisma.users.findUnique({ where: { email: input.email }, include: { roles: true } })
  if (!user) throw invalidCredentials()
  if (!user.active) throw authenticationError('User is disabled')

  const valid = await bcrypt.compare(input.password, user.password)
  if (!valid) throw invalidCredentials()

  const defaultExpiration = Number(process.env.JWT_EXPIRATION_MS ?? 3600000)
  const expiration = input.rememberMe ? 30 * 24 * 60 * 60 * 1000 : defaultExpiration
  const token = await signToken(user.email, expiration)

  await prisma.users.update({
    where: { user_id: user.user_id },
    data: { last_login: new Date() },
  })

  return {
    token,
    type: 'Bearer',
    expiresIn: expiration,
    user: toUserSummary(user),
  }
}

export async function register(input: RegisterInput): Promise<LoginResult> {
  const existing = await prisma.users.findUnique({ where: { email: input.email } })
  if (existing) throw conflict('Ya existe una cuenta con este email')

  const role = await ensureCustomerRole()
  const hashed = await bcrypt.hash(input.password, 10)
  const username = await buildUsername(input.email)

  const user = await prisma.users.create({
    data: {
      name: input.name,
      email: input.email,
      username,
      password: hashed,
      active: true,
      role_id: role.role_id,
      created_at: new Date(),
      updated_at: new Date(),
    },
    include: { roles: true },
  })

  const expiration = Number(process.env.JWT_EXPIRATION_MS ?? 3600000)
  const token = await signToken(user.email, expiration)

  await prisma.users.update({
    where: { user_id: user.user_id },
    data: { last_login: new Date() },
  })

  return {
    token,
    type: 'Bearer',
    expiresIn: expiration,
    user: toUserSummary(user),
  }
}

export function getMe(user: AuthUser): { user: LoginResult['user'] } {
  return { user: toUserSummary(user) }
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000

export async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  const user = await prisma.users.findUnique({ where: { email: input.email } })
  if (!user || !user.active) return

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS)

  await prisma.$executeRaw`
    INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, used, created_at)
    VALUES (${user.user_id}, ${hashToken(token)}, ${expiresAt}, false, ${new Date()})
  `

  const baseUrl = process.env.APP_URL ?? 'http://localhost:5173'
  const resetLink = `${baseUrl}/reset-password?token=${token}`
  console.log(`[password-reset] Enlace de recuperacion para ${user.email}: ${resetLink}`)
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const rows = await prisma.$queryRaw<Array<{ reset_token_id: bigint; user_id: bigint; expires_at: Date; used: boolean }>>`
    SELECT reset_token_id, user_id, expires_at, used
    FROM password_reset_tokens
    WHERE token_hash = ${hashToken(input.token)}
  `
  const record = rows[0]
  if (!record || record.used || record.expires_at.getTime() < Date.now()) {
    throw badRequest('El enlace de recuperacion es invalido o ha expirado')
  }

  const hashed = await bcrypt.hash(input.password, 10)
  await prisma.users.update({
    where: { user_id: record.user_id },
    data: { password: hashed, updated_at: new Date() },
  })
  await prisma.$executeRaw`
    UPDATE password_reset_tokens SET used = true WHERE reset_token_id = ${record.reset_token_id}
  `
}