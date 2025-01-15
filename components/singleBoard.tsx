"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VisionBoard from "./board";

import { fetchGoals } from "@/actions/boards/goals";
import { Board, User } from "@prisma/client";
import { fetchBoardBySlug } from "@/actions/boards/boards";
import Header from "./header";
import { toast } from "sonner";

const SingleBoard = ({ id, user }: { id: string; user: User }) => {
  const [goals, setGoals] = useState<any>(null);
  const [board, setBoard] = useState<any>(null);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const loadGoals = async (id: any) => {
    try {
      startTransition(() => {
        fetchGoals(user?.id, id).then((data) => {
          if (data.success) {
            setGoals(data?.goals);
          } else {
            toast.error("Error fetching goals!");
          }
        });
      });
    } catch (error) {}
  };

  const loadBoard = async () => {
    try {
      fetchBoardBySlug(user.id, id).then((data: any) => {
        if (data.success) {
          const board = data?.board as Board;
          setBoard(board);
          loadGoals(board?.id);
        } else {
          setError(data.error);
          toast.error("Error fetching board details");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadBoard();
  });

  return (
    <main className="flex-1 bg-white">
      <Header title={board?.title} user={user} />

      <header className="flex justify-between items-center pr-20 px-6">
        {/* <Button asChild variant={"outline"}>
          <Link
            href={"/boards"}
            className="font-medium text-lg hover:border-2 border-black"
          >
            Back
          </Link>
        </Button> */}
        {/* <Button asChild variant={"outline"}>
          <Link
            href={`/survey/edit/${params.id}`}
            className="font-medium bg-black w-20 text-white text-lg hover:border-2 border-black"
          >
            Edit
          </Link>
        </Button> */}
      </header>

      <div className="p-6">
        <VisionBoard
          goals={goals}
          setGoals={setGoals}
          boardId={board?.id}
          userId={user?.id}
          isPending={isPending}
        />
      </div>
    </main>
  );
};

export default SingleBoard;
