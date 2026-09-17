import { prisma } from '@/lib/db'
import { badRequest, conflict, notFound } from '@/lib/errors'
import { buildSpringPage, type PageableDescriptor, toOrderBy } from '@/lib/pagination'
import { toBrandResponse, type BrandResponse } from '@/lib/resolvers'
import type { BrandInput } from '@/lib/validators'

async function productCounts(): Promise<Map<number, number>> {
  const groups = await prisma.products.groupBy({
    by: ['brand_id'],
    where: { active: true },
    _count: { _all: true },
  })
  return new Map(groups.map((g) => [Number(g.brand_id), g._count._all]))
}

export async function findAll(pageable: PageableDescriptor) {
  const [rows, total, counts] = await Promise.all([
    prisma.brands.findMany({
      where: { active: true },
      orderBy: toOrderBy('brands', pageable.orderBy),
      skip: pageable.page * pageable.size,
      take: pageable.size,
    }),
    prisma.brands.count({ where: { active: true } }),
    productCounts(),
  ])
  return buildSpringPage(
    rows.map((row) => toBrandResponse(row, counts.get(Number(row.brand_id)) ?? 0)),
    total,
    pageable.page,
    pageable.size,
    pageable.orderBy,
  )
}

export async function findById(id: number): Promise<BrandResponse> {
  const row = await prisma.brands.findUnique({ where: { brand_id: id } })
  if (!row || !row.active) throw notFound('Marca', id)
  const count = await prisma.products.count({ where: { active: true, brand_id: id } })
  return toBrandResponse(row, count)
}

export async function create(input: BrandInput): Promise<BrandResponse> {
  if ((await prisma.brands.count({ where: { name: input.name } })) > 0) {
    throw conflict(`Ya existe una marca con el nombre: ${input.name}`)
  }
  const now = new Date()
  const row = await prisma.brands.create({
    data: {
      name: input.name,
      logo: input.logo ?? null,
      active: true,
      created_at: now,
      updated_at: now,
    },
  })
  return toBrandResponse(row, 0)
}

export async function update(id: number, input: BrandInput): Promise<BrandResponse> {
  const existing = await prisma.brands.findUnique({ where: { brand_id: id } })
  if (!existing || !existing.active) throw notFound('Marca', id)

  if (existing.name !== input.name && (await prisma.brands.count({ where: { name: input.name } })) > 0) {
    throw conflict(`Ya existe una marca con el nombre: ${input.name}`)
  }

  const row = await prisma.brands.update({
    where: { brand_id: id },
    data: {
      name: input.name,
      logo: input.logo ?? null,
      updated_at: new Date(),
    },
  })
  const count = await prisma.products.count({ where: { active: true, brand_id: id } })
  return toBrandResponse(row, count)
}

export async function deactivate(id: number): Promise<void> {
  const existing = await prisma.brands.findUnique({ where: { brand_id: id } })
  if (!existing || !existing.active) throw notFound('Marca', id)

  const productCount = await prisma.products.count({ where: { active: true, brand_id: id } })
  if (productCount > 0) {
    throw badRequest(
      `No se puede desactivar la marca porque tiene ${productCount} productos asociados`,
    )
  }

  await prisma.brands.update({
    where: { brand_id: id },
    data: { active: false, updated_at: new Date() },
  })
}