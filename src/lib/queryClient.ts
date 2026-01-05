import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export async function fetcher<T>({
  queryKey,
}: {
  queryKey: string[];
}): Promise<T> {
  const res = await fetch(queryKey[0]);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}
