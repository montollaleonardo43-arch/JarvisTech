import { prisma } from '@/lib/db'

export interface SiteBenefit {
  title: string
  description: string
}

export interface BusinessSettingsResponseShape {
  id: number
  businessName: string | null
  slogan: string | null
  mission: string | null
  vision: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  weekdaySchedule: string | null
  saturdaySchedule: string | null
  sundaySchedule: string | null
  googleMaps: string | null
  instagram: string | null
  facebook: string | null
  tiktok: string | null
  youtube: string | null
  logoLight: string | null
  logoDark: string | null
  favicon: string | null
  heroImage: string | null
  heroDescription: string | null
  benefits: SiteBenefit[] | null
}

function normalizeBenefits(value: unknown): SiteBenefit[] | null {
  let list: unknown = value
  if (!Array.isArray(list) && list && typeof list === 'object' && Array.isArray((list as { value?: unknown }).value)) {
    list = (list as { value: unknown }).value
  }
  if (!Array.isArray(list)) return null
  return list
    .filter((b): b is { title: unknown; description: unknown } => !!b && typeof b === 'object')
    .map((b) => ({
      title: typeof b.title === 'string' ? b.title : '',
      description: typeof b.description === 'string' ? b.description : '',
    }))
}

function toResponse(settings: {
  business_settings_id: bigint
  business_name: string | null
  slogan: string | null
  mission: string | null
  vision: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  weekday_schedule: string | null
  saturday_schedule: string | null
  sunday_schedule: string | null
  google_maps: string | null
  instagram: string | null
  facebook: string | null
  tiktok: string | null
  youtube: string | null
  logo_light: string | null
  logo_dark: string | null
  favicon: string | null
  hero_image: string | null
  hero_description: string | null
  benefits: unknown
  updated_at: Date | null
}): BusinessSettingsResponseShape {
  return {
    id: Number(settings.business_settings_id),
    businessName: settings.business_name,
    slogan: settings.slogan,
    mission: settings.mission,
    vision: settings.vision,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    weekdaySchedule: settings.weekday_schedule,
    saturdaySchedule: settings.saturday_schedule,
    sundaySchedule: settings.sunday_schedule,
    googleMaps: settings.google_maps,
    instagram: settings.instagram,
    facebook: settings.facebook,
    tiktok: settings.tiktok,
    youtube: settings.youtube,
    logoLight: settings.logo_light,
    logoDark: settings.logo_dark,
    favicon: settings.favicon,
    heroImage: settings.hero_image,
    heroDescription: settings.hero_description,
    benefits: normalizeBenefits(settings.benefits),
  }
}

async function findOrCreateDefault() {
  const existing = await prisma.business_settings.findFirst({
    orderBy: { business_settings_id: 'asc' },
  })
  if (existing) return existing
  return prisma.business_settings.create({ data: { business_name: 'Jarvis Technology' } })
}

export async function getSettings(): Promise<BusinessSettingsResponseShape> {
  const settings = await findOrCreateDefault()
  return toResponse(settings)
}

export async function update(
  input: Partial<BusinessSettingsResponseShape>,
): Promise<BusinessSettingsResponseShape> {
  const settings = await findOrCreateDefault()

  const updated = await prisma.business_settings.update({
    where: { business_settings_id: settings.business_settings_id },
    data: {
      business_name: input.businessName ?? null,
      slogan: input.slogan ?? null,
      mission: input.mission ?? null,
      vision: input.vision ?? null,
      phone: input.phone ?? null,
      whatsapp: input.whatsapp ?? null,
      email: input.email ?? null,
      address: input.address ?? null,
      weekday_schedule: input.weekdaySchedule ?? null,
      saturday_schedule: input.saturdaySchedule ?? null,
      sunday_schedule: input.sundaySchedule ?? null,
      google_maps: input.googleMaps ?? null,
      instagram: input.instagram ?? null,
      facebook: input.facebook ?? null,
      tiktok: input.tiktok ?? null,
      youtube: input.youtube ?? null,
      logo_light: input.logoLight ?? null,
      logo_dark: input.logoDark ?? null,
      favicon: input.favicon ?? null,
      hero_image: input.heroImage ?? null,
      hero_description: input.heroDescription ?? null,
      benefits: normalizeBenefits(input.benefits ?? null) as never,
      updated_at: new Date(),
    },
  })
  return toResponse(updated)
}