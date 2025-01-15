import { fetchBoards } from "@/actions/boards/boards";
import { BoardFetchOptions } from "@/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "User ID is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const options: Partial<BoardFetchOptions> = {
      page: searchParams.has("page")
        ? Number(searchParams.get("page"))
        : undefined,
      limit: searchParams.has("limit")
        ? Number(searchParams.get("limit"))
        : undefined,
      sortBy:
        (searchParams.get("sortBy") as BoardFetchOptions["sortBy"]) ||
        undefined,
      sortOrder:
        (searchParams.get("sortOrder") as BoardFetchOptions["sortOrder"]) ||
        undefined,
      search: searchParams.get("search") || undefined,
      includeGoals: searchParams.has("includeGoals")
        ? searchParams.get("includeGoals") === "true"
        : undefined,
    };

    const result = await fetchBoards(userId, options);

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
