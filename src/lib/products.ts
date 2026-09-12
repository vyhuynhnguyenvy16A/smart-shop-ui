import headphones from "@/assets/p-headphones.jpg";
import sneakers from "@/assets/p-sneakers.jpg";
import backpack from "@/assets/p-backpack.jpg";
import watch from "@/assets/p-watch.jpg";
import {
  getCategories,
  getProductById as fetchProductById,
  getProductBySlugRaw,
  getProductsPage as fetchProductsPage,
  type CategoryResponse,
  type ProductResponse,
  type VariantResponse,
} from "./api-client";

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  title: string;
  price: number;
  compareAt: number | null;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  categoryId: number;
  stock: "in" | "low" | "out";
  badge: string | null;
  variants: VariantResponse[];
  colors: string[];
  sizes: string[];
  createdAt: string;
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

export const productImages: Record<string, string> = {
  headphones,
  footwear: sneakers,
  bags: backpack,
  watches: watch,
};

export function imageForKey(key: string | undefined) {
  return productImages[key ?? "headphones"] ?? headphones;
}

export function adaptProduct(product: ProductResponse): Product {
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    title: product.name,
    price: product.basePrice,
    compareAt: product.compareAtPrice,
    rating: product.rating,
    reviews: product.reviewsCount,
    image: imageForKey(product.imageKey),
    category: product.categoryName,
    categoryId: product.categoryId,
    stock: totalStock === 0 ? "out" : totalStock < 15 ? "low" : "in",
    badge: product.badge,
    variants: product.variants,
    colors: [...new Set(product.variants.map((v) => v.color))],
    sizes: [...new Set(product.variants.map((v) => v.size))],
    createdAt: product.createdAt,
  };
}

export async function getProductsPage(params?: Parameters<typeof fetchProductsPage>[0]) {
  const page = await fetchProductsPage(params);
  return { ...page, content: page.content.map(adaptProduct) };
}

export async function getProducts(params?: Parameters<typeof fetchProductsPage>[0]) {
  return (await getProductsPage(params)).content;
}

export async function getProductById(id: number) {
  const product = await fetchProductById(id);
  return product ? adaptProduct(product) : undefined;
}

export async function getProductBySlug(slug: string) {
  const product = await getProductBySlugRaw(slug);
  return product ? adaptProduct(product) : undefined;
}

export function findVariant(product: Product, color: string, size: string) {
  return product.variants.find((v) => v.color === color && v.size === size);
}

export async function getProductCategories(): Promise<CategoryResponse[]> {
  return getCategories();
}

export const formatPrice = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_FEE = 6;
