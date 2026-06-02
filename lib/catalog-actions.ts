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
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : NaN
}

function revalidateCatalogPages() {
  revalidatePath("/admin/category")
  revalidatePath("/admin/product")
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
    redirect("/admin/category?error=database")
  }

  const name = String(formData.get("name") ?? "").trim()
  const providedSlug = String(formData.get("slug") ?? "").trim()
  const slug = slugify(providedSlug || name)

  if (!name || !slug) {
    redirect("/admin/category?error=missing-fields")
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
    redirect("/admin/category?error=slug-exists")
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
    redirect("/admin/category?error=database")
  }

  const id = String(formData.get("id") ?? "")
  const name = String(formData.get("name") ?? "").trim()
  const providedSlug = String(formData.get("slug") ?? "").trim()
  const slug = slugify(providedSlug || name)

  if (!id || !name || !slug) {
    redirect("/admin/category?error=missing-fields")
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
    redirect("/admin/category?error=not-found")
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
    redirect(`/admin/category?edit=${id}&error=slug-exists`)
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
    redirect("/admin/product?error=database")
  }

  const categoryId = String(formData.get("categoryId") ?? "")
  const name = String(formData.get("name") ?? "").trim()
  const price = parsePrice(String(formData.get("price") ?? ""))
  const uploadedImages = await getUploadedImages(formData)

  if (!categoryId || !name || Number.isNaN(price) || uploadedImages.length === 0) {
    redirect("/admin/product?error=missing-fields")
  }

  await prisma.product.create({
    data: {
      categoryId,
      name,
      price,
      imageAlt: String(formData.get("imageAlt") ?? "").trim() || null,
      blurb: String(formData.get("blurb") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      badge: String(formData.get("badge") ?? "").trim() || null,
      bgClassName: String(formData.get("bgClassName") ?? "").trim() || null,
      stockStatus: String(formData.get("stockStatus") ?? "").trim() || "In stock",
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

  if (!hasDatabaseUrl || !prisma) {
    redirect("/admin/product?error=database")
  }

  const id = String(formData.get("id") ?? "")
  const categoryId = String(formData.get("categoryId") ?? "")
  const name = String(formData.get("name") ?? "").trim()
  const price = parsePrice(String(formData.get("price") ?? ""))
  const uploadedImages = await getUploadedImages(formData)

  if (!id || !categoryId || !name || Number.isNaN(price)) {
    redirect("/admin/product?error=missing-fields")
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
    redirect("/admin/product?error=not-found")
  }

  await prisma.product.update({
    where: {
      id,
    },
    data: {
      categoryId,
      name,
      price,
      imageAlt: String(formData.get("imageAlt") ?? "").trim() || null,
      blurb: String(formData.get("blurb") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      badge: String(formData.get("badge") ?? "").trim() || null,
      bgClassName: String(formData.get("bgClassName") ?? "").trim() || null,
      stockStatus: String(formData.get("stockStatus") ?? "").trim() || "In stock",
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

  if (!hasDatabaseUrl || !prisma) {
    redirect("/admin/product?error=database")
  }

  const id = String(formData.get("id") ?? "")

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
