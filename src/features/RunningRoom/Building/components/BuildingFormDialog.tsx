import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog.tsx";
import { Input } from "../../../ui/input.tsx";
import { Label } from "../../../ui/label.tsx";
import { Button } from "../../../ui/button.tsx";

type Building = {
  id: string;
  buildingName: string;
  address: string;
  floors: string;
  description: string;
};


type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: Omit<Building, "id">) => void;
  initialData?: Omit<Building, "id">;
  saving?: boolean;
  error?: string;
};

export function BuildingFormDialog({ open, onClose, onSubmit, initialData, saving, error }: Props) {
  const [form, setForm] = useState(initialData || { buildingName: "", address: "", floors: "", description: "" });

  useEffect(() => {
    setForm(initialData || { buildingName: "", address: "", floors: "", description: "" });
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby="building-dialog-description" className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Building" : "Add New Building"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="buildingName">Building Name</Label>
            <Input
              id="buildingName"
              value={form.buildingName}
              onChange={(e) => setForm({ ...form, buildingName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="floors">Floors</Label>
            <Input
              id="floors"
              type="number"
              min={0}
              value={form.floors}
              onChange={(e) => setForm({ ...form, floors: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
