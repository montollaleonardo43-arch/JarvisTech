import type { Prisma } from '@prisma/client'

export type ProductRow = Prisma.productsGetPayload<{
  include: { images: true; categories: true; brands: true }
}>

export type CategoryRow = Prisma.categoriesGetPayload<Record<never, never>>

export type BrandRow = Prisma.brandsGetPayload<Record<never, never>>

export type ServiceRow = Prisma.servicesGetPayload<{
  include: { images: true; service_categories: true }
}>

export type ServiceCategoryRow = Prisma.service_categoriesGetPayload<Record<never, never>>

export type PromotionRow = Prisma.promotionsGetPayload<{
  include: { images: true; product_promotions: true; service_promotions: true }
}>

export type ImageRow = Prisma.imagesGetPayload<Record<never, never>>

export type CartWithItems = Prisma.cartsGetPayload<{
  include: {
    cart_items: {
      include: {
        products: { include: { images: true; brands: true } }
      }
    }
  }
}>