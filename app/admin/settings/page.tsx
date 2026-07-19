"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/contexts/toast-context";
import { getSettings, saveSettings } from "@/lib/storage";
import { StoreSettings } from "@/lib/types";

const DEFAULTS: StoreSettings = {
  storeName: "Urban Fits Streetwear",
  supportEmail: "support@urbanfits.store",
  supportPhone: "+91 80000 00000",
  shippingFlatRate: 99,
  freeShippingThreshold: 2000,
  taxRate: 5,
  returnWindowDays: 7,
  codEnabled: true,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings(settings);
      toast.show("Settings saved — live on the storefront now");
    } catch {
      toast.show("Couldn't save — check your Supabase connection", "error");
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) return null;

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-medium tracking-tightest">Settings</h1>
      <p className="mb-6 text-sm text-stone-500">Store information and checkout configuration</p>

      <form onSubmit={save} className="max-w-2xl space-y-6">
        <div className="rounded-2xl border border-stone-200 bg-paper p-6">
          <h2 className="mb-4 font-display text-lg font-medium">Store Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Store Name</Label>
              <Input value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} />
            </div>
            <div>
              <Label>Support Email</Label>
              <Input
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              />
            </div>
            <div>
              <Label>Support Phone</Label>
              <Input
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-paper p-6">
          <h2 className="mb-4 font-display text-lg font-medium">Shipping & Tax</h2>
          <p className="mb-4 text-xs text-stone-400">
            These numbers drive the real shipping/tax math at checkout — changes here take effect
            on the live site immediately after saving.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Flat Shipping Rate (₹)</Label>
              <Input
                type="number"
                value={settings.shippingFlatRate}
                onChange={(e) => setSettings({ ...settings, shippingFlatRate: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Free Shipping Above (₹)</Label>
              <Input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Tax Rate (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Return Window (days)</Label>
              <Input
                type="number"
                value={settings.returnWindowDays}
                onChange={(e) => setSettings({ ...settings, returnWindowDays: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-paper p-6">
          <h2 className="mb-4 font-display text-lg font-medium">Payment Methods</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.codEnabled}
              onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
            />
            Cash on Delivery enabled
          </label>
          <p className="mt-3 text-xs text-stone-400">
            Online payment gateways (Stripe / Razorpay / UPI) are not connected in this build — the
            store currently checks out with Cash on Delivery only, as requested.
          </p>
        </div>

        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
