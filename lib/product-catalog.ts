import { categoryCatalog } from "@/lib/category-catalog";

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

const brandPool = [
  "Nova",
  "UrbanNest",
  "Crafted Co.",
  "PrimePick",
  "Northline",
  "Everyday+",
];

const deliveryPool = ["Free delivery tomorrow", "Delivery in 2 days", "Express delivery", "Same-week delivery"];
const galleryBackgrounds = ["bg-white", "bg-[#f7f8fb]", "bg-[#eef2f7]"];

const categoryProductOptions: Record<
  string,
  {
    colors: string[];
    sizes: string[];
    highlights: string[];
    specs: ProductSpecification[];
    inBox: string[];
    warranty: string;
    care: string;
  }
> = {
  electronics: {
    colors: ["Midnight Black", "Steel Gray", "Cloud White"],
    sizes: ["Standard"],
    highlights: ["Fast setup", "Reliable daily performance", "Compatible with common devices"],
    specs: [
      { label: "Connectivity", value: "Bluetooth / USB-C ready" },
      { label: "Build", value: "Lightweight travel-friendly design" },
      { label: "Use case", value: "Work, entertainment, and daily carry" },
    ],
    inBox: ["Main device", "Charging cable", "Quick start guide"],
    warranty: "1 year brand warranty",
    care: "Keep dry, wipe with a soft cloth, and store away from direct heat.",
  },
  "diy-tools": {
    colors: ["Industrial Yellow", "Graphite", "Orange"],
    sizes: ["Kit size"],
    highlights: ["Built for regular household use", "Easy grip handling", "Practical storage included"],
    specs: [
      { label: "Material", value: "Durable workshop-grade components" },
      { label: "Grip", value: "Comfort hold handles" },
      { label: "Best for", value: "Home fixes and weekend projects" },
    ],
    inBox: ["Tool set", "Storage case", "Usage guide"],
    warranty: "6 month limited warranty",
    care: "Clean after use and keep in a dry storage area.",
  },
  "mens-wear": {
    colors: ["Navy", "Charcoal", "Stone"],
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Tailored for everyday wear", "Comfortable fabric feel", "Easy to pair with staples"],
    specs: [
      { label: "Fabric", value: "Soft-touch cotton blend" },
      { label: "Fit", value: "Regular structured fit" },
      { label: "Occasion", value: "Work, commute, and smart casual" },
    ],
    inBox: ["1 garment"],
    warranty: "7 day replacement on manufacturing issues",
    care: "Machine wash cold, line dry, and warm iron if needed.",
  },
  "girls-wear": {
    colors: ["Blush Pink", "Lavender", "Sky Blue"],
    sizes: ["4Y", "6Y", "8Y", "10Y"],
    highlights: ["Soft against skin", "Easy movement fit", "Playful color styling"],
    specs: [
      { label: "Fabric", value: "Breathable cotton-rich blend" },
      { label: "Fit", value: "Comfort-first regular fit" },
      { label: "Style", value: "Everyday and outing ready" },
    ],
    inBox: ["1 apparel piece"],
    warranty: "7 day replacement on manufacturing issues",
    care: "Gentle wash recommended and dry in shade.",
  },
  gadgets: {
    colors: ["Black", "Silver", "Blue"],
    sizes: ["One size"],
    highlights: ["Portable footprint", "Useful for daily routines", "Simple setup and operation"],
    specs: [
      { label: "Power", value: "Rechargeable design" },
      { label: "Portability", value: "Pocket and desk friendly" },
      { label: "Best use", value: "Travel, office, and home" },
    ],
    inBox: ["Gadget", "Cable", "Quick guide"],
    warranty: "1 year seller warranty",
    care: "Avoid water exposure and use only compatible charging accessories.",
  },
  furniture: {
    colors: ["Walnut", "Beige", "Olive"],
    sizes: ["Standard"],
    highlights: ["Space-conscious dimensions", "Built for daily home use", "Matches modern interiors"],
    specs: [
      { label: "Material", value: "Engineered wood / fabric mix" },
      { label: "Assembly", value: "Basic self-assembly required" },
      { label: "Placement", value: "Living room, bedroom, or study" },
    ],
    inBox: ["Main unit", "Assembly hardware", "Instruction manual"],
    warranty: "1 year manufacturing warranty",
    care: "Dust regularly and avoid prolonged moisture exposure.",
  },
  kidswear: {
    colors: ["Mint", "Sun Yellow", "Red"],
    sizes: ["3Y", "5Y", "7Y", "9Y"],
    highlights: ["Soft everyday comfort", "Easy wash maintenance", "Made for active movement"],
    specs: [
      { label: "Fabric", value: "Cotton-rich everyday fabric" },
      { label: "Fit", value: "Relaxed kid-friendly fit" },
      { label: "Use", value: "School, play, and outings" },
    ],
    inBox: ["1 or 2 apparel pieces depending on pack"],
    warranty: "7 day replacement on manufacturing issues",
    care: "Machine wash with similar colors.",
  },
  bags: {
    colors: ["Black", "Olive", "Tan"],
    sizes: ["Compact", "Standard"],
    highlights: ["Smart internal organization", "Comfortable carry", "Commute and travel ready"],
    specs: [
      { label: "Material", value: "Water-resistant outer fabric" },
      { label: "Storage", value: "Multi-pocket organized layout" },
      { label: "Use case", value: "Daily commute and short travel" },
    ],
    inBox: ["Bag unit"],
    warranty: "6 month stitching warranty",
    care: "Spot clean only and do not overload beyond intended use.",
  },
  groceries: {
    colors: ["Natural pack"],
    sizes: ["Standard pack"],
    highlights: ["Pantry-ready", "Quick restock essential", "Easy everyday use"],
    specs: [
      { label: "Shelf life", value: "Check pack label on delivery" },
      { label: "Packaging", value: "Sealed freshness pack" },
      { label: "Use", value: "Daily consumption" },
    ],
    inBox: ["Sealed grocery pack"],
    warranty: "Replacement on damaged delivery only",
    care: "Store in a cool, dry place after opening.",
  },
  "kitchen-wear": {
    colors: ["Ivory", "Terracotta", "Graphite"],
    sizes: ["2-piece", "4-piece"],
    highlights: ["Useful for daily cooking", "Easy to clean", "Kitchen-to-table friendly"],
    specs: [
      { label: "Material", value: "Food-safe kitchen-grade build" },
      { label: "Cleaning", value: "Quick wash maintenance" },
      { label: "Use", value: "Cooking, prep, and serving" },
    ],
    inBox: ["Kitchen item set", "Care leaflet"],
    warranty: "6 month manufacturing warranty",
    care: "Wash before first use and avoid abrasive scrubbers.",
  },
  "beauty-care": {
    colors: ["Rose", "Mint", "Neutral"],
    sizes: ["Single", "Duo set"],
    highlights: ["Routine-friendly", "Travel-ready sizing", "Gentle daily use"],
    specs: [
      { label: "Skin type", value: "Suitable for regular everyday care" },
      { label: "Texture", value: "Lightweight and easy to apply" },
      { label: "Usage", value: "Morning and evening routine support" },
    ],
    inBox: ["Beauty care item", "Usage instructions"],
    warranty: "Replacement on transit damage only",
    care: "Keep sealed after use and store away from direct sunlight.",
  },
  "sports-fitness": {
    colors: ["Forest", "Black", "Coral"],
    sizes: ["Standard"],
    highlights: ["Supports repeat workouts", "Home-use friendly", "Simple to carry and store"],
    specs: [
      { label: "Best for", value: "Warmups, workouts, and recovery" },
      { label: "Build", value: "Lightweight active-use construction" },
      { label: "Storage", value: "Easy to roll, stack, or hang" },
    ],
    inBox: ["Fitness product", "Basic usage guide"],
    warranty: "3 month limited warranty",
    care: "Air dry after use and store away from direct sun.",
  },
};

