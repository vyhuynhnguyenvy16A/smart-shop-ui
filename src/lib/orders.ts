export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
  "cancelled",
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipping: "Shipping",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-primary/10 text-primary",
  shipping: "bg-primary/10 text-primary",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: { title: string; variant: string; qty: number; price: number }[];
};

export const ORDERS: Order[] = [
  {
    id: "NL-10241",
    customer: "Mai Tran",
    email: "mai@example.com",
    date: "2026-09-02",
    total: 368,
    status: "shipping",
    items: [
      { title: "Studio Wireless Noise-Cancelling Headphones", variant: "Black", qty: 1, price: 249 },
      { title: "Daily Canvas Commuter Backpack", variant: "Olive", qty: 1, price: 89 },
    ],
  },
  {
    id: "NL-10238",
    customer: "David Le",
    email: "david@example.com",
    date: "2026-08-28",
    total: 119,
    status: "delivered",
    items: [{ title: "Aero Everyday Running Sneakers", variant: "White / 42", qty: 1, price: 119 }],
  },
  {
    id: "NL-10233",
    customer: "Sara Kim",
    email: "sara@example.com",
    date: "2026-08-21",
    total: 159,
    status: "pending",
    items: [{ title: "Minimal Steel Mesh Watch", variant: "Silver", qty: 1, price: 159 }],
  },
  {
    id: "NL-10229",
    customer: "Long Nguyen",
    email: "long@example.com",
    date: "2026-08-14",
    total: 139,
    status: "cancelled",
    items: [{ title: "Aero Trail All-Terrain Sneakers", variant: "Black / 43", qty: 1, price: 139 }],
  },
];

export function StatusBadgeClass(status: OrderStatus) {
  return `inline-flex items-center rounded-md px-2 py-1 text-sm font-semibold ${STATUS_CLASS[status]}`;
}
