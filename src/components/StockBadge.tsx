import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function StockBadge({ stock, className }: { stock: Product["stock"]; className?: string }) {
  const map = {
    in: { label: "In Stock", cls: "bg-success/10 text-success" },
    low: { label: "Low Stock", cls: "bg-warning/10 text-warning" },
    out: { label: "Out of Stock", cls: "bg-destructive/10 text-destructive" },
  } as const;
  const { label, cls } = map[stock];
  return (
    <span
      className={cn("inline-flex items-center rounded-md px-2 py-1 text-sm font-semibold", cls, className)}
    >
      {label}
    </span>
  );
}
