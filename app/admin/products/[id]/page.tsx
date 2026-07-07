"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getProducts } from "@/lib/storage";
import { Product } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const found = (await getProducts()).find((p) => p.id === params.id);
      setProduct(found ?? null);
    })();
  }, [params.id]);

  if (product === undefined) return null;
  if (product === null) {
    router.replace("/admin/products");
    return null;
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium tracking-tightest">Edit Product</h1>
      <ProductForm initial={product} />
    </div>
  );
}
