import headphones from "@/assets/p-headphones.jpg";
import sneakers from "@/assets/p-sneakers.jpg";
import backpack from "@/assets/p-backpack.jpg";
import watch from "@/assets/p-watch.jpg";

export type Product = {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  stock: "in" | "low" | "out";
  badge?: string;
  description: string;
};

export const CATEGORIES = [
  "Audio",
  "Footwear",
  "Bags",
  "Watches",
  "Home",
  "Fitness",
  "Deals",
] as const;

export const products: Product[] = [
  {
    id: "1",
    slug: "studio-wireless-headphones",
    title: "Studio Wireless Noise-Cancelling Headphones",
    price: 249,
    compareAt: 329,
    rating: 4.8,
    reviews: 1284,
    image: headphones,
    category: "Audio",
    stock: "in",
    badge: "Best Seller",
    description:
      "40-hour battery, adaptive noise cancelling and memory-foam ear cushions built for long listening sessions.",
  },
  {
    id: "2",
    slug: "aero-running-sneakers",
    title: "Aero Everyday Running Sneakers",
    price: 119,
    rating: 4.6,
    reviews: 842,
    image: sneakers,
    category: "Footwear",
    stock: "low",
    badge: "Verified Buyer Favourite",
    description:
      "Breathable knit upper with a responsive foam midsole that keeps its bounce mile after mile.",
  },
  {
    id: "3",
    slug: "daily-canvas-backpack",
    title: "Daily Canvas Commuter Backpack",
    price: 89,
    compareAt: 110,
    rating: 4.7,
    reviews: 512,
    image: backpack,
    category: "Bags",
    stock: "in",
    badge: "Eco-Friendly",
    description:
      "Water-resistant recycled canvas, padded 16-inch laptop sleeve and a hidden security pocket.",
  },
  {
    id: "4",
    slug: "minimal-mesh-watch",
    title: "Minimal Steel Mesh Watch",
    price: 159,
    rating: 4.5,
    reviews: 306,
    image: watch,
    category: "Watches",
    stock: "in",
    description:
      "Sapphire crystal, 5 ATM water resistance and a brushed steel mesh band that fits any wrist.",
  },
  {
    id: "5",
    slug: "studio-headphones-lite",
    title: "Studio Lite On-Ear Headphones",
    price: 129,
    rating: 4.3,
    reviews: 198,
    image: headphones,
    category: "Audio",
    stock: "out",
    description: "The lighter Studio, tuned for balanced everyday listening.",
  },
  {
    id: "6",
    slug: "aero-trail-sneakers",
    title: "Aero Trail All-Terrain Sneakers",
    price: 139,
    compareAt: 169,
    rating: 4.4,
    reviews: 271,
    image: sneakers,
    category: "Footwear",
    stock: "in",
    badge: "Sale",
    description: "Grippy lugged outsole and a reinforced toe cap for rough ground.",
  },
  {
    id: "7",
    slug: "canvas-weekender",
    title: "Canvas Weekender Duffel",
    price: 129,
    rating: 4.6,
    reviews: 143,
    image: backpack,
    category: "Bags",
    stock: "low",
    description: "Cabin-sized duffel with a shoe compartment and detachable strap.",
  },
  {
    id: "8",
    slug: "mesh-watch-noir",
    title: "Mesh Watch Noir Edition",
    price: 179,
    rating: 4.9,
    reviews: 88,
    image: watch,
    category: "Watches",
    stock: "in",
    badge: "New",
    description: "Blacked-out case and dial with a matching mesh bracelet.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const formatPrice = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const FREE_SHIPPING_THRESHOLD = 50;
