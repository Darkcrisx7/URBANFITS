"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProducts, deleteProduct, upsertProduct } from "@/lib/storage";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/contexts/toast-context";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const toast = useToast();

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setProducts(await getProducts());
  }

  async function remove(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await deleteProduct(id);
    refresh();
    toast.show("Product deleted");
  }

  async function duplicate(p: Product) {
    const copy: Product = {
      ...p,
      id: `p_${Date.now()}`,
      slug: `${p.slug}-copy-${Date.now().toString().slice(-4)}`,
      name: `${p.name} (Copy)`,
      status: "draft",
    };
    await upsertProduct(copy);
    refresh();
    toast.show("Product duplicated as draft");
  }

  async function toggleStatus(p: Product) {
    const next: Product = { ...p, status: p.status === "published" ? "hidden" : "published" };
    await upsertProduct(next);
    refresh();
  }

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tightest">Products</h1>
          <p className="mt-1 text-sm text-stone-500">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus size={16} /> Add Product
          </Button>
        </Link>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
        className="mb-6 h-11 w-full max-w-sm rounded-full border border-stone-300 px-4 text-sm outline-none focus:border-ink"
      />

      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-paper">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 text-left text-xs uppercase tracking-wideish text-stone-500">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const stock = p.variants.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={p.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.images[0].url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0].url} alt={p.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <div className={`h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br ${p.images[0].gradient}`} />
                      )}
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 capitalize text-stone-500">{p.category}</td>
                  <td className="px-5 py-3">{formatCurrency(p.price)}</td>
                  <td className="px-5 py-3">
                    <span className={stock === 0 ? "text-error" : stock < 10 ? "text-accent" : "text-stone-600"}>
                      {stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={p.status === "published" ? "success" : p.status === "draft" ? "neutral" : "error"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => toggleStatus(p)} className="text-stone-400 hover:text-ink" aria-label="Toggle visibility">
                        {p.status === "published" ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button onClick={() => duplicate(p)} className="text-stone-400 hover:text-ink" aria-label="Duplicate">
                        <Copy size={15} />
                      </button>
                      <Link href={`/admin/products/${p.id}`} className="text-stone-400 hover:text-ink" aria-label="Edit">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => remove(p.id)} className="text-stone-400 hover:text-error" aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
