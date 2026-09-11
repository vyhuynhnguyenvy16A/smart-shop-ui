import headphones from "@/assets/p-headphones.jpg";
import sneakers from "@/assets/p-sneakers.jpg";
import backpack from "@/assets/p-backpack.jpg";
import watch from "@/assets/p-watch.jpg";
import {
  getCategories,
  getProductById as fetchProductById,
  getProductsPage as fetchProductsPage,
  type CategoryResponse,
  type ProductResponse,
} from "./api-client";

export type Product = ProductResponse & {
  title: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  stock: "in" | "low" | "out";
  badge?: string;
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

const categoryImages: Record<string, string> = {
  audio: headphones,
  footwear: sneakers,
  bags: backpack,
  watches: watch,
};

function imageForProduct(product: ProductResponse) {
  const category = product.categoryName.toLowerCase();
  return Object.entries(categoryImages).find(([key]) => category.includes(key))?.[1] ?? headphones;
}

export function adaptProduct(product: ProductResponse): Product {
  const status = product.status.toLowerCase();
  return {
    ...product,
    title: product.name,
    price: product.basePrice,
    rating: 0,
    reviews: 0,
    image: imageForProduct(product),
    category: product.categoryName,
    stock: status.includes("out") || status.includes("inactive") ? "out" : "in",
  };
}

export async function getProductsPage(params?: {
  page?: number;
  size?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDirection?: string;
}) {
  const page = await fetchProductsPage(params);
  return { ...page, content: page.content.map(adaptProduct) };
}

export async function getProducts(params?: Parameters<typeof getProductsPage>[0]) {
  const page = await getProductsPage(params);
  return page.content;
}

export async function getProductById(id: number) {
  return adaptProduct(await fetchProductById(id));
}

export async function getProductBySlug(slug: string) {
  const page = await getProductsPage({ page: 0, size: 100 });
  return page.content.find((product) => product.slug === slug);
}

export async function getProductCategories(): Promise<CategoryResponse[]> {
  return getCategories();
}

export const formatPrice = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const FREE_SHIPPING_THRESHOLD = 50;
