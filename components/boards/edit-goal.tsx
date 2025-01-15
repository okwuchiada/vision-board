import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { hexColors } from "@/lib/helper/constants";
import { Input } from "../ui/input";
import { CategoryDisplay } from "@/lib/helper/helper";
import { Category } from "@prisma/client";
import { Check } from "lucide-react";

export const EditGoals = ({
  isModalOpen,
  onSave,
  goal,
  colors,
  onCancel,
}: {
  goal: any;
  isModalOpen: any;
  onCancel: any;
  onSave: any;
  colors: any;
}) => {
  const [editedGoal, setEditedGoal] = useState({
    category: goal.category || "",
    goal: goal.goal || "",
    color: goal.color || "bg-gray-100",
  });

  if (!isModalOpen) return null;
  const handleUpdate = (id: any, editedGoal: any) => {
    onSave(id, editedGoal);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-1/2 p-6 ">
        <div className="space-y-7">
          <div
            // style={{ backgroundColor: editedGoal.color }}
            className={`h-4 rounded-full mx-auto w-24 mb-4 self-start ${editedGoal?.color}`}
          />
          <h3 className="text-xl text-center font-semibold">Edit Goal</h3>
          <div>
            {/* <input
                type="text"
                value={editedGoal.category}
                onChange={(e) =>
                  setEditedGoal({ ...editedGoal, category: e.target.value })
                }
                className="border p-2 mb-2 rounded w-full"
              /> */}
            <div className="mb-2">
              <Select
                defaultValue={editedGoal.category}
                onValueChange={(value) =>
                  setEditedGoal({
                    ...editedGoal, // Preserve existing state
                    category: value, // Update only the category
                  })
                }
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>

                <SelectContent>
                  {Object.values(Category).map((type) => (
                    <SelectItem value={type} key={type}>
                      {CategoryDisplay[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="text"
              value={editedGoal.goal}
              onChange={(e) =>
                setEditedGoal({ ...editedGoal, goal: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {hexColors.map((color: string) => (
                <button
                  key={color}
                  style={{
                    backgroundColor: color,
                  }}
                  className={`${color} w-8 h-8 rounded-full mr-2 border-2 flex items-center justify-center ${
                    editedGoal.color === color
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setEditedGoal({ ...editedGoal, color })}
                >
                  {editedGoal.color === color && (
                    <Check
                      size={16}
                      strokeWidth={3}
                      color={
                        "#000"
                        // color === "#FFFFFF" || color === "#F5F5F5"
                        //   ? "#000000"
                        //   : "#FFFFFF"
                      }
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex w-full items-center space-x-5 justify-between">
            <Button
              onClick={() => handleUpdate(goal.id, editedGoal)}
              className={`px-6 py-2 w-full bg-black text-white rounded-md hover:bg-black/75 hover:text-white`}
            >
              Save
            </Button>
            <button
              onClick={onCancel}
              className="px-6 py-2 w-full bg-[#F2F2F7] text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
