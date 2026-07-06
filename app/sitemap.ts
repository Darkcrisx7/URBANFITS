import { MetadataRoute } from "next";
import { PRODUCTS, CATEGORIES } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://urbanfits.store";
  const staticRoutes = ["", "/shop", "/about", "/contact", "/wishlist", "/cart"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${base}/shop/${c.key}`,
    lastModified: new Date(),
  }));
  const productRoutes = PRODUCTS.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(p.createdAt),
  }));
  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
