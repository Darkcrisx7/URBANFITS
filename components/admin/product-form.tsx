"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ImageUp, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Product, ProductVariant, Category } from "@/lib/types";
import { upsertProduct, uploadProductImage } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { useToast } from "@/contexts/toast-context";
import { CATEGORIES } from "@/lib/mock-data";

const GRADIENTS = [
  "from-stone-900 via-stone-700 to-stone-500",
  "from-accent to-stone-900",
  "from-stone-800 to-stone-950",
  "from-blue-600 via-stone-900 to-black",
  "from-stone-200 to-stone-500",
  "from-black via-stone-800 to-accent",
];

function emptyProduct(): Product {
  return {
    id: `p_${Date.now()}`,
    slug: "",
    name: "",
    description: "",
    category: "t-shirts",
    tags: [],
    price: 0,
    currency: "INR",
    colors: [{ name: "Jet Black", hex: "#0A0A0A" }],
    sizes: ["S", "M", "L"],
    variants: [],
    images: [{ gradient: GRADIENTS[0], label: "Product" }],
    rating: 0,
    reviewCount: 0,
    isNew: true,
    isFlashSale: false,
    isBestSeller: false,
    status: "draft",
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

export function ProductForm({ initial }: { initial?: Product }) {
  const router = useRouter();
  const toast = useToast();
  const [product, setProduct] = useState<Product>(initial ?? emptyProduct());
  const [sizesInput, setSizesInput] = useState(product.sizes.join(", "));
  const [variants, setVariants] = useState<ProductVariant[]>(
    product.variants.length > 0 ? product.variants : []
  );
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(
    product.colors.length > 0 ? product.colors : [{ name: "Jet Black", hex: "#0A0A0A" }]
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addColor() {
    setColors((c) => [...c, { name: "", hex: "#000000" }]);
  }

  function updateColor(i: number, patch: Partial<{ name: string; hex: string }>) {
    setColors((c) => c.map((line, idx) => (idx === i ? { ...line, ...patch } : line)));
  }

  function removeColor(i: number) {
    setColors((c) => c.filter((_, idx) => idx !== i));
  }

  function addVariant() {
    setVariants((v) => [
      ...v,
      { size: product.sizes[0] ?? "M", color: colors[0]?.name ?? "", stock: 0, sku: "" },
    ]);
  }

  function updateVariant(i: number, patch: Partial<ProductVariant>) {
    setVariants((v) => v.map((line, idx) => (idx === i ? { ...line, ...patch } : line)));
  }

  function removeVariant(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const url = await uploadProductImage(file);
        setProduct((p) => {
          // Drop the default placeholder (no url) the first time a real
          // photo is added, then just append after that.
          const withoutPlaceholder = p.images.filter((img) => img.url);
          return {
            ...p,
            images: [...withoutPlaceholder, { gradient: GRADIENTS[0], label: p.name || "Product", url }],
          };
        });
      }
      toast.show(files.length > 1 ? "Photos uploaded" : "Photo uploaded");
    } catch (err: any) {
      toast.show(err?.message || "Photo upload failed — check your Supabase Storage bucket", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(i: number) {
    setProduct((p) => {
      const next = p.images.filter((_, idx) => idx !== i);
      return { ...p, images: next.length ? next : [{ gradient: GRADIENTS[0], label: p.name || "Product" }] };
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const cleanColors = colors.filter((c) => c.name.trim());
    if (cleanColors.length === 0) {
      toast.show("Add at least one color", "error");
      return;
    }
    const colorNames = new Set(cleanColors.map((c) => c.name));
    const mismatched = variants.find((v) => v.color && !colorNames.has(v.color));
    if (mismatched) {
      toast.show(`Variant color "${mismatched.color}" doesn't match any color above — fix it or it'll show as out of stock`, "error");
      return;
    }
    setSaving(true);
    const sizes = sizesInput.split(",").map((s) => s.trim()).filter(Boolean);
    const final: Product = {
      ...product,
      slug: product.slug || slugify(product.name),
      sizes,
      colors: cleanColors,
      variants,
    };
    try {
      await upsertProduct(final);
      toast.show(initial ? "Product updated" : "Product created");
      router.push("/admin/products");
    } catch {
      toast.show("Couldn't save — check your Supabase connection", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="rounded-2xl border border-stone-200 bg-paper p-6">
        <h2 className="mb-4 font-display text-lg font-medium">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Product Name</Label>
            <Input
              required
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>
          <div>
            <Label>URL Slug</Label>
            <Input
              value={product.slug}
              placeholder={slugify(product.name) || "auto-generated"}
              onChange={(e) => setProduct({ ...product, slug: slugify(e.target.value) })}
            />
          </div>
        </div>
        <div className="mt-4">
          <Label>Description</Label>
          <Textarea
            rows={3}
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Category</Label>
            <select
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value as Category })}
              className="h-12 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-ink"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Price (₹)</Label>
            <Input
              type="number"
              required
              value={product.price || ""}
              onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label>Compare-at Price (₹)</Label>
            <Input
              type="number"
              value={product.compareAtPrice || ""}
              onChange={(e) =>
                setProduct({ ...product, compareAtPrice: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          {(["isNew", "isFlashSale", "isBestSeller"] as const).map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={product[key]}
                onChange={(e) => setProduct({ ...product, [key]: e.target.checked })}
              />
              {key === "isNew" ? "New Arrival" : key === "isFlashSale" ? "Flash Sale" : "Best Seller"}
            </label>
          ))}
        </div>
        <div className="mt-4">
          <Label>Status</Label>
          <select
            value={product.status}
            onChange={(e) => setProduct({ ...product, status: e.target.value as Product["status"] })}
            className="h-12 w-full max-w-xs rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-ink"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-paper p-6">
        <h2 className="mb-4 font-display text-lg font-medium">Photos</h2>
        <div className="flex flex-wrap gap-3">
          {product.images.map((img, i) => (
            <div key={i} className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
              {img.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt={img.label} className="h-full w-full object-cover" />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${img.gradient}`} />
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove photo"
              >
                <X size={13} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-stone-300 text-stone-400 hover:border-ink hover:text-ink"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImageUp size={18} />}
            <span className="text-[10px]">{uploading ? "Uploading…" : "Add photo"}</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFilesSelected}
          className="hidden"
        />
        <p className="mt-3 text-xs text-stone-400">
          JPG or PNG. Uploaded photos are stored in Supabase Storage and replace the placeholder gradient.
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-paper p-6">
        <h2 className="mb-4 font-display text-lg font-medium">Colors</h2>
        <p className="mb-4 text-xs text-stone-400">
          These are the color options customers can choose on the product page. Each variant below must use one of these exact names.
        </p>
        <div className="space-y-3">
          {colors.map((c, i) => (
            <div key={i} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <input
                type="color"
                value={c.hex}
                onChange={(e) => updateColor(i, { hex: e.target.value })}
                className="h-10 w-12 cursor-pointer rounded-lg border border-stone-300"
                aria-label="Color swatch"
              />
              <Input
                placeholder="Color name (e.g. Jet Black)"
                value={c.name}
                onChange={(e) => updateColor(i, { name: e.target.value })}
              />
              <button type="button" onClick={() => removeColor(i)} className="text-stone-400 hover:text-error">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" className="mt-4" onClick={addColor}>
          <Plus size={14} /> Add Color
        </Button>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-paper p-6">
        <h2 className="mb-4 font-display text-lg font-medium">Sizes</h2>
        <Label>Available sizes (comma separated)</Label>
        <Input value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} placeholder="S, M, L, XL" />
      </div>

      <div className="rounded-2xl border border-stone-200 bg-paper p-6">
        <h2 className="mb-4 font-display text-lg font-medium">Inventory Variants</h2>
        <div className="space-y-3">
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2">
              <Input
                placeholder="Size"
                value={v.size}
                onChange={(e) => updateVariant(i, { size: e.target.value })}
              />
              <select
                value={v.color}
                onChange={(e) => updateVariant(i, { color: e.target.value })}
                className="h-12 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-ink"
              >
                <option value="">Select color…</option>
                {colors.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name || "(unnamed)"}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="Stock"
                value={v.stock}
                onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
              />
              <Input
                placeholder="SKU"
                value={v.sku}
                onChange={(e) => updateVariant(i, { sku: e.target.value })}
              />
              <button type="button" onClick={() => removeVariant(i)} className="text-stone-400 hover:text-error">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" className="mt-4" onClick={addVariant}>
          <Plus size={14} /> Add Variant
        </Button>
      </div>

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={saving || uploading}>
          {saving ? "Saving…" : initial ? "Save Changes" : "Create Product"}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
