import { SignJWT, jwtVerify } from 'jose'

function getKey(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET no configurado')
  return Buffer.from(secret, 'base64')
}

const ALG = 'HS256'

export async function signToken(subject: string, expirationMillis: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  return new SignJWT()
    .setProtectedHeader({ alg: ALG })
    .setSubject(subject)
    .setIssuedAt(now)
    .setExpirationTime(now + Math.floor(expirationMillis / 1000))
    .sign(getKey())
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: [ALG] })
    return payload.sub ?? null
  } catch {
    return null
  }
}