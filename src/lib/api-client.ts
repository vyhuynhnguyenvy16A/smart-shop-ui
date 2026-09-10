const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
};

export type UserResponse = {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: string;
};

export type CategoryResponse = {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
};

export type ProductResponse = {
  id: number;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  status: string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function getAccessToken() {
  return typeof window === "undefined" ? null : localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function hasAccessToken() {
  return Boolean(getAccessToken());
}

export function saveAuthTokens(auth: AuthResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken() {
  if (typeof window === "undefined") return false;
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return false;

  const response = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) return false;

  const auth = (await response.json()) as AuthResponse;
  saveAuthTokens(auth);
  return true;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  canRefresh = true,
): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 401 && canRefresh && !path.startsWith("/api/auth/refresh")) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return apiFetch<T>(path, options, false);
    clearAuthTokens();
  }

  if (!response.ok) {
    let message = `API error: ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // Keep the HTTP status when the backend does not return JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function getProductsPage(params?: { page?: number; size?: number; categoryId?: number }) {
  const search = new URLSearchParams();
  if (params?.page !== undefined) search.set("page", String(params.page));
  if (params?.size !== undefined) search.set("size", String(params.size));
  if (params?.categoryId !== undefined) search.set("categoryId", String(params.categoryId));
  const query = search.toString();
  return apiFetch<PageResponse<ProductResponse>>(`/api/products${query ? `?${query}` : ""}`);
}

export async function getProducts(params?: { page?: number; size?: number; categoryId?: number }) {
  const page = await getProductsPage(params);
  return page.content;
}

export function getProductById(id: number) {
  return apiFetch<ProductResponse>(`/api/products/${id}`);
}

export function getCategories() {
  return apiFetch<CategoryResponse[]>("/api/categories");
}
