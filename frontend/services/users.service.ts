import axios, { AxiosInstance } from "axios";
import { authService } from "@/services/auth.service";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api/v1/";

const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UserItem {
  id: string;
  name: string | null;
  email: string;
  phone?: string | null;
  role: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserPayload {
  name: string;
  phone: string;
}

export interface UpdateUserRolePayload {
  role: "USER" | "ADMIN";
}

export const usersService = {
  async getUsers(): Promise<UserItem[]> {
    const response = await apiClient.get<UserItem[]>("/users");
    return response.data;
  },

  async getUserById(id: string): Promise<UserItem> {
    const response = await apiClient.get<UserItem>(`/users/${id}`);
    return response.data;
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<UserItem> {
    const response = await apiClient.patch<UserItem>(`/users/${id}`, payload);
    return response.data;
  },

  async updateUserRole(
    id: string,
    payload: UpdateUserRolePayload,
  ): Promise<UserItem> {
    const response = await apiClient.patch<UserItem>(
      `/users/${id}/role`,
      payload,
    );
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
