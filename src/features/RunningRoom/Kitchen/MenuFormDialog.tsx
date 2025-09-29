import React, { useEffect, useState } from "react";
import { Menu } from "./hooks/useMenusService";
import { MenuItem } from "./hooks/useMenusService";
import { FaPlus } from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog.tsx";
import { Input } from "../../ui/input.tsx";
import { Button } from "../../ui/button.tsx";
import dayjs from "dayjs";
import { FaTrash } from "react-icons/fa";

// Define the props for the MenuFormDialog component
type MenuFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Menu, "id">) => void;
  initialData?: Omit<Menu, "id">;
};

// MenuFormDialog component
export default function MenuFormDialog({ open, onClose, onSubmit, initialData }: MenuFormDialogProps) {
  const [menuDate, setMenuDate] = useState("");
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setMenuDate(dayjs(initialData.menuDate).format("YYYY-MM-DD"));
      setItems(initialData.items || []);
    } else {
      setMenuDate("");
      setItems([]);
    }
  }, [initialData]);

  // Add a new empty item
  const handleAddItem = () => {
    setItems([
      ...items,
      { name: "", description: "", price: 0, mealType: "BREAKFAST", mealCategory: "VEG" }
    ]);
  };

  // Update an item
  const handleItemChange = <K extends keyof MenuItem>(
    idx: number,
    field: K,
    value: MenuItem[K]
  ) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  // Remove an item
  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!menuDate) return;
    onSubmit({ menuDate, items });
  };

  // Get unique meal types from items
  const mealTypes = Array.from(new Set(items.map(item => item.mealType)));

  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className="max-w-screen-md w-full overflow-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Menu" : "Add Menu"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-extrabold mb-1 text-orange-500">Menu Date</label>
            <Input type="date" value={menuDate} onChange={(e) => setMenuDate(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-extrabold mb-1 text-orange-500">Menu Items</label>
            <div className="h-px bg-gray-700 my-2 mb-4" />

            <div className="space-y-4">

              {mealTypes.map(mealType => (
                <div key={mealType}>
                  {/* MealType heading and Add button */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-xs">{mealType}</div>
                    <Button
                      size="xsm"
                      variant="default"
                      className="flex items-center gap-1"
                      onClick={() =>
                        setItems([
                          ...items,
                          { name: "", description: "", price: 0, mealType, mealCategory: "VEG" }
                        ])
                      }
                    >
                      <FaPlus className="h-3 w-3" />
                    </Button>
                  </div>
                  {items
                    .map((item, idx) => ({ ...item, idx }))
                    .filter(item => item.mealType === mealType)
                    .map(item => (
                      <div key={item.idx} className="flex gap-2 items-center mb-2">
                        <Input
                          placeholder="Name"
                          value={item.name}
                          onChange={e => handleItemChange(item.idx, "name", e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={e => handleItemChange(item.idx, "description", e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          placeholder="Price"
                          value={item.price}
                          onChange={e => handleItemChange(item.idx, "price", Number(e.target.value))}
                          className="flex-1"
                        />
                        <select
                          value={item.mealCategory}
                          onChange={e => handleItemChange(item.idx, "mealCategory", e.target.value)}
                          className="flex-1 border rounded px-1 py-0.5 text-xs"
                        >
                          <option>VEG</option>
                          <option>NON_VEG</option>
                          <option>VEGAN</option>
                        </select>
                        <Button variant="default" size="xsm" onClick={() =>
                          handleRemoveItem(item.idx)}><FaTrash className="h-4 w-4" /></Button>
                      </div>
                    ))}
                </div>
              ))}
              <Button size="sm" onClick={handleAddItem}>Add Item</Button>
            </div>
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