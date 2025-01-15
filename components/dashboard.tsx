"use client";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { BoardCard } from "./boards";
import Header from "./header";
import { Board, User } from "@prisma/client";
import { getTopRecentItems } from "@/lib/helper/helper";
import { getBoards } from "@/actions/boards/boards";
import { ProgressBar } from "./board";

const Dashboard = ({ user }: { user: User }) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  // const loadBoards = async () => {
  //   try {
  //     startTransition(() => {
  //       getBoards(user.id).then((data: any) => {
  //         if (data.success) {
  //           const topRecent = getTopRecentItems(data.boards, "createdAt");
  //           setBoards(topRecent);
  //         } else {
  //           setError(data.error);
  //         }

  //       });
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const loadBoards = useCallback(async () => {
    try {
      startTransition(() => {
        getBoards(user.id).then((data: any) => {
          if (data.success) {
            const topRecent = getTopRecentItems(data.boards, "createdAt");
            setBoards(topRecent);
          } else {
            setError(data.error);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  // if (isPending) {
  //   return (

  //   );
  // }

  return (
    <main className="flex-1 bg-white">
      <Header title="dashboard" user={user as User} />

      <section className="mt-8 p-6">
        <h2 className="text-2xl font-semibold text-blue-600">Latest Boards</h2>
        {isPending ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-xl font-bold mb-4">Loading...</h1>
            <ProgressBar />
          </div>
        ) : (
          <div>
            {boards.length > 0 ? (
              <div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {boards?.map((board, index) => (
                    <BoardCard board={board} key={index} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-xl font-bold mb-4">No boards yet!</h1>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
