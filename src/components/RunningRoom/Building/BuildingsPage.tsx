import React, { useEffect, useState } from "react";

import { Button } from "../../../components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { Plus, Trash2 } from "lucide-react";
import api from "../../../services/api";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";

type Building = {
  id: string;
  buildingName: string;
  address: string;
  floors: string;
  description: string;
};

const colors = [
  "bg-red-100 text-red-800",
  "bg-green-100 text-green-800",
  "bg-blue-100 text-blue-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
];

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null); // <-- for update
  const [successMessage, setSuccessMessage] = useState("");


  const [form, setForm] = useState({
    buildingName: "",
    address: "",
    floors: "",
    description: "",
  });



  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const { data } = await api.get("/buildings");
      setBuildings(data);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load buildings");
    }
  };

  const openEditDialog = (building: Building) => {
    setSelectedBuilding(building);
    setForm({
      buildingName: building.buildingName,
      address: building.address,
      floors: building.floors,
      description: building.description,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selectedBuilding) {
        // Update existing building
        await api.put(`/buildings/${selectedBuilding.id}`, form);
      } else {
        // Create new building
        await api.post("/buildings", form);
      }
      setSelectedBuilding(null);
      setForm({ buildingName: "", address: "", floors: "", description: "" });
      setSelectedBuilding(null);
      setOpen(false);
      fetchBuildings();
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save building");
    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async (building: Building) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${building.buildingName}"?`);
    if (!confirmDelete) return;

    try {
      await api.delete(`/buildings/${building.id}`);
      setBuildings(buildings.filter(b => b.id !== building.id));
      setSuccessMessage("Building deleted successfully");
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete building");
      setSuccessMessage("");
    }
  };


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Buildings</h1>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Building
        </Button>
      </div>

      {error && (<div className="bg-red-100 text-red-700 px-4 py-2 rounded-md">{error}</div>)}
      {successMessage && <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md">{successMessage}</div>}


      {/* List of buildings */}


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {buildings.map((building, index) => {
          const colorClass = colors[index % colors.length]; // cycle colors
          return (
            <Card key={building.id}
              className={`shadow-sm cursor-pointer hover:shadow-md ${colorClass}`}
              onClick={() => openEditDialog(building)}>
              <CardHeader className="flex items-center gap-2">
                <HiOutlineBuildingLibrary className="h-5 w-5" />
                <CardTitle>
                  <u>{building.buildingName}</u>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm"><b>Address: </b><i>{building.address}</i></p>
                <p className="text-sm"><b>Floors: </b><i>{building.floors}</i></p>
                <p className="text-sm">{building.description}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // ⚡ Stop the click from reaching the card
                    handleDelete(building);
                  }}
                  className="mt-2 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>


      {/* Add/Edit Building Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby="building-dialog-description" className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedBuilding ? "Edit Building" : "Add New Building"}</DialogTitle>
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
              <Label htmlFor="address">Floors</Label>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setSelectedBuilding(null);
                  setForm({ buildingName: "", address: "", floors: "", description: "" });
                  setError("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
