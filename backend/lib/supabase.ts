import { createClient, SupabaseClient } from '@supabase/supabase-js'

const globalForStorage = globalThis as unknown as { supabase?: SupabaseClient }

export function getStorage(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error('Supabase Storage no configurado (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)')
  }
  if (!globalForStorage.supabase) {
    globalForStorage.supabase = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return globalForStorage.supabase
}

export function getBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET || 'jarvisecommerce-images'
}

export async function ensureBucket(): Promise<void> {
  const supabase = getStorage()
  const bucket = getBucket()
  const { error } = await supabase.storage.getBucket(bucket)
  const status = error ? String((error as { statusCode?: unknown }).statusCode) : ''
  if (error && (status === '404' || status === 'NoSuchBucket')) {
    await supabase.storage.createBucket(bucket, { public: true })
  }
}

export async function uploadFile(fileName: string, data: ArrayBuffer, contentType: string): Promise<void> {
  const supabase = getStorage()
  const bucket = getBucket()
  const { error } = await supabase.storage.from(bucket).upload(fileName, new Uint8Array(data), {
    contentType,
    upsert: true,
  })
  if (error) throw new Error(`Error al subir archivo: ${error.message}`)
}

export async function downloadFile(fileName: string): Promise<{ data: Uint8Array; contentType: string } | null> {
  const supabase = getStorage()
  const bucket = getBucket()
  const { data, error } = await supabase.storage.from(bucket).download(fileName)
  if (error) return null
  const contentType = data.type || 'application/octet-stream'
  const bytes = new Uint8Array(await data.arrayBuffer())
  return { data: bytes, contentType }
}

export async function deleteFile(fileName: string): Promise<void> {
  const supabase = getStorage()
  const bucket = getBucket()
  await supabase.storage.from(bucket).remove([fileName])
}