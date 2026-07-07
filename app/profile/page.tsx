"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Package, Heart, MapPin, LogOut } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { getAddresses, setAddresses } from "@/lib/storage";
import { Address } from "@/lib/types";
import { useToast } from "@/contexts/toast-context";

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [addresses, setAddressesState] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: "", line1: "", city: "", state: "", pincode: "", phone: "" });

  useEffect(() => {
    setAddressesState(getAddresses());
  }, []);

  function addAddress(e: React.FormEvent) {
    e.preventDefault();
    const newAddr: Address = { id: `addr_${Date.now()}`, isDefault: addresses.length === 0, ...form };
    const updated = [...addresses, newAddr];
    setAddresses(updated);
    setAddressesState(updated);
    setShowForm(false);
    setForm({ fullName: "", line1: "", city: "", state: "", pincode: "", phone: "" });
    toast.show("Address saved");
  }

  if (loading) return null;

  if (!user) {
    return (
      <Container className="flex flex-col items-center py-32 text-center">
        <p className="font-display text-2xl">You're not logged in</p>
        <p className="mt-2 text-stone-500">Log in to view your profile, orders, and wishlist.</p>
        <Link href="/login">
          <Button className="mt-6" size="lg">
            Log In
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-paper">
          <User size={24} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-medium">{user.name}</h1>
          <p className="text-sm text-stone-500">{user.email}</p>
        </div>
        <Button
          variant="ghost"
          className="ml-auto"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOut size={16} /> Log Out
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/orders" className="flex items-center gap-3 rounded-2xl border border-stone-200 p-5 hover:border-ink">
          <Package size={20} />
          <span className="text-sm font-medium">Order History</span>
        </Link>
        <Link href="/wishlist" className="flex items-center gap-3 rounded-2xl border border-stone-200 p-5 hover:border-ink">
          <Heart size={20} />
          <span className="text-sm font-medium">Wishlist</span>
        </Link>
        <div className="flex items-center gap-3 rounded-2xl border border-stone-200 p-5">
          <MapPin size={20} />
          <span className="text-sm font-medium">{addresses.length} Saved Address(es)</span>
        </div>
      </div>

      <div className="mt-12">
        <SectionHeading
          eyebrow="Delivery"
          title="Saved Addresses"
          action={
            <Button variant="secondary" onClick={() => setShowForm((s) => !s)}>
              {showForm ? "Cancel" : "Add Address"}
            </Button>
          }
        />
        {showForm && (
          <form onSubmit={addAddress} className="mb-6 grid gap-4 rounded-2xl border border-stone-200 p-6 sm:grid-cols-2">
            <div>
              <Label>Full Name</Label>
              <Input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Address</Label>
              <Input required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
            </div>
            <div>
              <Label>City</Label>
              <Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <Label>State</Label>
              <Input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <div>
              <Label>Pincode</Label>
              <Input required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
            </div>
            <Button type="submit" className="sm:col-span-2">
              Save Address
            </Button>
          </form>
        )}
        <div className="space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-2xl border border-stone-200 p-5 text-sm text-stone-600">
              <p className="font-medium text-ink">{a.fullName}</p>
              <p>
                {a.line1}, {a.city}, {a.state} — {a.pincode}
              </p>
              <p>{a.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
