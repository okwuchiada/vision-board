"use server";

import { z } from "zod";
import { db } from "@/lib/prisma_client";
import { BoardFetchOptionsSchema, BoardSchema } from "@/lib/validation-schema";
import { NotificationType, Prisma } from "@prisma/client";
import { differenceInDays, isPast, isToday } from "date-fns";

export const createBoard = async (
  userId: string,
  data: z.infer<typeof BoardSchema>
) => {
  const validatedData = BoardSchema.parse(data);

  try {
    const user = db.user.findUnique({
      where: { id: userId },
    });
    if (!user) return { error: "User not found" };

    const board = await db.board.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    await db.notification.create({
      data: {
        userId,
        boardId: board?.id,
        type: NotificationType.BOARD_CREATED,
        message: `New board "${board.title}" has been created.`,
      },
    });

    return { success: true, board };
  } catch (error) {
    console.error("Error creating board:", error);
    return { success: false, error: "Failed to create board" };
  }
};

export async function updateBoard(
  boardId: string,
  userId: string,
  data: Partial<z.infer<typeof BoardSchema>>
) {
  try {
    // Verify board ownership
    const existingBoard = await db.board.findFirst({
      where: { id: boardId, userId },
    });

    if (!existingBoard) {
      return { success: false, error: "Board not found or unauthorized" };
    }

    const validatedData = BoardSchema.partial().parse(data);

    const updatedBoard = await db.board.update({
      where: { id: boardId },
      data: validatedData,
    });

    return { success: true, board: updatedBoard };
  } catch (error) {
    console.error("Error updating board:", error);
    return { success: false, error: "Failed to update board" };
  }
}

export async function getBoards(
  userId: any,
  options?: Partial<z.infer<typeof BoardFetchOptionsSchema>>
) {
  const validatedOptions = BoardFetchOptionsSchema.parse(options || {});

  const { page, limit, sortBy, sortOrder, search, includeGoals } =
    validatedOptions;
  if (!userId?.trim()) {
    return {
      success: false,
      error: "User ID is required",
    };
  }

  const skip = (page - 1) * limit;

  const where: Prisma.BoardWhereInput = {
    userId,
    ...(search?.trim()
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          ],
        }
      : {}),
  };

  try {
    const boards = await db.board.findMany({
      where,
      include: {
        boardGoal: includeGoals,
        // notifications: true,
        // user: {
        //   select: {
        //     username: true,
        //     first_name: true,
        //     last_name: true,
        //   },
        // },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });
    const totalCount = await db.board.count({ where });
    return { success: true, boards, totalCount };
  } catch (error) {
    return { success: false, error: "An error cccured" + error };
  }
}

// New Fetch Functions
export async function fetchBoards(
  userId: string,
  options?: Partial<z.infer<typeof BoardFetchOptionsSchema>>
) {
  if (!userId?.trim()) {
    return {
      success: false,
      error: "User ID is required",
    };
  }

  try {
    const validatedOptions = BoardFetchOptionsSchema.parse(options || {});

    const { page, limit, sortBy, sortOrder, search, includeGoals } =
      validatedOptions;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.BoardWhereInput = {
      userId,
      ...(search?.trim()
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
            ],
          }
        : {}),
    };

    // Fetch total count for pagination
    const totalCount = await db.board.count({ where });

    // Fetch boards
    const boards = await db.board.findMany({
      where,
      include: {
        boardGoal: includeGoals,
        notifications: true,
        user: {
          select: {
            username: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    // const [totalCount, boards] = await Promise.all([
    //   db.board.count({ where }),
    //   db.board.findMany({
    //     where,
    //     include: {
    //       boardGoal: includeGoals,
    //       notifications: true,
    //       user: {
    //         select: {
    //           username: true,
    //           first_name: true,
    //           last_name: true,
    //         },
    //       },
    //     },
    //     orderBy: {
    //       [sortBy]: sortOrder,
    //     },
    //     skip,
    //     take: limit,
    //   }),
    // ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: {
        boards,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching boards:", error);

    // Return a user-friendly error message
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Invalid options provided: " +
          error.errors.map((e) => e.message).join(", "),
      };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        success: false,
        error: "Database error: " + error.message,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred while fetching boards",
    };
  }
}

export async function fetchBoardById(
  userId: string,
  boardId: string,
  includeGoals: boolean = true
) {
  if (!userId?.trim()) {
    return {
      success: false,
      error: "User ID is required",
    };
  }
  try {
    const board = await db.board.findFirst({
      where: {
        id: boardId,
        userId,
      },
      include: {
        boardGoal: includeGoals,
        notifications: true,
        user: {
          select: {
            username: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!board) {
      return { success: false, error: "Board not found or unauthorized" };
    }

    return { success: true, board };
  } catch (error) {
    console.error("Error fetching board:", error);
    return { success: false, error: "Failed to fetch board" };
  }
}
export async function fetchBoardBySlug(userId: string, slug: string) {
  if (!userId?.trim()) {
    return {
      success: false,
      error: "User ID is required",
    };
  }
  try {
    const board = await db.board.findFirst({
      where: { slug, userId },
    });
    if (!board) {
      return { success: false, error: "Board not found or unauthorized" };
    }

    return { success: true, board };
  } catch (error) {
    console.error("Error fetching board:", error);
    return { success: false, error: "Failed to fetch board" };
  }
}

// Enhanced board creation function
export const createBoardWithNotification = async (
  userId: string,
  data: z.infer<typeof BoardSchema>
) => {
  if (!userId?.trim()) {
    return { success: false, error: "User ID is required" };
  }

  try {
    // Validate the input data
    const validatedData = BoardSchema.parse(data);

    // Check if user exists - using findUnique with await
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Use a transaction to ensure both board and notification are created
    // const result = await db.$transaction(async (tx) => {
    //   // Create the board
    //   const board = await tx.board.create({
    //     data: {
    //       ...validatedData,
    //       userId,
    //     },
    //   });

    //   // Create the initial board creation notification
    //   await tx.notification.create({
    //     data: {
    //       userId,
    //       boardId: board.id,
    //       type: NotificationType.BOARD_CREATED,
    //       message: `New board "${board.title}" has been created.`,
    //     },
    //   });

    //   return board;
    // });
    const board = await db.board.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    await db.notification.create({
      data: {
        userId,
        boardId: board?.id,
        type: NotificationType.BOARD_CREATED,
        message: `New board "${board.title}" has been created.`,
      },
    });

    return { success: true, board };
  } catch (error) {
    console.error("Error creating board:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Invalid board data: " +
          error.errors.map((e) => e.message).join(", "),
      };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        success: false,
        error: "Database error: " + error.message,
      };
    }

    return { success: false, error: "Failed to create board" };
  }
};
