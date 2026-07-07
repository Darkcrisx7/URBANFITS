import { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/mock-data";
import { getProducts } from "@/lib/storage";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://urbanfits.store";
  const staticRoutes = ["", "/shop", "/about", "/contact", "/wishlist", "/cart"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${base}/shop/${c.key}`,
    lastModified: new Date(),
  }));
  const products = await getProducts();
  const productRoutes = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(p.createdAt),
  }));
  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
