import { useSyncExternalStore } from "react";
import { products, type Product } from "./products";

export type CartLine = { id: string; qty: number };

const KEY = "shop-cart-v1";
let lines: CartLine[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* ignore */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) lines = JSON.parse(raw) as CartLine[];
  } catch {
    /* ignore */
  }
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  cb();
  return () => listeners.delete(cb);
}

const EMPTY: CartLine[] = [];

export function useCart() {
  return useSyncExternalStore(
    subscribe,
    () => lines,
    () => EMPTY,
  );
}

export function addToCart(id: string, qty = 1) {
  hydrate();
  const existing = lines.find((l) => l.id === id);
  lines = existing
    ? lines.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l))
    : [...lines, { id, qty }];
  persist();
  emit();
}

export function setQty(id: string, qty: number) {
  lines = qty <= 0 ? lines.filter((l) => l.id !== id) : lines.map((l) => (l.id === id ? { ...l, qty } : l));
  persist();
  emit();
}

export function removeFromCart(id: string) {
  setQty(id, 0);
}

export function clearCart() {
  lines = [];
  persist();
  emit();
}

export type CartItem = { product: Product; qty: number };

export function detailedCart(cart: CartLine[]): CartItem[] {
  return cart
    .map((l) => {
      const product = products.find((p) => p.id === l.id);
      return product ? { product, qty: l.qty } : null;
    })
    .filter(Boolean) as CartItem[];
}

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { subtotal, count };
}
