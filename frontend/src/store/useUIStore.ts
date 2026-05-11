"use client";

import { create } from "zustand";

interface UIState {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  searchQuery: string;
  isSearchOpen: boolean;
  notifications: { id: string; message: string; type: "success" | "error" | "info" }[];
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  toggleSearch: () => void;
  addNotification: (message: string, type?: "success" | "error" | "info") => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "system",
  sidebarOpen: false,
  searchQuery: "",
  isSearchOpen: false,
  notifications: [],
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  addNotification: (message, type = "info") =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: crypto.randomUUID(), message, type },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
