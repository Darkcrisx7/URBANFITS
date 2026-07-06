import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium tracking-tightest">Add Product</h1>
      <ProductForm />
    </div>
  );
}
