import { useState } from "react";
import { BoardFetchOptions } from "@/types";
import { useQuery } from "@tanstack/react-query";

// Client-side hook
interface UseBoardsOptions {
  initialPage?: number;
  initialSearch?: string;
}

export function useBoards(userId: string, options: UseBoardsOptions = {}) {
  const [page, setPage] = useState(options.initialPage ?? 1);
  const [search, setSearch] = useState(options.initialSearch ?? "");

  const queryOptions: Partial<BoardFetchOptions> = {
    page,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: search || undefined,
    includeGoals: true,
  };

  const queryKey = ["boards", userId, queryOptions];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams({
        userId,
        ...Object.entries(queryOptions).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>),
      });

      const response = await fetch(`/api/boards?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch boards");
      }
      return response.json();
    },
  });

  return {
    boards: data?.data?.boards ?? [],
    pagination: data?.data?.pagination,
    isLoading,
    error,
    setPage,
    setSearch,
    refetch,
    currentPage: page,
  };
}
