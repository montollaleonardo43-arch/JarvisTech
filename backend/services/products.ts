import { prisma } from '@/lib/db'
import { conflict, notFound } from '@/lib/errors'
import { buildSpringPage, type PageableDescriptor, toOrderBy } from '@/lib/pagination'
import { toProductResponse, type ProductResponse } from '@/lib/resolvers'
import { generateSlug } from '@/lib/slug'
import type { ProductInput } from '@/lib/validators'
import type { Prisma } from '@prisma/client'

const productInclude = {
  images: true,
  categories: true,
  brands: true,
} satisfies Prisma.productsInclude

const activeWhere: Prisma.productsWhereInput = { active: true }

async function paginate(
  where: Prisma.productsWhereInput,
  pageable: PageableDescriptor,
) {
  const [rows, total] = await prisma.$transaction([
    prisma.products.findMany({
      where,
      include: productInclude,
      skip: pageable.page * pageable.size,
      take: pageable.size,
      orderBy: toOrderBy('products', pageable.orderBy),
    }),
    prisma.products.count({ where }),
  ])
  return buildSpringPage(
    rows.map((row) => toProductResponse(row)),
    total,
    pageable.page,
    pageable.size,
    pageable.orderBy,
  )
}

export function findAll(pageable: PageableDescriptor): ReturnType<typeof paginate> {
  return paginate(activeWhere, pageable)
}

export function findFeatured(pageable: PageableDescriptor): ReturnType<typeof paginate> {
  return paginate({ ...activeWhere, featured: true }, pageable)
}

export function search(
  query: string,
  pageable: PageableDescriptor,
): ReturnType<typeof paginate> {
  return paginate(
    {
      ...activeWhere,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
      ],
    },
    pageable,
  )
}

export async function findById(id: number): Promise<ProductResponse> {
  const row = await prisma.products.findUnique({ where: { product_id: id }, include: productInclude })
  if (!row || !row.active) throw notFound('Producto', id)
  return toProductResponse(row)
}

export async function findBySlug(slug: string): Promise<ProductResponse> {
  const row = await prisma.products.findFirst({
    where: { ...activeWhere, slug },
    include: productInclude,
  })
  if (!row) throw notFound(`Producto con slug: ${slug}`)
  return toProductResponse(row)
}

export async function create(input: ProductInput): Promise<ProductResponse> {
  if ((await prisma.products.count({ where: { sku: input.sku } })) > 0) {
    throw conflict(`Ya existe un producto con el SKU: ${input.sku}`)
  }

  const category = await prisma.categories.findUnique({ where: { category_id: input.categoryId } })
  if (!category) throw notFound('Categoria', input.categoryId)

  const brand = await prisma.brands.findUnique({ where: { brand_id: input.brandId } })
  if (!brand) throw notFound('Marca', input.brandId)

  const baseSlug = generateSlug(input.name)
  let slug = baseSlug
  let counter = 1
  while ((await prisma.products.count({ where: { slug } })) > 0) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  const now = new Date()
  const product = await prisma.products.create({
    data: {
      name: input.name,
      sku: input.sku,
      slug,
      short_description: input.shortDescription ?? null,
      description: input.description ?? null,
      price: input.price,
      offer_price: input.offerPrice ?? null,
      stock: input.stock ?? 0,
      warranty: input.warranty ?? null,
      featured: input.featured ?? false,
      active: true,
      category_id: category.category_id,
      brand_id: brand.brand_id,
      created_at: now,
      updated_at: now,
    },
    include: productInclude,
  })
  return toProductResponse(product)
}

export async function update(id: number, input: ProductInput): Promise<ProductResponse> {
  const existing = await prisma.products.findUnique({ where: { product_id: id } })
  if (!existing || !existing.active) throw notFound('Producto', id)

  if (existing.sku !== input.sku && (await prisma.products.count({ where: { sku: input.sku } })) > 0) {
    throw conflict(`Ya existe un producto con el SKU: ${input.sku}`)
  }

  const category = await prisma.categories.findUnique({ where: { category_id: input.categoryId } })
  if (!category) throw notFound('Categoria', input.categoryId)

  const brand = await prisma.brands.findUnique({ where: { brand_id: input.brandId } })
  if (!brand) throw notFound('Marca', input.brandId)

  const product = await prisma.products.update({
    where: { product_id: id },
    data: {
      name: input.name,
      sku: input.sku,
      short_description: input.shortDescription ?? null,
      description: input.description ?? null,
      price: input.price,
      offer_price: input.offerPrice ?? null,
      stock: input.stock ?? existing.stock,
      warranty: input.warranty ?? null,
      featured: input.featured ?? existing.featured,
      category_id: category.category_id,
      brand_id: brand.brand_id,
      updated_at: new Date(),
    },
    include: productInclude,
  })
  return toProductResponse(product)
}

export async function deactivate(id: number): Promise<void> {
  const existing = await prisma.products.findUnique({ where: { product_id: id } })
  if (!existing || !existing.active) throw notFound('Producto', id)

  await prisma.products.update({
    where: { product_id: id },
    data: { active: false, deleted_at: new Date(), updated_at: new Date() },
  })
}