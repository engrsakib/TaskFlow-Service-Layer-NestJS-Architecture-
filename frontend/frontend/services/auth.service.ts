import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api/v1/";

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AUTH_CHANGED_EVENT = "taskflow-auth-changed";

function emitAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    localStorage.setItem("taskflow-auth-ping", String(Date.now()));
  }
}

// Add authorization header with token from cookies
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken") || localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export const authService = {
  // Login and store token
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", credentials);
    const { accessToken } = response.data;

    // Store token in both localStorage and cookies
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      Cookies.set("accessToken", accessToken, {
        expires: 7,
        sameSite: "Strict",
      });
      emitAuthChanged();
    }

    return response.data;
  },

  // Fetch authenticated user data
  async getAuthMe(): Promise<AuthUser> {
    const response = await axiosInstance.get<AuthUser>("/auth/me");
    return response.data;
  },

  // Logout and clear tokens
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      Cookies.remove("accessToken");
      emitAuthChanged();
    }
  },

  // Get token from storage
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return (
        Cookies.get("accessToken") ||
        localStorage.getItem("accessToken") ||
        null
      );
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
