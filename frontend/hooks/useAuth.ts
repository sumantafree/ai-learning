"use client";

import { create } from "zustand";
import { User } from "@/types";
import { authApi } from "@/lib/api";
import { saveAuth, clearAuth, getStoredUser, getToken } from "@/lib/auth";

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
    level: "beginner" | "intermediate" | "advanced";
    goals?: string;
  }) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
  clearError: () => void;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  loadFromStorage: () => {
    const user = getStoredUser();
    const token = getToken();
    if (user && token) {
      set({ user, token });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.login({ email, password });
      saveAuth(res.access_token, res.user);
      set({ user: res.user, token: res.access_token, isLoading: false });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Login failed";
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.register(data);
      saveAuth(res.access_token, res.user);
      set({ user: res.user, token: res.access_token, isLoading: false });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Registration failed";
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    clearAuth();
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));
