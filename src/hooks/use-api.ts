import { useQuery, useMutation } from "@tanstack/react-query";
import type { Book, Portfolio, InsertBook, InsertPortfolio } from "../../shared/schema";

export const apiRequest = async (method: string, url: string, data?: unknown) => {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "An error occurred");
  }
  return res;
};

export function useBooks() {
  return useQuery<Book[]>({
    queryKey: ["/api/books"],
    queryFn: async () => {
      const res = await fetch("/api/books");
      if (!res.ok) throw new Error("Failed to fetch books");
      return res.json();
    }
  });
}

export function usePortfolio() {
  return useQuery<Portfolio[]>({
    queryKey: ["/api/portfolio"],
    queryFn: async () => {
      const res = await fetch("/api/portfolio");
      if (!res.ok) throw new Error("Failed to fetch portfolio");
      return res.json();
    }
  });
}

export function useCreateBook() {
  return useMutation({
    mutationFn: async (book: InsertBook) => {
      const res = await apiRequest("POST", "/api/books", book);
      return res.json();
    }
  });
}

export function useCreatePortfolio() {
  return useMutation({
    mutationFn: async (item: InsertPortfolio) => {
      const res = await apiRequest("POST", "/api/portfolio", item);
      return res.json();
    }
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Upload failed");
      }
      return res.json();
    }
  });
}
