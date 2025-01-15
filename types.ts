import { Board } from "@prisma/client";

export interface BoardFetchOptions {
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "updatedAt" | "title";
    sortOrder?: "asc" | "desc";
    search?: string;
    includeGoals?: boolean;
  }
  
  interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  
  export interface BoardResponse {
    success: boolean;
    data?: {
      boards: Board[];
      pagination: PaginationData;
    };
    error?: string;
  }