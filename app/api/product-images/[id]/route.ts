import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!prisma) {
    return new Response("Image storage unavailable", { status: 503 })
  }

  const { id } = await params

  const productImage = await prisma.productImage.findUnique({
    where: {
      id,
    },
    select: {
      data: true,
      filename: true,
      mimeType: true,
    },
  })

  if (!productImage) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(new Uint8Array(productImage.data), {
    headers: {
      "Content-Type": productImage.mimeType,
      "Content-Disposition": `inline; filename="${productImage.filename}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
