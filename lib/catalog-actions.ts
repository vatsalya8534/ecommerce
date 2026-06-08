"use server"

import { Buffer } from "node:buffer"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { hasDatabaseUrl, prisma } from "@/lib/prisma"
import { requireModulePermission } from "@/lib/rbac"

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function parseStringList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function parsePrice(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return NaN
  }

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : NaN
}

function parseInteger(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return NaN
  }

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) && Number.isInteger(parsed) ? parsed : NaN
}

function parseOptionalFloat(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : NaN
}

function parseOptionalInteger(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) && Number.isInteger(parsed) ? parsed : NaN
}

function parseBooleanField(formData: FormData, key: string) {
  const value = formData.get(key)
  return value === "on" || value === "true" || value === "1"
}

function revalidateCatalogPages() {
  revalidatePath("/admin/category")
  revalidatePath("/admin/category/new")
  revalidatePath("/admin/product")
  revalidatePath("/products")
}

async function getUploadedImages(formData: FormData) {
  const imageEntries = formData.getAll("images")
  const uploadedImages = imageEntries.filter(
    (entry): entry is File => entry instanceof File && entry.size > 0,
  )

  return Promise.all(
    uploadedImages.map(async (file, index) => ({
      filename: file.name || `image-${index + 1}`,
      mimeType: file.type || "application/octet-stream",
      data: Buffer.from(await file.arrayBuffer()),
      sortOrder: index,
    })),
  )
}

export async function createCategoryAction(formData: FormData) {
  await requireModulePermission("categories", "action")

  if (!hasDatabaseUrl || !prisma) {
    redirect("/admin/category/new?error=database")
  }

  const name = String(formData.get("name") ?? "").trim()
  const providedSlug = String(formData.get("slug") ?? "").trim()
  const slug = slugify(providedSlug || name)

  if (!name || !slug) {
    redirect("/admin/category/new?error=missing-fields")
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  })

  if (existingCategory) {
    redirect("/admin/category/new?error=slug-exists")
  }

  await prisma.category.create({
    data: {
      name,
      slug,
      tagline: String(formData.get("tagline") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      heroTitle: String(formData.get("heroTitle") ?? "").trim() || null,
      heroBody: String(formData.get("heroBody") ?? "").trim() || null,
      imageSrc: String(formData.get("imageSrc") ?? "").trim() || "/hero-home.svg",
      imageAlt: String(formData.get("imageAlt") ?? "").trim() || null,
      accentClassName: String(formData.get("accentClassName") ?? "").trim() || null,
      surfaceClassName: String(formData.get("surfaceClassName") ?? "").trim() || null,
      chipLabel: String(formData.get("chipLabel") ?? "").trim() || null,
      stats: parseStringList(String(formData.get("stats") ?? "")),
      highlights: parseStringList(String(formData.get("highlights") ?? "")),
    },
  })

  revalidateCatalogPages()
  redirect("/admin/category?created=1")
}

export async function updateCategoryAction(formData: FormData) {
  await requireModulePermission("categories", "action")

  if (!hasDatabaseUrl || !prisma) {
    redirect("/admin/category/new?error=database")
  }

  const id = String(formData.get("id") ?? "")
  const name = String(formData.get("name") ?? "").trim()
  const providedSlug = String(formData.get("slug") ?? "").trim()
  const slug = slugify(providedSlug || name)

  if (!id || !name || !slug) {
    redirect(`/admin/category/new?edit=${id}&error=missing-fields`)
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  })

  if (!existingCategory) {
    redirect(`/admin/category/new?edit=${id}&error=not-found`)
  }

  const duplicateSlug = await prisma.category.findFirst({
    where: {
      slug,
      NOT: {
        id,
      },
    },
    select: {
      id: true,
    },
  })

  if (duplicateSlug) {
    redirect(`/admin/category/new?edit=${id}&error=slug-exists`)
  }

  await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      slug,
      tagline: String(formData.get("tagline") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      heroTitle: String(formData.get("heroTitle") ?? "").trim() || null,
      heroBody: String(formData.get("heroBody") ?? "").trim() || null,
      imageSrc: String(formData.get("imageSrc") ?? "").trim() || "/hero-home.svg",
      imageAlt: String(formData.get("imageAlt") ?? "").trim() || null,
      accentClassName: String(formData.get("accentClassName") ?? "").trim() || null,
      surfaceClassName: String(formData.get("surfaceClassName") ?? "").trim() || null,
      chipLabel: String(formData.get("chipLabel") ?? "").trim() || null,
      stats: parseStringList(String(formData.get("stats") ?? "")),
      highlights: parseStringList(String(formData.get("highlights") ?? "")),
    },
  })

  revalidateCatalogPages()
  redirect("/admin/category?updated=1")
}

