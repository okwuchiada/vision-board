"use server";

import { db } from "@/lib/prisma_client";
import { NotificationType } from "@prisma/client";
import { addDays, isPast, isToday, differenceInDays } from "date-fns";

export async function checkAndCreateNotifications(userId: any) {
  try {
    // Get all boards for the user
    const boards = await db.board.findMany({
      where: { userId },
      include: {
        notifications: true,
      },
    });

    for (const board of boards) {
      const timelineDate = new Date(board.timeline);
      const today = new Date();
      const daysUntilTimeline = differenceInDays(timelineDate, today);

      // Check for approaching timeline (7 days before)
      if (daysUntilTimeline <= 7 && daysUntilTimeline > 0) {
        const existingApproachingNotification = board.notifications.find(
          (n) => n.type === "TIMELINE_APPROACHING" && !n.isRead
        );

        if (!existingApproachingNotification) {
          await db.notification.create({
            data: {
              userId: userId,
              boardId: board.id,
              type: "TIMELINE_APPROACHING",
              message: `Timeline for "${board.title}" is approaching in ${daysUntilTimeline} days.`,
            },
          });
        }
      }

      // Check for due today
      if (isToday(timelineDate)) {
        const existingDueNotification = board.notifications.find(
          (n) => n.type === "TIMELINE_DUE" && !n.isRead
        );

        if (!existingDueNotification) {
          await db.notification.create({
            data: {
              userId: userId,
              boardId: board.id,
              type: "TIMELINE_DUE",
              message: `Timeline for "${board.title}" is due today!`,
            },
          });
        }
      }

      // Check for overdue
      if (isPast(timelineDate) && !isToday(timelineDate)) {
        const existingOverdueNotification = board.notifications.find(
          (n) => n.type === "TIMELINE_OVERDUE" && !n.isRead
        );

        if (!existingOverdueNotification) {
          await db.notification.create({
            data: {
              userId: userId,
              boardId: board.id,
              type: "TIMELINE_OVERDUE",
              message: `Timeline for "${board.title}" is overdue!`,
            },
          });
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error checking notifications:", error);
    return { error: "Failed to check notifications" };
  }
}

export async function createBoardNotification(
  userId: string,
  boardId: string,
  boardTitle: string
) {
  return db.notification.create({
    data: {
      userId,
      boardId,
      type: NotificationType.BOARD_CREATED,
      message: `New board "${boardTitle}" has been created.`,
    },
  });
}

export async function createGoalNotification(
  userId: string,
  boardId: string,
  goalTitle: string,
  type: NotificationType
) {
  try {
    const board = await db.board.findUnique({
      where: { id: boardId },
      select: { title: true },
    });

    if (!board) {
      throw new Error("Board not found");
    }

    const message =
      type === "GOAL_COMPLETED"
        ? `Goal "${goalTitle}" in "${board.title}" has been completed!`
        : `New goal "${goalTitle}" has been added to "${board.title}".`;

    await db.notification.create({
      data: {
        userId: userId,
        boardId,
        type,
        message,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating goal notification:", error);
    return { error: "Failed to create notification" };
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    await db.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { error: "Failed to mark notification as read" };
  }
}

export async function getUnreadNotifications(userId: string) {
  try {
    const notifications = await db.notification.findMany({
      where: {
        userId: userId,
        isRead: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        board: {
          select: {
            title: true,
            timeline: true,
          },
        },
      },
    });

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function getNotifications(userId: string) {
  try {
    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}

// export async function markNotificationAsRead(
//   userId: string,
//   notificationId: string
// ) {
//   try {
//     const notification = await db.notification.update({
//       where: {
//         id: notificationId,
//         userId,
//       },
//       data: { isRead: true },
//     });

//     return { success: true, notification };
//   } catch (error) {
//     console.error("Error marking notification as read:", error);
//     return { success: false, error: "Failed to mark notification as read" };
//   }
// }
