"use client";

import { useEffect, useState } from "react";
import { authService, AuthUser, AUTH_CHANGED_EVENT } from "@/services/auth.service";

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
  refetch: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      if (!authService.isAuthenticated()) {
        setUser(null);
        setError(null);
        return;
      }

      const userData = await authService.getAuthMe();
      setUser(userData);
      setError(null);
    } catch (err: unknown) {
      const parsedError = err as { message?: string };
      setUser(null);
      setError(parsedError?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(true);

    const handleAuthChanged = () => {
      fetchUser(false);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "taskflow-auth-ping" || event.key === "accessToken") {
        fetchUser(false);
      }
    };

    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return { user, loading, error, logout, refetch: () => fetchUser(false) };
}
