import "server-only"

import { categoryCatalog } from "@/lib/category-catalog"
import { hasDatabaseUrl, prisma } from "@/lib/prisma"

export type CategoryAdminRecord = {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  heroTitle: string | null
  heroBody: string | null
  imageSrc: string
  imageAlt: string | null
  accentClassName: string | null
  surfaceClassName: string | null
  chipLabel: string | null
  stats: string[]
  highlights: string[]
  createdAt: Date
  updatedAt: Date
  productCount: number
}

export type ProductAdminRecord = {
  id: string
  name: string
  slug: string | null
  sku: string | null
  brand: string | null
  sellerName: string | null
  price: number
  compareAtPrice: number | null
  taxRate: number | null
  stockQuantity: number
  minOrderQuantity: number
  maxOrderQuantity: number | null
  weight: number | null
  dimensions: string | null
  barcode: string | null
  imageCount: number
  imageSrc: string
  imageAlt: string | null
  imageUrls: string[]
  blurb: string | null
  description: string | null
  seoTitle: string | null
  seoDescription: string | null
  badge: string | null
  bgClassName: string | null
  stockStatus: string
  isFeatured: boolean
  isActive: boolean
  colorOptions: string[]
  sizeOptions: string[]
  materials: string[]
  tags: string[]
  highlights: string[]
  specifications: string[]
  shippingDetails: string | null
  careInstructions: string | null
  warranty: string | null
  createdAt: Date
  updatedAt: Date
  categoryId: string
  categoryName: string
  categorySlug: string
}

type CategoryWithCount = {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  heroTitle: string | null
  heroBody: string | null
  imageSrc: string
  imageAlt: string | null
  accentClassName: string | null
  surfaceClassName: string | null
  chipLabel: string | null
  stats: string[]
  highlights: string[]
  createdAt: Date
  updatedAt: Date
  _count: {
    products: number
  }
}

type ProductWithCategory = {
  id: string
  name: string
  slug: string | null
  sku: string | null
  brand: string | null
  sellerName: string | null
  price: number
  compareAtPrice: number | null
  taxRate: number | null
  stockQuantity: number
  minOrderQuantity: number
  maxOrderQuantity: number | null
  weight: number | null
  dimensions: string | null
  barcode: string | null
  imageSrc: string
  imageAlt: string | null
  blurb: string | null
  description: string | null
  seoTitle: string | null
  seoDescription: string | null
  badge: string | null
  bgClassName: string | null
  stockStatus: string
  isFeatured: boolean
  isActive: boolean
  colorOptions: string[]
  sizeOptions: string[]
  materials: string[]
  tags: string[]
  highlights: string[]
  specifications: string[]
  shippingDetails: string | null
  careInstructions: string | null
  warranty: string | null
  createdAt: Date
  updatedAt: Date
  category: {
    id: string
    name: string
    slug: string
  }
  images: {
    id: string
  }[]
}

function parsePrice(priceLabel: string) {
  const parsedPrice = Number(priceLabel.replace(/[^0-9.]/g, ""))
  return Number.isFinite(parsedPrice) ? parsedPrice : 0
}

function mapCategoryRecord(category: CategoryWithCount): CategoryAdminRecord {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    tagline: category.tagline,
    description: category.description,
    heroTitle: category.heroTitle,
    heroBody: category.heroBody,
    imageSrc: category.imageSrc,
    imageAlt: category.imageAlt,
    accentClassName: category.accentClassName,
    surfaceClassName: category.surfaceClassName,
    chipLabel: category.chipLabel,
    stats: category.stats,
    highlights: category.highlights,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    productCount: category._count.products,
  }
}

function mapProductRecord(product: ProductWithCategory): ProductAdminRecord {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    brand: product.brand,
    sellerName: product.sellerName,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    taxRate: product.taxRate ?? null,
    stockQuantity: product.stockQuantity,
    minOrderQuantity: product.minOrderQuantity,
    maxOrderQuantity: product.maxOrderQuantity ?? null,
    weight: product.weight ?? null,
    dimensions: product.dimensions,
    barcode: product.barcode,
    imageCount: product.images.length,
    imageSrc: product.images[0]
      ? `/api/product-images/${product.images[0].id}`
      : product.imageSrc,
    imageAlt: product.imageAlt,
    imageUrls: product.images.map((image) => `/api/product-images/${image.id}`),
    blurb: product.blurb,
    description: product.description,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    badge: product.badge,
    bgClassName: product.bgClassName,
    stockStatus: product.stockStatus,
    isFeatured: product.isFeatured ?? false,
    isActive: product.isActive ?? true,
    colorOptions: product.colorOptions ?? [],
    sizeOptions: product.sizeOptions ?? [],
    materials: product.materials ?? [],
    tags: product.tags ?? [],
    highlights: product.highlights ?? [],
    specifications: product.specifications ?? [],
    shippingDetails: product.shippingDetails ?? null,
    careInstructions: product.careInstructions ?? null,
    warranty: product.warranty ?? null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    categoryId: product.category.id,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
  }
}

export async function ensureCatalogSeeded() {
  if (!hasDatabaseUrl || !prisma) {
    return
  }

  const categoryCount = await prisma.category.count()

  if (categoryCount > 0) {
    return
  }

  for (const category of categoryCatalog) {
    await prisma.category.create({
      data: {
        slug: category.slug,
        name: category.name,
        tagline: category.tagline,
        description: category.description,
        heroTitle: category.heroTitle,
        heroBody: category.heroBody,
        imageSrc: category.imageSrc,
        imageAlt: category.imageAlt,
        accentClassName: category.accentClassName,
        surfaceClassName: category.surfaceClassName,
        chipLabel: category.chipLabel,
        stats: category.stats,
        highlights: category.highlights,
        products: {
          create: category.products.map((product, productIndex) => ({
            name: product.name,
            slug: `${category.slug}-${productIndex + 1}`,
            price: parsePrice(product.price),
            imageSrc: product.imageSrc,
            imageAlt: product.imageAlt,
            blurb: product.blurb,
            description: product.blurb,
            badge: product.badge,
            bgClassName: product.bgClassName,
            stockStatus: "In stock",
          })),
        },
      },
    })
  }
}

export async function getAdminCategories() {
  if (!hasDatabaseUrl || !prisma) {
    return [] satisfies CategoryAdminRecord[]
  }

  await ensureCatalogSeeded()

  const categories = await prisma.category.findMany({
    orderBy: [
      {
        name: "asc",
      },
    ],
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  })

  return categories.map(mapCategoryRecord)
}

export async function getAdminCategoryById(id: string) {
  if (!hasDatabaseUrl || !prisma) {
    return null
  }

  await ensureCatalogSeeded()

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  })

  return category ? mapCategoryRecord(category) : null
}

export async function getAdminProducts() {
  if (!hasDatabaseUrl || !prisma) {
    return [] satisfies ProductAdminRecord[]
  }

  await ensureCatalogSeeded()

  const products = await prisma.product.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        name: "asc",
      },
    ],
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
        images: {
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
          },
        },
    },
  })

  return products.map(mapProductRecord)
}

export async function getAdminProductById(id: string) {
  if (!hasDatabaseUrl || !prisma) {
    return null
  }

  await ensureCatalogSeeded()

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
        images: {
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
          },
        },
    },
  })

  return product ? mapProductRecord(product) : null
}
