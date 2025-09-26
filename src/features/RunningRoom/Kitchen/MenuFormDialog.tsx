import React, { useEffect, useState } from "react";
import { Menu } from "./hooks/useMenusService";

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

  // Update the form state when initialData changes
  useEffect(() => {
    if (initialData) {
      setMenuDate(dayjs(initialData.menuDate).format("YYYY-MM-DD"));
    } else {
      setMenuDate("");
    }
  }, [initialData]);

  // Handle form submission
  const handleSubmit = () => {
    if (!menuDate) return;
    onSubmit({ menuDate });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Menu" : "Add Menu"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Menu Date</label>
            <Input type="date" value={menuDate} onChange={(e) => setMenuDate(e.target.value)} />
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
