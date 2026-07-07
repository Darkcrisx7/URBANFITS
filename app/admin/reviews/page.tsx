"use client";

import { useEffect, useState } from "react";
import { Check, Trash2, EyeOff } from "lucide-react";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { getReviews, saveReviews, getProducts, syncProductRatingFromReviews } from "@/lib/storage";
import { Review } from "@/lib/types";
import { useToast } from "@/contexts/toast-context";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const toast = useToast();

  useEffect(() => {
    getReviews().then(setReviews);
    getProducts().then((products) => {
      const names: Record<string, string> = {};
      products.forEach((p) => (names[p.id] = p.name));
      setProductNames(names);
    });
  }, []);

  async function approve(id: string) {
    const review = reviews.find((r) => r.id === id);
    const updated = reviews.map((r) => (r.id === id ? { ...r, approved: true } : r));
    await saveReviews(updated);
    setReviews(updated);
    if (review) await syncProductRatingFromReviews(review.productId);
    toast.show("Review approved");
  }

  async function hide(id: string) {
    const review = reviews.find((r) => r.id === id);
    const updated = reviews.map((r) => (r.id === id ? { ...r, approved: false } : r));
    await saveReviews(updated);
    setReviews(updated);
    if (review) await syncProductRatingFromReviews(review.productId);
    toast.show("Review hidden");
  }

  async function remove(id: string) {
    const review = reviews.find((r) => r.id === id);
    const updated = reviews.filter((r) => r.id !== id);
    await saveReviews(updated);
    setReviews(updated);
    if (review) await syncProductRatingFromReviews(review.productId);
    toast.show("Review deleted");
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-medium tracking-tightest">Reviews</h1>
      <p className="mb-6 text-sm text-stone-500">{reviews.length} reviews across all products</p>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-stone-200 bg-paper p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium">
                  {r.author} <span className="font-normal text-stone-400">on</span>{" "}
                  {productNames[r.productId] ?? "Unknown product"}
                </p>
                <Rating value={r.rating} />
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={r.approved ? "success" : "neutral"}>{r.approved ? "Approved" : "Pending"}</Badge>
                {!r.approved && (
                  <button onClick={() => approve(r.id)} className="text-success" aria-label="Approve">
                    <Check size={16} />
                  </button>
                )}
                {r.approved && (
                  <button onClick={() => hide(r.id)} className="text-stone-400 hover:text-ink" aria-label="Hide">
                    <EyeOff size={16} />
                  </button>
                )}
                <button onClick={() => remove(r.id)} className="text-stone-400 hover:text-error" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-stone-600">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
