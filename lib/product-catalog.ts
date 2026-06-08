export type ProductSpecification = {
  label: string;
  value: string;
};

export type ProductGalleryItem = {
  src: string;
  alt: string;
  bgClassName: string;
};

export type ProductShippingInfo = {
  dispatch: string;
  delivery: string;
  returns: string;
};

export type ProductEntry = {
  id: string;
  name: string;
  priceValue: number;
  priceLabel: string;
  originalPriceValue: number;
  originalPriceLabel: string;
  savingsLabel: string;
  imageSrc: string;
  imageAlt: string;
  blurb: string;
  description: string;
  badge: string;
  bgClassName: string;
  categorySlug: string;
  categoryName: string;
  brand: string;
  rating: number;
  reviews: number;
  delivery: string;
  gallery: ProductGalleryItem[];
  colors: string[];
  sizes: string[];
  highlights: string[];
  specifications: ProductSpecification[];
  shipping: ProductShippingInfo;
  stockStatus: string;
  seller: string;
  warranty: string;
  care: string;
  inBox: string[];
};

export type ProductFilters = {
  category?: string;
  q?: string;
  price?: string;
  sort?: string;
};

export function filterProducts(filters: ProductFilters, catalog: ProductEntry[]) {
  const query = filters.q?.trim().toLowerCase() ?? "";

  let filtered = catalog.filter((product) => {
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

export function getProductById(id: string, catalog: ProductEntry[]) {
  return catalog.find((product) => product.id === id);
}

export function getRelatedProducts(productId: string, categorySlug: string, limit = 4, catalog: ProductEntry[]) {
  return catalog
    .filter((product) => product.id !== productId && product.categorySlug === categorySlug)
    .slice(0, limit);
}
