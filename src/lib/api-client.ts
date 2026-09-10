const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";
const DEVICE_ID_KEY = "deviceId";

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

export type CartItemResponse = {
  id: number;
  variantId: number;
  productName: string;
  sku: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type CartResponse = {
  id: number;
  items: CartItemResponse[];
  totalAmount: number;
};

export type OrderItemResponse = {
  id: number;
  productNameSnapshot: string;
  skuSnapshot: string;
  sizeSnapshot: string;
  colorSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  subtotal: number;
};

export type OrderResponse = {
  id: number;
  status: string;
  totalAmount: number;
  shippingRecipientName: string;
  shippingPhone: string;
  shippingAddressLine: string;
  shippingCity: string;
  items: OrderItemResponse[];
  createdAt: string;
};

export type ApiError = Error & { status?: number };

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

export function getDeviceId() {
  if (typeof window === "undefined") return "server";
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;
  const deviceId = crypto.randomUUID();
  localStorage.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
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
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 401 && canRefresh && !path.startsWith("/api/auth/refresh")) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return apiFetch<T>(path, options, false);
    clearAuthTokens();
    if (typeof window !== "undefined" && window.location.pathname !== "/auth") {
      window.location.assign("/auth");
    }
  }

  if (!response.ok) {
    let message =
      response.status === 409
        ? "This item is no longer available in the requested quantity."
        : response.status === 400
          ? "Please check the information and try again."
          : response.status === 403
            ? "You do not have permission to perform this action."
            : response.status === 404
              ? "The requested resource was not found."
              : "Something went wrong. Please try again.";
    try {
      const body = (await response.json()) as { message?: string; detail?: string; title?: string };
      if (body.message || body.detail)
        message = body.message ?? body.detail ?? body.title ?? message;
    } catch {
      // Keep the friendly status message when the backend does not return JSON.
    }
    const error = new Error(message) as ApiError;
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function getProductsPage(params?: {
  page?: number;
  size?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDirection?: string;
}) {
  const search = new URLSearchParams();
  if (params?.page !== undefined) search.set("page", String(params.page));
  if (params?.size !== undefined) search.set("size", String(params.size));
  if (params?.categoryId !== undefined) search.set("categoryId", String(params.categoryId));
  if (params?.minPrice !== undefined) search.set("minPrice", String(params.minPrice));
  if (params?.maxPrice !== undefined) search.set("maxPrice", String(params.maxPrice));
  if (params?.sortBy !== undefined) search.set("sortBy", params.sortBy);
  if (params?.sortDirection !== undefined) search.set("sortDirection", params.sortDirection);
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

export function registerUser(body: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}) {
  return apiFetch<UserResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function loginUser(body: { email: string; password: string }) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    headers: { "X-Device-Id": getDeviceId() },
    body: JSON.stringify(body),
  });
}

export function logoutUser() {
  const refreshToken =
    typeof window === "undefined" ? null : localStorage.getItem(REFRESH_TOKEN_KEY);
  return apiFetch<void>("/api/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export function getCurrentUser() {
  return apiFetch<UserResponse>("/api/users/me");
}

export function getCart() {
  return apiFetch<CartResponse>("/api/cart");
}

export function addCartItem(variantId: number, quantity = 1) {
  return apiFetch<CartResponse>("/api/cart", {
    method: "POST",
    body: JSON.stringify({ variantId, quantity }),
  });
}

export function updateCartItem(itemId: number, quantity: number) {
  return apiFetch<CartResponse>(`/api/cart/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export function deleteCartItem(itemId: number) {
  return apiFetch<void>(`/api/cart/${itemId}`, { method: "DELETE" });
}

export function createOrder(body: {
  shippingRecipientName: string;
  shippingPhone: string;
  shippingAddressLine: string;
  shippingCity: string;
}) {
  return apiFetch<OrderResponse>("/api/orders", {
    method: "POST",
    headers: { "Idempotency-Key": crypto.randomUUID() },
    body: JSON.stringify(body),
  });
}

export function getOrders(params?: { page?: number; size?: number }) {
  const search = new URLSearchParams();
  if (params?.page !== undefined) search.set("page", String(params.page));
  if (params?.size !== undefined) search.set("size", String(params.size));
  const query = search.toString();
  return apiFetch<PageResponse<OrderResponse>>(`/api/orders${query ? `?${query}` : ""}`);
}

export function getOrderById(id: number) {
  return apiFetch<OrderResponse>(`/api/orders/${id}`);
}
