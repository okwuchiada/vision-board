"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit2, Check, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Category } from "@prisma/client";
import { CategoryDisplay } from "@/lib/helper/helper";
import { GoalType, createGoal, updateGoal } from "@/actions/boards/goals";
import { toast } from "sonner";
import Link from "next/link";
import { Progress } from "./ui/progress";
import { hexColors } from "@/lib/helper/constants";
import { EditGoals } from "./boards/edit-goal";
import { AddGoals } from "./boards/add-goal";
const colors = [
  // "bg-blue-100",
  // "bg-green-100",
  // "bg-purple-100",
  // "bg-yellow-100",
  // "bg-pink-100",
  // "bg-orange-100",
  // "bg-pink-200",
  // more
  "bg-blue-100",
  "bg-green-100",
  "bg-purple-100",
  "bg-yellow-100",
  "bg-pink-100",
  "bg-orange-100",
  "bg-pink-200",
  "bg-red-100",
  "bg-teal-100",
  "bg-indigo-100",
  "bg-cyan-100",
  "bg-lime-100",
  "bg-amber-100",
  "bg-rose-100",
  "bg-sky-100",
  "bg-violet-100",
  "bg-emerald-100",
  // "bg-blue-200",
  // "bg-green-200",
  // "bg-purple-200",
  // "bg-yellow-200",
  // "bg-orange-200",
  // "bg-pink-300",
  "bg-fuchsia-100",
  "bg-gray-100",
];

export const ProgressBar = () => {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 90) {
          return 10;
        }
        return oldProgress + 10;
      });
    }, 600);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <Progress value={progress} className="w-full" />;
};

const VisionBoard = ({
  goals,
  setGoals,
  userId,
  boardId,
  isPending,
}: {
  goals: any;
  setGoals: any;
  userId: string;
  isPending: boolean;
  boardId: string;
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState<any>({
    category: null,
    goal: "",
    color: "bg-gray-100",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState({
    add: false,
    delete: null as string | null,
    update: null as string | null,
  });

  const handleAdd = () => {
    if (newGoal.category && newGoal.goal) {
      const goalInput = {
        category: newGoal.category as Category,
        goal: newGoal.goal,
        color: newGoal.color,
      };
      setLoading((prev) => ({ ...prev, add: true }));
      createGoal(userId, boardId, goalInput)
        .then((data) => {
          if (data.success) {
            setGoals((prevGoals: any) => [...prevGoals, data.goal]);
            toast.success("Goal added!");
          } else {
            toast.error(data?.error);
          }
        })
        .finally(() => {
          setLoading((prev) => ({ ...prev, add: false }));
          setNewGoal({ category: null, goal: "", color: "bg-gray-100" });
          setIsAdding(false);
        });
    }
  };

  const handleEdit = (goal: any) => {
    setSelectedGoal(goal);
    setEditing(!editing);
  };

  const handleDelete = (id: any) => {
    console.log(id);
    // deleteGoal(userId, id)
    // .then((data) => {
    //   if (data.success) {
    //     setGoals(goals?.filter((goal: any) => goal.id !== id));
    //     toast.success("Goal deleted!");
    //   } else {
    //     toast.error(data?.error);
    //   }
    // })
    // .catch((error) => {
    //   toast.error("Error deleting goal");
    // });
  };

  const handleUpdate = (id: any, updatedGoal: Partial<GoalType>) => {
    const goalInput: Partial<GoalType> = {
      category: updatedGoal?.category as Category,
      goal: updatedGoal.goal,
      color: updatedGoal.color,
    };

    setLoading((prev) => ({ ...prev, update: id }));

    updateGoal(userId, id, goalInput)
      .then((data) => {
        if (data.success) {
          setGoals((prevGoals: any) =>
            prevGoals.map((goal: any) =>
              goal.id === id ? { ...goal, ...goalInput } : goal
            )
          );
          toast.success("Goal updated!");
        } else {
          toast.error(data?.error);
        }
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, update: null }));
      });
    setEditing(false);
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-xl font-bold mb-4">Loading...</h1>
        <ProgressBar />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <Button asChild variant={"outline"}>
          <Link
            href={"/boards"}
            className="font-medium text-lg hover:border-2 border-black"
          >
            Back
          </Link>
        </Button>
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 flex items-center"
          disabled={loading.add}
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="mr-2" size={20} />
          <span className="font-semibold">Add New Goal</span>
        </Button>
      </div>

      {loading.add && (
        <div className="mt-4">
          <ProgressBar />
        </div>
      )}

      {goals?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-xl font-bold mb-4">No goals yet!</h1>
        </div>
      )}
      
      {goals?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {goals?.map((goal: any) => {
            const category = goal?.category as Category;

            return (
              <div
                key={goal?.id}
                style={{ backgroundColor: goal?.color }}
                className={`${goal?.color} p-4 rounded-lg  shadow relative border-[0.6px] border-transparent hover:border-blue-500`}
              >
                <>
                  <div className="font-semibold mb-2 capitalize">
                    {CategoryDisplay[category]}
                  </div>
                  <div className="">{goal?.goal}</div>
                </>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Edit2 size={16} />
                    {/* {editing === goal.id ? (
                   <Save size={16} />
                 ) : (
                   <Edit2 size={16} />
                 )} */}
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isAdding && (
        <AddGoals
          isModalOpen={isAdding}
          onCancel={() => setIsAdding(false)}
          onSave={handleAdd}
          newGoal={newGoal}
          setNewGoal={setNewGoal}
          colors={colors}
        />
      )}
      {editing && (
        <EditGoals
          goal={selectedGoal}
          isModalOpen={editing}
          onCancel={() => setEditing(false)}
          onSave={handleUpdate}
          colors={colors}
        />
      )}
    </div>
  );
};

export default VisionBoard;


