export type Category =
  | "men"
  | "women"
  | "oversized"
  | "hoodies"
  | "t-shirts"
  | "sneakers"
  | "accessories";

export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  tags: string[];
  price: number;
  compareAtPrice?: number;
  currency: "INR";
  colors: { name: string; hex: string }[];
  sizes: string[];
  variants: ProductVariant[];
  images: { gradient: string; label: string }[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isFlashSale: boolean;
  isBestSeller: boolean;
  status: "published" | "draft" | "hidden";
  createdAt: string;
}

export interface CartLine {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export type OrderStatus =
  | "placed"
  | "accepted"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  address: Address;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: "cod";
  paymentStatus: "pending" | "paid";
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minPurchase: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  gradient: string;
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  joinedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
}
