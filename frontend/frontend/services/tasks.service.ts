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

export type TaskStatus = "PENDING" | "PROCESSING" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
}

export interface TasksResponse {
  data: TaskItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const tasksService = {
  async getTasks(page: number = 1, limit: number = 10): Promise<TasksResponse> {
    const response = await apiClient.get<TasksResponse>("/tasks", {
      params: { page, limit },
    });
    return response.data;
  },

  async getTaskById(id: string): Promise<TaskItem> {
    const response = await apiClient.get<TaskItem>(`/tasks/${id}`);
    return response.data;
  },

  async createTask(payload: CreateTaskPayload): Promise<TaskItem> {
    const response = await apiClient.post<TaskItem>("/tasks", payload);
    return response.data;
  },

  async updateTask(id: string, payload: UpdateTaskPayload): Promise<TaskItem> {
    const response = await apiClient.patch<TaskItem>(`/tasks/${id}`, payload);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },
};
