const pad = (n: number): string => String(n).padStart(2, '0')

export function fmtDateTime(date: Date | null | undefined): string | null {
  if (!date) return null
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`
  )
}

export function fmtNow(): string {
  const now = new Date()
  return (
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  )
}

const ISO_LOCAL_DATE_TIME =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/

export function parseDateTime(value: string): Date {
  const match = ISO_LOCAL_DATE_TIME.exec(value)
  if (!match) {
    throw new Error(`Formato de fecha no valido: ${value}`)
  }
  const [, y, mo, d, h, mi, s] = match
  return new Date(
    Date.UTC(
      Number(y),
      Number(mo) - 1,
      Number(d),
      Number(h),
      Number(mi),
      Number(s ?? '0'),
    ),
  )
}