"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getBanners, saveBanners } from "@/lib/storage";
import { Banner } from "@/lib/types";
import { useToast } from "@/contexts/toast-context";

function emptyBanner(): Banner {
  return {
    id: `b_${Date.now()}`,
    title: "",
    subtitle: "",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
    gradient: "from-black via-stone-900 to-accent",
    active: true,
  };
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState<Banner>(emptyBanner());
  const [showForm, setShowForm] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setBanners(getBanners());
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const updated = [...banners, form];
    saveBanners(updated);
    setBanners(updated);
    setForm(emptyBanner());
    setShowForm(false);
    toast.show("Banner added");
  }

  function remove(id: string) {
    const updated = banners.filter((b) => b.id !== id);
    saveBanners(updated);
    setBanners(updated);
    toast.show("Banner deleted");
  }

  function toggleActive(b: Banner) {
    const updated = banners.map((x) => (x.id === b.id ? { ...x, active: !x.active } : x));
    saveBanners(updated);
    setBanners(updated);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tightest">Banners</h1>
          <p className="mt-1 text-sm text-stone-500">Homepage promotional sections</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus size={16} /> {showForm ? "Cancel" : "New Banner"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-8 grid gap-4 rounded-2xl border border-stone-200 bg-paper p-6 sm:grid-cols-2">
          <div>
            <Label>Title</Label>
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </div>
          <div>
            <Label>CTA Label</Label>
            <Input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} />
          </div>
          <div>
            <Label>CTA Link</Label>
            <Input value={form.ctaHref} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })} />
          </div>
          <Button type="submit" className="sm:col-span-2">
            Save Banner
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {banners.map((b) => (
          <div
            key={b.id}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-paper ${b.gradient}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-xl font-medium">{b.title}</p>
                <p className="text-sm text-white/70">{b.subtitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleActive(b)}>
                  <Badge tone={b.active ? "success" : "neutral"}>{b.active ? "Active" : "Inactive"}</Badge>
                </button>
                <button onClick={() => remove(b.id)} className="text-white/70 hover:text-error">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
