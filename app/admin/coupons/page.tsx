"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getCoupons, saveCoupons } from "@/lib/storage";
import { Coupon } from "@/lib/types";
import { useToast } from "@/contexts/toast-context";

function emptyCoupon(): Coupon {
  return {
    code: "",
    type: "percentage",
    value: 10,
    minPurchase: 0,
    usageLimit: 100,
    usedCount: 0,
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    active: true,
  };
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState<Coupon>(emptyCoupon());
  const [showForm, setShowForm] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getCoupons().then(setCoupons);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code.trim()) return;
    const updated = [...coupons.filter((c) => c.code !== form.code), { ...form, code: form.code.toUpperCase() }];
    await saveCoupons(updated);
    setCoupons(updated);
    setForm(emptyCoupon());
    setShowForm(false);
    toast.show("Coupon saved");
  }

  async function remove(code: string) {
    const updated = coupons.filter((c) => c.code !== code);
    await saveCoupons(updated);
    setCoupons(updated);
    toast.show("Coupon deleted");
  }

  async function toggleActive(c: Coupon) {
    const updated = coupons.map((x) => (x.code === c.code ? { ...x, active: !x.active } : x));
    await saveCoupons(updated);
    setCoupons(updated);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tightest">Coupons</h1>
          <p className="mt-1 text-sm text-stone-500">{coupons.length} coupon codes</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus size={16} /> {showForm ? "Cancel" : "New Coupon"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-8 grid gap-4 rounded-2xl border border-stone-200 bg-paper p-6 sm:grid-cols-3">
          <div>
            <Label>Code</Label>
            <Input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <div>
            <Label>Type</Label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Coupon["type"] })}
              className="h-12 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-ink"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          <div>
            <Label>Value</Label>
            <Input
              type="number"
              required
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label>Minimum Purchase (₹)</Label>
            <Input
              type="number"
              value={form.minPurchase}
              onChange={(e) => setForm({ ...form, minPurchase: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label>Usage Limit</Label>
            <Input
              type="number"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Input
              type="date"
              value={form.expiresAt.slice(0, 10)}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            />
          </div>
          <Button type="submit" className="sm:col-span-3">
            Save Coupon
          </Button>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-paper">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 text-left text-xs uppercase tracking-wideish text-stone-500">
            <tr>
              <th className="px-5 py-3">Code</th>
              <th className="px-5 py-3">Discount</th>
              <th className="px-5 py-3">Min Purchase</th>
              <th className="px-5 py-3">Used</th>
              <th className="px-5 py-3">Expires</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.code} className="border-b border-stone-100 last:border-0">
                <td className="px-5 py-3 font-mono font-medium">{c.code}</td>
                <td className="px-5 py-3">{c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="px-5 py-3">₹{c.minPurchase}</td>
                <td className="px-5 py-3">
                  {c.usedCount}/{c.usageLimit}
                </td>
                <td className="px-5 py-3 text-stone-500">{new Date(c.expiresAt).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleActive(c)}>
                    <Badge tone={c.active ? "success" : "neutral"}>{c.active ? "Active" : "Inactive"}</Badge>
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => remove(c.code)} className="text-stone-400 hover:text-error">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
