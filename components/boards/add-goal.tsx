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

export const AddGoals = ({
  isModalOpen,
  newGoal,
  onCancel,
  onSave,
  setNewGoal,
  colors,
}: {
  colors: any;
  isModalOpen: boolean;
  newGoal: any;
  onCancel: any;
  onSave: any;
  setNewGoal: any;
}) => {
  const handleSave = () => {
    onSave();
  };

  if (!isModalOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-1/2 p-6 ">
        <div className="space-y-7">
          <h3 className="text-xl text-center font-semibold">Add New Goal</h3>

          <div>
            <div className="">
              {/* <Input
                  type="text"
                  placeholder="Category"
                  value={newGoal.category}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, category: e.target.value })
                  }
                  className="border p-2 mr-2 rounded"
                /> */}

              <Select
                onValueChange={(value) =>
                  setNewGoal({
                    ...newGoal, // Preserve existing state
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
            <div className="mt-4">
              <Input
                type="text"
                placeholder="Goal"
                value={newGoal.goal}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, goal: e.target.value })
                }
                className="border p-2 mr-2 rounded"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-1">
              {hexColors.map((color: any, index: number) => (
                <button
                  key={index}
                  style={{ backgroundColor: color }}
                  className={`${color} w-8 h-8 rounded-full mr-2 border-2 flex items-center justify-center  ${
                    newGoal.color === color
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setNewGoal({ ...newGoal, color })}
                >
                  {newGoal.color === color && (
                    <Check
                      size={16}
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
              onClick={handleSave}
              className="px-6 py-2 w-full bg-black text-white rounded-md hover:bg-black/75 hover:text-white"
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
