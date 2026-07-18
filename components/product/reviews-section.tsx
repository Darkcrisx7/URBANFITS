"use client";

import { useEffect, useState } from "react";
import { Review } from "@/lib/types";
import { getReviews, saveReviews } from "@/lib/storage";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Textarea, Input } from "@/components/ui/input";
import { useToast } from "@/contexts/toast-context";

export function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const toast = useToast();

  useEffect(() => {
    getReviews().then((all) => setReviews(all.filter((r) => r.productId === productId && r.approved)));
  }, [productId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;
    const all = await getReviews();
    const newReview: Review = {
      id: `r_${Date.now()}`,
      productId,
      author,
      rating,
      comment,
      date: new Date().toISOString().slice(0, 10),
      approved: false,
    };
    await saveReviews([newReview, ...all]);
    toast.show("Review submitted — pending approval");
    setAuthor("");
    setComment("");
    setRating(5);
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <h3 className="font-display text-2xl font-medium tracking-tightest">Reviews</h3>
        {reviews.length === 0 ? (
          <p className="mt-4 text-sm text-silver/70">No reviews yet — be the first.</p>
        ) : (
          <div className="mt-5 space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-white/10 pb-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{r.author}</p>
                  <span className="text-xs text-chrome">{r.date}</span>
                </div>
                <Rating value={r.rating} />
                <p className="mt-2 text-sm text-silver/80">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="rounded-2xl bg-white/5 p-6">
        <h4 className="font-display text-lg font-medium">Write a review</h4>
        <div className="mt-4 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button type="button" key={i} onClick={() => setRating(i + 1)}>
              <span className={i < rating ? "text-bone" : "text-chrome/50"}>★</span>
            </button>
          ))}
        </div>
        <Input
          className="mt-4"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <Textarea
          className="mt-3"
          rows={4}
          placeholder="Share your experience…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <Button type="submit" className="mt-4 w-full">
          Submit Review
        </Button>
      </form>
    </div>
  );
}