export async function deleteCategoryAction(formData: FormData) {
  await requireModulePermission("categories", "action")

  if (!hasDatabaseUrl || !prisma) {
    redirect("/admin/category?error=database")
  }

  const id = String(formData.get("id") ?? "")

  if (!id) {
    redirect("/admin/category?error=not-found")
  }

  await prisma.category.delete({
    where: {
      id,
    },
  })

  revalidateCatalogPages()
  redirect("/admin/category?deleted=1")
}

export async function createProductAction(formData: FormData) {
  await requireModulePermission("products", "action")

  if (!hasDatabaseUrl || !prisma) {
    redirect("/admin/product/new?error=database")
  }

  const categoryId = String(formData.get("categoryId") ?? "")
  const name = String(formData.get("name") ?? "").trim()
  const providedSlug = String(formData.get("slug") ?? "").trim()
  const slug = slugify(providedSlug || name)
  const sku = String(formData.get("sku") ?? "").trim()
  const brand = String(formData.get("brand") ?? "").trim()
  const sellerName = String(formData.get("sellerName") ?? "").trim()
  const price = parsePrice(String(formData.get("price") ?? ""))
  const compareAtPrice = parseOptionalFloat(String(formData.get("compareAtPrice") ?? ""))
  const taxRate = parseOptionalFloat(String(formData.get("taxRate") ?? ""))
  const stockQuantity = parseInteger(String(formData.get("stockQuantity") ?? ""))
  const minOrderQuantity = parseInteger(String(formData.get("minOrderQuantity") ?? "1"))
  const maxOrderQuantity = parseOptionalInteger(String(formData.get("maxOrderQuantity") ?? ""))
  const weight = parseOptionalFloat(String(formData.get("weight") ?? ""))
  const colorOptions = parseStringList(String(formData.get("colorOptions") ?? ""))
  const sizeOptions = parseStringList(String(formData.get("sizeOptions") ?? ""))
  const materials = parseStringList(String(formData.get("materials") ?? ""))
  const tags = parseStringList(String(formData.get("tags") ?? ""))
  const highlights = parseStringList(String(formData.get("highlights") ?? ""))
  const specifications = parseStringList(String(formData.get("specifications") ?? ""))
  const uploadedImages = await getUploadedImages(formData)
  const isFeatured = parseBooleanField(formData, "isFeatured")
  const isActive = parseBooleanField(formData, "isActive")
  const stockStatus = String(formData.get("stockStatus") ?? "").trim() || "In stock"
  const shippingDetails = String(formData.get("shippingDetails") ?? "").trim() || null
  const careInstructions = String(formData.get("careInstructions") ?? "").trim() || null
  const warranty = String(formData.get("warranty") ?? "").trim() || null
  const imageAlt = String(formData.get("imageAlt") ?? "").trim() || null
  const blurb = String(formData.get("blurb") ?? "").trim() || null
  const description = String(formData.get("description") ?? "").trim() || null
  const seoTitle = String(formData.get("seoTitle") ?? "").trim() || null
  const seoDescription = String(formData.get("seoDescription") ?? "").trim() || null
  const badge = String(formData.get("badge") ?? "").trim() || null
  const bgClassName = String(formData.get("bgClassName") ?? "").trim() || null
  const dimensions = String(formData.get("dimensions") ?? "").trim() || null
  const barcode = String(formData.get("barcode") ?? "").trim() || null

  if (
    !categoryId ||
    !name ||
    !slug ||
    !sku ||
    !brand ||
    Number.isNaN(price) ||
    Number.isNaN(stockQuantity) ||
    Number.isNaN(minOrderQuantity) ||
    uploadedImages.length === 0
  ) {
    redirect("/admin/product/new?error=missing-fields")
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
    },
  })

  if (!existingCategory) {
    redirect("/admin/product/new?error=missing-fields")
  }

  if (compareAtPrice !== null && Number.isNaN(compareAtPrice)) {
    redirect("/admin/product/new?error=invalid-pricing")
  }

  if (taxRate !== null && Number.isNaN(taxRate)) {
    redirect("/admin/product/new?error=invalid-pricing")
  }

  if (weight !== null && Number.isNaN(weight)) {
    redirect("/admin/product/new?error=invalid-pricing")
  }

  if (compareAtPrice !== null && compareAtPrice < price) {
    redirect("/admin/product/new?error=invalid-pricing")
  }

  if (stockQuantity < 0 || minOrderQuantity < 1 || (maxOrderQuantity !== null && maxOrderQuantity < minOrderQuantity)) {
    redirect("/admin/product/new?error=invalid-inventory")
  }

  if (taxRate !== null && (taxRate < 0 || taxRate > 100)) {
    redirect("/admin/product/new?error=invalid-pricing")
  }

  const duplicateSlug = await prisma.product.findFirst({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  })

  if (duplicateSlug) {
    redirect("/admin/product/new?error=slug-exists")
  }

  const duplicateSku = await prisma.product.findFirst({
    where: {
      sku,
    },
    select: {
      id: true,
    },
  })

  if (duplicateSku) {
    redirect("/admin/product/new?error=sku-exists")
  }

  await prisma.product.create({
    data: {
      categoryId,
      name,
      slug,
      sku,
      brand,
      sellerName: sellerName || null,
      price,
      compareAtPrice: compareAtPrice ?? null,
      taxRate: taxRate ?? null,
      stockQuantity,
      minOrderQuantity,
      maxOrderQuantity,
      weight: weight ?? null,
      dimensions,
      barcode,
      imageAlt,
      blurb,
      description,
      seoTitle,
      seoDescription,
      badge,
      bgClassName,
      stockStatus,
      isFeatured,
      isActive,
      colorOptions,
      sizeOptions,
      materials,
      tags,
      highlights,
      specifications,
      shippingDetails,
      careInstructions,
      warranty,
      images: {
        create: uploadedImages,
      },
    },
  })

  revalidateCatalogPages()
  redirect("/admin/product?created=1")
}

