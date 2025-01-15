"use server";

import { z } from "zod";
import { GoalSchema } from "@/lib/validation-schema";
import { db } from "@/lib/prisma_client";
import { NotificationType } from "@prisma/client";

export async function createGoal(
  userId: string,
  boardId: string,
  data: z.infer<typeof GoalSchema>
) {
  try {
    const board = await db.board.findFirst({
      where: { id: boardId, userId },
    });
    if (!board) {
      return { success: false, error: "Board not found or unauthorized" };
    }
    const validatedData = GoalSchema.parse(data);

    const result = await db.$transaction(async (tx) => {
      const goal = await tx.boardGoal.create({
        data: {
          ...validatedData,
          boardId,
          userId,
        },
      });

      // Create notification for goal creation
      await tx.notification.create({
        data: {
          userId,
          goalId: goal.id,
          type: NotificationType.GOAL_ADDED,
          message: `New goal added: ${validatedData.goal} in ${board.title}`,
        },
      });

      return goal;
    });

    return { success: true, goal: result };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { success: false, error: "Failed to create goal" };
  }
}
export type GoalType = z.infer<typeof GoalSchema>;


export async function updateGoal(
  userId: string,
  goalId: string,
  data: Partial<GoalType>
) {
  try {
    // Verify goal ownership
    const existingGoal = await db.boardGoal.findFirst({
      where: { id: goalId, userId },
    });

    if (!existingGoal) {
      return { success: false, error: "Goal not found or unauthorized" };
    }

    const validatedData = GoalSchema.partial().parse(data);

    const updatedGoal = await db.boardGoal.update({
      where: { id: goalId },
      data: validatedData,
    });

    return { success: true, goal: updatedGoal };
  } catch (error) {
    console.error("Error updating goal:", error);
    return { success: false, error: "Failed to update goal" };
  }
}

export async function fetchGoals(userId: any, boardId: string) {
  if (!userId?.trim()) {
    return {
      success: false,
      error: "User ID is required",
    };
  }

  try {
    const goals = await db.boardGoal.findMany({
      where: { userId, boardId },
    });
    return { success: true, goals };
  } catch (error) {
    return { success: false, error: "An error cccured" };
  }
}
