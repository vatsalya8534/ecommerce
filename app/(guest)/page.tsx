import { HeroCarousel } from "@/components/hero-carousel";
import { CategoryGrid } from "@/components/category-grid";
import { HomeMerchStrips } from "@/components/home-merch-strips";

export default function Page() {
  return (
    <>
      <HeroCarousel />
      <HomeMerchStrips />
      <CategoryGrid
        title="Browse the categories shoppers look for first"
        intro="A cleaner category section with faster visual scanning, strong product cues, and direct paths into focused category pages."
      />
    </>
  );
}
