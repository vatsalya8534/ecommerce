import "server-only"

import { categoryCatalog } from "@/lib/category-catalog"
import type { ProductEntry } from "@/lib/product-catalog"
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

type PublicProductWithCategory = Omit<ProductWithCategory, "category"> & {
  category: {
    name: string
    slug: string
  }
}

type PublicCategoryRecord = {
  slug: string
  name: string
}

const galleryBackgrounds = ["bg-white", "bg-[#f7f8fb]", "bg-[#eef2f7]"]
let catalogSeedPromise: Promise<void> | null = null

function formatPriceLabel(value: number) {
  return `$${value.toFixed(2)}`
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

function mapProductToPublicEntry(product: PublicProductWithCategory): ProductEntry {
  const brand = product.brand || product.sellerName || product.category.name
  const imageUrls = product.images.length
    ? product.images.map((image) => `/api/product-images/${image.id}`)
    : [product.imageSrc]
  const priceValue = product.price
  const originalPriceValue = product.compareAtPrice && product.compareAtPrice > priceValue ? product.compareAtPrice : Number((priceValue * 1.22).toFixed(2))
  const savingsValue = Math.max(0, Number((originalPriceValue - priceValue).toFixed(2)))
  const ratingSeed = Math.round(priceValue * 100) + product.name.length * 7 + product.category.name.length * 13
  const rating = Number((4 + (ratingSeed % 10) * 0.1).toFixed(1))
  const reviews = 48 + (ratingSeed % 320)
  const highlights = product.highlights.length
    ? product.highlights
    : [product.blurb ?? product.description ?? `Explore ${product.name.toLowerCase()} for everyday use.`]
  const specifications: ProductEntry["specifications"] = [
    { label: "Brand", value: brand },
    { label: "Category", value: product.category.name },
  ]

  if (product.sellerName) {
    specifications.push({ label: "Seller", value: product.sellerName })
  }

  if (product.sku) {
    specifications.push({ label: "SKU", value: product.sku })
  }

  if (product.weight !== null) {
    specifications.push({ label: "Weight", value: `${product.weight} kg` })
  }

  if (product.dimensions) {
    specifications.push({ label: "Dimensions", value: product.dimensions })
  }

  if (product.barcode) {
    specifications.push({ label: "Barcode", value: product.barcode })
  }

  specifications.push({ label: "Stock", value: product.stockStatus })

  return {
    id: product.id,
    name: product.name,
    priceValue,
    priceLabel: formatPriceLabel(priceValue),
    originalPriceValue,
    originalPriceLabel: formatPriceLabel(originalPriceValue),
    savingsLabel: `Save ${formatPriceLabel(savingsValue)}`,
    imageSrc: imageUrls[0],
    imageAlt: product.imageAlt || product.name,
    blurb: product.blurb || product.description || `Discover ${product.name}.`,
    description:
      product.description ||
      product.blurb ||
      `Built for shoppers looking for dependable ${product.category.name.toLowerCase()} picks, this ${product.name.toLowerCase()} balances value, presentation, and everyday usability.`,
    badge: product.badge || (product.isFeatured ? "Featured" : "New"),
    bgClassName: product.bgClassName || "bg-[#f7f8fb]",
    categorySlug: product.category.slug,
    categoryName: product.category.name,
    brand,
    rating,
    reviews,
    delivery: product.shippingDetails || "Ships within 24 hours",
    gallery: imageUrls.map((src, index) => ({
      src,
      alt: `${product.name} view ${index + 1}`,
      bgClassName: galleryBackgrounds[index % galleryBackgrounds.length],
    })),
    colors: product.colorOptions.length ? product.colorOptions : ["Standard"],
    sizes: product.sizeOptions.length ? product.sizeOptions : ["Standard"],
    highlights,
    specifications,
    shipping: {
      dispatch: "Ships within 24 hours",
      delivery: product.shippingDetails || "Delivery information available at checkout",
      returns: "7 day easy returns",
    },
    stockStatus: product.stockStatus,
    seller: product.sellerName || `${brand} Marketplace Store`,
    warranty: product.warranty || "Standard seller support",
    care: product.careInstructions || "Refer to product handling instructions after delivery.",
    inBox: product.images.length ? [product.name, "Order summary"] : [product.name],
  }
}

function mapCategoriesToPublicRecords(): PublicCategoryRecord[] {
  return categoryCatalog.map((category) => ({
    slug: category.slug,
    name: category.name,
  }))
}

async function ensurePublicCatalogSeeded() {
  if (!hasDatabaseUrl || !prisma) {
    return
  }

  if (!catalogSeedPromise) {
    catalogSeedPromise = ensureCatalogSeeded().catch((error) => {
      catalogSeedPromise = null
      throw error
    })
  }

  await catalogSeedPromise
}

export async function getPublicCategories(): Promise<PublicCategoryRecord[]> {
  if (!hasDatabaseUrl || !prisma) {
    return mapCategoriesToPublicRecords()
  }

  await ensurePublicCatalogSeeded()

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      slug: true,
      name: true,
    },
  })

  return categories
}

export async function getPublicProducts(): Promise<ProductEntry[]> {
  if (!hasDatabaseUrl || !prisma) {
    return []
  }

  await ensurePublicCatalogSeeded()

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      {
        isFeatured: "desc",
      },
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

  return products.map(mapProductToPublicEntry)
}

export async function getPublicProductById(id: string): Promise<ProductEntry | null> {
  if (!hasDatabaseUrl || !prisma) {
    return null
  }

  await ensurePublicCatalogSeeded()

  const product = await prisma.product.findFirst({
    where: {
      id,
      isActive: true,
    },
    include: {
      category: {
        select: {
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

  return product ? mapProductToPublicEntry(product) : null
}

export async function getPublicRelatedProducts(productId: string, categorySlug: string, limit = 4): Promise<ProductEntry[]> {
  const products = await getPublicProducts()
  return products.filter((product) => product.id !== productId && product.categorySlug === categorySlug).slice(0, limit)
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