export async function updateProductAction(formData: FormData) {
  await requireModulePermission("products", "action")

  const id = String(formData.get("id") ?? "")

  if (!hasDatabaseUrl || !prisma) {
    redirect(`/admin/product/new?edit=${id}&error=database`)
  }

  const categoryId = String(formData.get("categoryId") ?? "")
  const name = String(formData.get("name") ?? "").trim()
  const providedSlug = String(formData.get("slug") ?? "").trim()
  const slug = slugify(providedSlug || name)
  const sku = String(formData.get("sku") ?? "").trim()
  const brand = String(formData.get("brand") ?? "").trim()
  const sellerName = String(formData.get("sellerName") ?? "").trim()
  const price = parsePrice(String(formData.get("price") ?? ""))
  const compareAtPrice = parseOptionalFloat(String(formData.get("compareAtPrice") ?? ""))
  const taxRate = parseOptionalFloat(String(formData.get("taxRate") ?? ""))
  const stockQuantity = parseInteger(String(formData.get("stockQuantity") ?? ""))
  const minOrderQuantity = parseInteger(String(formData.get("minOrderQuantity") ?? "1"))
  const maxOrderQuantity = parseOptionalInteger(String(formData.get("maxOrderQuantity") ?? ""))
  const weight = parseOptionalFloat(String(formData.get("weight") ?? ""))
  const colorOptions = parseStringList(String(formData.get("colorOptions") ?? ""))
  const sizeOptions = parseStringList(String(formData.get("sizeOptions") ?? ""))
  const materials = parseStringList(String(formData.get("materials") ?? ""))
  const tags = parseStringList(String(formData.get("tags") ?? ""))
  const highlights = parseStringList(String(formData.get("highlights") ?? ""))
  const specifications = parseStringList(String(formData.get("specifications") ?? ""))
  const uploadedImages = await getUploadedImages(formData)
  const isFeatured = parseBooleanField(formData, "isFeatured")
  const isActive = parseBooleanField(formData, "isActive")
  const stockStatus = String(formData.get("stockStatus") ?? "").trim() || "In stock"
  const shippingDetails = String(formData.get("shippingDetails") ?? "").trim() || null
  const careInstructions = String(formData.get("careInstructions") ?? "").trim() || null
  const warranty = String(formData.get("warranty") ?? "").trim() || null
  const imageAlt = String(formData.get("imageAlt") ?? "").trim() || null
  const blurb = String(formData.get("blurb") ?? "").trim() || null
  const description = String(formData.get("description") ?? "").trim() || null
  const seoTitle = String(formData.get("seoTitle") ?? "").trim() || null
  const seoDescription = String(formData.get("seoDescription") ?? "").trim() || null
  const badge = String(formData.get("badge") ?? "").trim() || null
  const bgClassName = String(formData.get("bgClassName") ?? "").trim() || null
  const dimensions = String(formData.get("dimensions") ?? "").trim() || null
  const barcode = String(formData.get("barcode") ?? "").trim() || null

  if (
    !id ||
    !categoryId ||
    !name ||
    !slug ||
    !sku ||
    !brand ||
    Number.isNaN(price) ||
    Number.isNaN(stockQuantity) ||
    Number.isNaN(minOrderQuantity)
  ) {
    redirect(`/admin/product/new?edit=${id}&error=missing-fields`)
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
    },
  })

  if (!existingCategory) {
    redirect(`/admin/product/new?edit=${id}&error=missing-fields`)
  }

  if (compareAtPrice !== null && Number.isNaN(compareAtPrice)) {
    redirect(`/admin/product/new?edit=${id}&error=invalid-pricing`)
  }

  if (taxRate !== null && Number.isNaN(taxRate)) {
    redirect(`/admin/product/new?edit=${id}&error=invalid-pricing`)
  }

  if (weight !== null && Number.isNaN(weight)) {
    redirect(`/admin/product/new?edit=${id}&error=invalid-pricing`)
  }

  if (compareAtPrice !== null && compareAtPrice < price) {
    redirect(`/admin/product/new?edit=${id}&error=invalid-pricing`)
  }

  if (stockQuantity < 0 || minOrderQuantity < 1 || (maxOrderQuantity !== null && maxOrderQuantity < minOrderQuantity)) {
    redirect(`/admin/product/new?edit=${id}&error=invalid-inventory`)
  }

  if (taxRate !== null && (taxRate < 0 || taxRate > 100)) {
    redirect(`/admin/product/new?edit=${id}&error=invalid-pricing`)
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  })

  if (!existingProduct) {
    redirect(`/admin/product/new?edit=${id}&error=not-found`)
  }

  const duplicateSlug = await prisma.product.findFirst({
    where: {
      slug,
      NOT: {
        id,
      },
    },
    select: {
      id: true,
    },
  })

  if (duplicateSlug) {
    redirect(`/admin/product/new?edit=${id}&error=slug-exists`)
  }

  const duplicateSku = await prisma.product.findFirst({
    where: {
      sku,
      NOT: {
        id,
      },
    },
    select: {
      id: true,
    },
  })

  if (duplicateSku) {
    redirect(`/admin/product/new?edit=${id}&error=sku-exists`)
  }

  await prisma.product.update({
    where: {
      id,
    },
    data: {
      categoryId,
      name,
      slug,
      sku,
      brand,
      sellerName: sellerName || null,
      price,
      compareAtPrice: compareAtPrice ?? null,
      taxRate: taxRate ?? null,
      stockQuantity,
      minOrderQuantity,
      maxOrderQuantity,
      weight: weight ?? null,
      dimensions,
      barcode,
      imageAlt,
      blurb,
      description,
      seoTitle,
      seoDescription,
      badge,
      bgClassName,
      stockStatus,
      isFeatured,
      isActive,
      colorOptions,
      sizeOptions,
      materials,
      tags,
      highlights,
      specifications,
      shippingDetails,
      careInstructions,
      warranty,
      ...(uploadedImages.length > 0
        ? {
            images: {
              deleteMany: {},
              create: uploadedImages,
            },
          }
        : {}),
    },
  })

  revalidateCatalogPages()
  redirect("/admin/product?updated=1")
}

export async function deleteProductAction(formData: FormData) {
  await requireModulePermission("products", "action")

  const id = String(formData.get("id") ?? "")

  if (!hasDatabaseUrl || !prisma) {
    redirect(`/admin/product/new?edit=${id}&error=database`)
  }

  if (!id) {
    redirect("/admin/product?error=not-found")
  }

  await prisma.product.delete({
    where: {
      id,
    },
  })

  revalidateCatalogPages()
  redirect("/admin/product?deleted=1")
}
