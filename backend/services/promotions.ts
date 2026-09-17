import { prisma } from '@/lib/db'
import { badRequest, notFound } from '@/lib/errors'
import { buildSpringPage, type PageableDescriptor, toOrderBy } from '@/lib/pagination'
import { toPromotionResponse, type PromotionResponse } from '@/lib/resolvers'
import { parseDateTime } from '@/lib/format'
import type { PromotionInput } from '@/lib/validators'
import type { Prisma } from '@prisma/client'

const promotionInclude = {
  images: true,
  product_promotions: true,
  service_promotions: true,
} satisfies Prisma.promotionsInclude

const activeWhere: Prisma.promotionsWhereInput = { active: true }

async function paginate(where: Prisma.promotionsWhereInput, pageable: PageableDescriptor) {
  const [rows, total] = await prisma.$transaction([
    prisma.promotions.findMany({
      where,
      include: promotionInclude,
      skip: pageable.page * pageable.size,
      take: pageable.size,
      orderBy: toOrderBy('promotions', pageable.orderBy),
    }),
    prisma.promotions.count({ where }),
  ])
  return buildSpringPage(
    rows.map((row) => toPromotionResponse(row)),
    total,
    pageable.page,
    pageable.size,
    pageable.orderBy,
  )
}

export function findAll(pageable: PageableDescriptor) {
  return paginate(activeWhere, pageable)
}

export function findCurrent(pageable: PageableDescriptor) {
  return paginate({ ...activeWhere, end_date: { gte: new Date() } }, pageable)
}

export async function findById(id: number): Promise<PromotionResponse> {
  const row = await prisma.promotions.findUnique({ where: { promotion_id: id }, include: promotionInclude })
  if (!row || !row.active) throw notFound('Promocion', id)
  return toPromotionResponse(row)
}

export async function create(input: PromotionInput): Promise<PromotionResponse> {
  const startDate = parseDateTime(input.startDate)
  const endDate = parseDateTime(input.endDate)
  if (endDate.getTime() < startDate.getTime()) {
    throw badRequest('La fecha de fin debe ser posterior a la fecha de inicio')
  }

  const [existingProducts, existingServices] = await Promise.all([
    input.productIds?.length
      ? prisma.products.findMany({
          where: { product_id: { in: [...new Set(input.productIds)] } },
          select: { product_id: true },
        })
      : [],
    input.serviceIds?.length
      ? prisma.services.findMany({
          where: { service_id: { in: [...new Set(input.serviceIds)] } },
          select: { service_id: true },
        })
      : [],
  ])

  const now = new Date()
  const promotion = await prisma.promotions.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      promotion_type: input.promotionType ?? null,
      start_date: startDate,
      end_date: endDate,
      active: true,
      product_promotions: {
        create: existingProducts.map((product) => ({ product_id: product.product_id })),
      },
      service_promotions: {
        create: existingServices.map((service) => ({ service_id: service.service_id })),
      },
      created_at: now,
      updated_at: now,
    },
    include: promotionInclude,
  })
  return toPromotionResponse(promotion)
}

export async function update(id: number, input: PromotionInput): Promise<PromotionResponse> {
  const existing = await prisma.promotions.findUnique({ where: { promotion_id: id } })
  if (!existing || !existing.active) throw notFound('Promocion', id)

  const startDate = parseDateTime(input.startDate)
  const endDate = parseDateTime(input.endDate)
  if (endDate.getTime() < startDate.getTime()) {
    throw badRequest('La fecha de fin debe ser posterior a la fecha de inicio')
  }

  const productIds = input.productIds === undefined ? null : [...new Set(input.productIds)]
  const serviceIds = input.serviceIds === undefined ? null : [...new Set(input.serviceIds)]

  const [existingProducts, existingServices] = await Promise.all([
    productIds?.length
      ? prisma.products.findMany({ where: { product_id: { in: productIds } }, select: { product_id: true } })
      : [],
    serviceIds?.length
      ? prisma.services.findMany({ where: { service_id: { in: serviceIds } }, select: { service_id: true } })
      : [],
  ])

  const promotion = await prisma.$transaction(async (tx) => {
    if (productIds !== null) {
      await tx.product_promotions.deleteMany({ where: { promotion_id: id } })
    }
    if (serviceIds !== null) {
      await tx.service_promotions.deleteMany({ where: { promotion_id: id } })
    }
    return tx.promotions.update({
      where: { promotion_id: id },
      data: {
        title: input.title,
        description: input.description ?? null,
        promotion_type: input.promotionType ?? null,
        start_date: startDate,
        end_date: endDate,
        updated_at: new Date(),
        product_promotions: {
          create:
            productIds === null
              ? undefined
              : existingProducts.map((product) => ({ product_id: product.product_id })),
        },
        service_promotions: {
          create:
            serviceIds === null
              ? undefined
              : existingServices.map((service) => ({ service_id: service.service_id })),
        },
      },
      include: promotionInclude,
    })
  })
  return toPromotionResponse(promotion)
}

export async function deactivate(id: number): Promise<void> {
  const existing = await prisma.promotions.findUnique({ where: { promotion_id: id } })
  if (!existing || !existing.active) throw notFound('Promocion', id)

  await prisma.promotions.update({
    where: { promotion_id: id },
    data: { active: false, updated_at: new Date() },
  })
}