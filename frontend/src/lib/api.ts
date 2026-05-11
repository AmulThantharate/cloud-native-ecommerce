import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const userApi = {
  signup: (data: any) => apiClient.post("/users/signup", data),
  login: (data: any) => apiClient.post("/users/login", data),
  profile: () => apiClient.get("/users/profile"),
  updateProfile: (data: any) => apiClient.put("/users/profile", data),
};

export const productApi = {
  list: (params?: any) => apiClient.get("/products", { params }),
  get: (id: string) => apiClient.get(`/products/${id}`),
  search: (query: string) => apiClient.get("/products/search", { params: { q: query } }),
  categories: () => apiClient.get("/categories"),
};

export const cartApi = {
  get: () => apiClient.get("/cart"),
  add: (data: any) => apiClient.post("/cart/items", data),
  update: (id: string, data: any) => apiClient.put(`/cart/items/${id}`, data),
  remove: (id: string) => apiClient.delete(`/cart/items/${id}`),
  clear: () => apiClient.delete("/cart"),
};

export const orderApi = {
  create: (data: any) => apiClient.post("/orders", data),
  list: () => apiClient.get("/orders"),
  get: (id: string) => apiClient.get(`/orders/${id}`),
  track: (id: string) => apiClient.get(`/orders/${id}/track`),
};

export const paymentApi = {
  createIntent: (data: any) => apiClient.post("/payments/intent", data),
  confirm: (id: string) => apiClient.post(`/payments/${id}/confirm`),
};
