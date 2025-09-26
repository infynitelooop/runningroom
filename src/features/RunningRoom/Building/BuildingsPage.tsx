import React, { useState } from "react";
import { Button } from "../../../features/ui/button.tsx";
import { Plus } from "lucide-react";
import { BuildingCard } from "./components/BuildingCard.tsx";
import { BuildingFormDialog } from "./components/BuildingFormDialog.tsx";
import { useBuildingsService, Building } from "../hooks/useBuildingsService.ts";

const colors = [
  "bg-red-100 text-red-800",
  "bg-green-100 text-green-800",
  "bg-blue-100 text-blue-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
];

export default function BuildingsPage() {
  const {
    buildings,
    error,
    successMessage,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    setError,
  } = useBuildingsService();

  const [open, setOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmitForm = async (formData: Omit<Building, "id">) => {
    setSaving(true);
    try {
      if (selectedBuilding) {
        await updateBuilding(selectedBuilding.id, formData);
      } else {
        await createBuilding(formData);
      }
      setOpen(false);
      setSelectedBuilding(null);
      setError("");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (building: Building) => {
    if (window.confirm(`Are you sure you want to delete "${building.buildingName}"?`)) {
      await deleteBuilding(building.id);
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

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md">{error}</div>}
      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md">{successMessage}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {buildings.map((building, index) => (
          <BuildingCard
            key={building.id}
            building={building}
            colorClass={colors[index % colors.length]}
            onEdit={(b) => {
              setSelectedBuilding(b);
              setOpen(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <BuildingFormDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedBuilding(null);
        }}
        onSubmit={handleSubmitForm}
        initialData={selectedBuilding || undefined}
        saving={saving}
        error={error}
      />
    </div>
  );
}
