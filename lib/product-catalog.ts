import { categoryCatalog } from "@/lib/category-catalog";

export type ProductEntry = {
  id: string;
  name: string;
  priceValue: number;
  priceLabel: string;
  imageSrc: string;
  imageAlt: string;
  blurb: string;
  badge: string;
  bgClassName: string;
  categorySlug: string;
  categoryName: string;
  brand: string;
  rating: number;
  reviews: number;
  delivery: string;
};

const brandPool = [
  "Nova",
  "UrbanNest",
  "Crafted Co.",
  "PrimePick",
  "Northline",
  "Everyday+",
];

const deliveryPool = ["Free delivery tomorrow", "Delivery in 2 days", "Express delivery", "Same-week delivery"];

export const productCatalog: ProductEntry[] = categoryCatalog.flatMap((category, categoryIndex) =>
  category.products.map((product, productIndex) => ({
    id: `${category.slug}-${productIndex + 1}`,
    name: product.name,
    priceValue: Number(product.price.replace(/[^0-9.]/g, "")),
    priceLabel: product.price,
    imageSrc: product.imageSrc,
    imageAlt: product.imageAlt,
    blurb: product.blurb,
    badge: product.badge,
    bgClassName: product.bgClassName,
    categorySlug: category.slug,
    categoryName: category.name,
    brand: brandPool[(categoryIndex + productIndex) % brandPool.length],
    rating: Number((4.1 + ((categoryIndex + productIndex) % 7) * 0.1).toFixed(1)),
    reviews: 120 + categoryIndex * 43 + productIndex * 37,
    delivery: deliveryPool[(categoryIndex + productIndex) % deliveryPool.length],
  })),
);

export type ProductFilters = {
  category?: string;
  q?: string;
  price?: string;
  sort?: string;
};

export function filterProducts(filters: ProductFilters) {
  const query = filters.q?.trim().toLowerCase() ?? "";

  let filtered = productCatalog.filter((product) => {
    const matchesCategory = !filters.category || product.categorySlug === filters.category;
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.blurb.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.categoryName.toLowerCase().includes(query);

    const matchesPrice =
      !filters.price ||
      (filters.price === "under-25" && product.priceValue < 25) ||
      (filters.price === "25-50" && product.priceValue >= 25 && product.priceValue <= 50) ||
      (filters.price === "50-100" && product.priceValue > 50 && product.priceValue <= 100) ||
      (filters.price === "100-plus" && product.priceValue > 100);

    return matchesCategory && matchesQuery && matchesPrice;
  });

  switch (filters.sort) {
    case "price-asc":
      filtered = [...filtered].sort((a, b) => a.priceValue - b.priceValue);
      break;
    case "price-desc":
      filtered = [...filtered].sort((a, b) => b.priceValue - a.priceValue);
      break;
    case "rating":
      filtered = [...filtered].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      break;
    default:
      filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);
      break;
  }

  return filtered;
}
