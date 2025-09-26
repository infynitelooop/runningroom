import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog.tsx";
import { Button } from "../../ui/button.tsx";
import { Input } from "../../ui/input.tsx";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../ui/select.tsx";

type MenuItemFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; price: number; mealType: string; mealCategory: string }) => void;
  initialData?: { name: string; description: string; price: number; mealType: string; mealCategory: string };
};

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER"];
const MEAL_CATEGORIES = ["VEG", "NON_VEG", "DESSERT", "SNACK"];

export default function MenuItemFormDialog({ open, onClose, onSubmit, initialData }: MenuItemFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [mealType, setMealType] = useState("");
  const [mealCategory, setMealCategory] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setPrice(initialData.price);
      setMealType(initialData.mealType);
      setMealCategory(initialData.mealCategory);
    } else {
      setName("");
      setDescription("");
      setPrice(0);
      setMealType("");
      setMealCategory("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name || !mealType || !mealCategory) return;
    onSubmit({ name, description, price, mealType, mealCategory });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meal Type</label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Meal Type" />
              </SelectTrigger>
              <SelectContent>
                {MEAL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meal Category</label>
            <Select value={mealCategory} onValueChange={setMealCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Meal Category" />
              </SelectTrigger>
              <SelectContent>
                {MEAL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{initialData ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