function getProductOptions(categorySlug: string) {
  return (
    categoryProductOptions[categorySlug] ?? {
      colors: ["Standard"],
      sizes: ["Standard"],
      highlights: ["Useful everyday pick", "Easy to maintain", "Designed for regular use"],
      specs: [
        { label: "Build", value: "Practical everyday design" },
        { label: "Use case", value: "Daily lifestyle use" },
        { label: "Finish", value: "Clean modern styling" },
      ],
      inBox: ["1 item"],
      warranty: "Standard seller support",
      care: "Refer to product handling instructions after delivery.",
    }
  );
}

export const productCatalog: ProductEntry[] = categoryCatalog.flatMap((category, categoryIndex) =>
  category.products.map((product, productIndex) => {
    const priceValue = Number(product.price.replace(/[^0-9.]/g, ""));
    const brand = brandPool[(categoryIndex + productIndex) % brandPool.length];
    const delivery = deliveryPool[(categoryIndex + productIndex) % deliveryPool.length];
    const options = getProductOptions(category.slug);
    const originalPriceValue = Number((priceValue * 1.22).toFixed(2));
    const savingsValue = Number((originalPriceValue - priceValue).toFixed(2));

    return {
      id: `${category.slug}-${productIndex + 1}`,
      name: product.name,
      priceValue,
      priceLabel: product.price,
      originalPriceValue,
      originalPriceLabel: `$${originalPriceValue.toFixed(2)}`,
      savingsLabel: `Save $${savingsValue.toFixed(2)}`,
      imageSrc: product.imageSrc,
      imageAlt: product.imageAlt,
      blurb: product.blurb,
      description: `${product.blurb} Built for shoppers looking for dependable ${category.name.toLowerCase()} picks, this ${product.name.toLowerCase()} balances value, presentation, and everyday usability.`,
      badge: product.badge,
      bgClassName: product.bgClassName,
      categorySlug: category.slug,
      categoryName: category.name,
      brand,
      rating: Number((4.1 + ((categoryIndex + productIndex) % 7) * 0.1).toFixed(1)),
      reviews: 120 + categoryIndex * 43 + productIndex * 37,
      delivery,
      gallery: galleryBackgrounds.map((background, galleryIndex) => ({
        src: product.imageSrc,
        alt: `${product.name} view ${galleryIndex + 1}`,
        bgClassName: background,
      })),
      colors: options.colors,
      sizes: options.sizes,
      highlights: options.highlights,
      specifications: [
        { label: "Brand", value: brand },
        ...options.specs,
      ],
      shipping: {
        dispatch: "Ships within 24 hours",
        delivery,
        returns: "7 day easy returns",
      },
      stockStatus: productIndex % 3 === 0 ? "In stock" : "Limited stock available",
      seller: `${brand} Marketplace Store`,
      warranty: options.warranty,
      care: options.care,
      inBox: options.inBox,
    };
  }),
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

export function getProductById(id: string) {
  return productCatalog.find((product) => product.id === id);
}

export function getRelatedProducts(productId: string, categorySlug: string, limit = 4) {
  return productCatalog
    .filter((product) => product.id !== productId && product.categorySlug === categorySlug)
    .slice(0, limit);
}
