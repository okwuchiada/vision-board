"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { calculateTimeline, makeSlug } from "@/lib/helper/helper";
import { suggestedTimelines } from "@/lib/helper/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createBoard, getBoards } from "@/actions/boards/boards";
import { Board, User } from "@prisma/client";
import { toast } from "sonner";
import { LoadingSpinner } from "./loader";
import Header from "./header";
import { ProgressBar } from "./board";

const Boards = ({ user }: { user: User }) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [isAddingNew, startAddTransition] = useTransition();
  const [newBoard, setNewBoard] = useState({
    description: "",
    title: "",
    timeline: "",
    slug: "",
  });

  // const loadBoards = async () => {
  //   try {
  //     startTransition(() => {
  //       getBoards(user.id).then((data: any) => {
  //         if (data.success) {
  //           const boards = data?.boards as Board[];

  //           setBoards(boards);
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
            const boards = data?.boards as Board[];
            setBoards(boards);
          } else {
            setError(data.error);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }, [user?.id]);


  const handleAdd = () => {
    if (newBoard.title && newBoard.description) {
      const toSlug: string = makeSlug(newBoard.title);
      startAddTransition(() => {
        createBoard(user?.id, { ...newBoard, slug: toSlug })
          .then((data) => {
            if (data.success) {
              toast.success("Board added!");
            } else {
              toast.error("Failed to create board");
            }
          })
          .finally(() => {
            loadBoards();
          });
      });
      setNewBoard({ description: "", title: "", timeline: "", slug: "" });
      setIsAdding(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  // if (isPending && state.adding) {
  //   return <LoadingSpinner text="Adding board..." />;
  // }
  return (
    <main className="flex-1 bg-white">
      <Header user={user} title="boards" />

      <div className="p-6">
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 flex items-center"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="mr-2" size={20} />
          <span className="font-semibold">Add Board</span>
        </Button>

        {isAddingNew && <LoadingSpinner text="Adding board..." />}

        {isPending ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-xl font-bold mb-4">Loading...</h1>
            <ProgressBar />
          </div>
        ) : (
          <div>
            {boards.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {boards.map((board, index) => (
                  <BoardCard board={board} key={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-xl font-bold mb-4">No boards yet!</h1>
              </div>
            )}
          </div>
        )}
      </div>
      {isAdding && (
        <AddBoard
          isModalOpen={isAdding}
          onCancel={() => setIsAdding(false)}
          onSave={handleAdd}
          newBoard={newBoard}
          setNewBoard={setNewBoard}
        />
      )}
    </main>
  );
};

export default Boards;

const AddBoard = ({
  isModalOpen,
  newBoard,
  onSave,
  setNewBoard,
  onCancel,
}: {
  isModalOpen: boolean;
  onCancel: any;
  onSave: any;
  newBoard: any;
  setNewBoard: any;
}) => {
  const handleSave = () => {
    onSave();
  };

  if (!isModalOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-1/2 p-6 ">
        <div className="space-y-7">
          <h3 className="text-xl text-center font-semibold">Add new board</h3>
          <div>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Board name"
                value={newBoard.title}
                onChange={(e: any) =>
                  setNewBoard({ ...newBoard, title: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Board description"
                value={newBoard.description}
                onChange={(e: any) =>
                  setNewBoard({ ...newBoard, description: e.target.value })
                }
              />
            </div>
            <div className="mt-4">
              <Select
                onValueChange={(value) =>
                  setNewBoard({
                    ...newBoard, // Preserve existing state
                    timeline: value, // Update only the category
                  })
                }
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select Board Timeline" />
                </SelectTrigger>
                <SelectContent>
                  {suggestedTimelines.map((timeline) => (
                    <SelectItem key={timeline.value} value={timeline.value}>
                      {timeline.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex w-full items-center space-x-5 justify-between">
            <Button
              onClick={handleSave}
              className="px-6 py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:text-white"
            >
              Add
            </Button>
            <Button
              onClick={onCancel}
              className="px-6 py-2 w-full bg-[#F2F2F7] text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function BoardCard({ board }: { board: any }) {
  return (
    <Link
      href={`/boards/${board?.slug}`}
      className="bg-white border-2 p-6 rounded-lg shadow-md hover:border-orange-400 transition-all duration-300 ease-in-out"
    >
      <h3 className="text-xl font-semibold text-blue-500">{board?.title}</h3>
      <p className="mt-2 text-gray-600">{board?.description}</p>
      <p className="mt-4 text-gray-500 text-sm">
        {calculateTimeline(board.createdAt)}
      </p>
    </Link>
  );
}
