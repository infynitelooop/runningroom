import { useState, useEffect } from "react";
import api from "../../../services/api";

export type Building = {
  id: string;
  buildingName: string;
  address: string;
  floors: string;
  description: string;
};

export function useBuildingsService() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/buildings");
      setBuildings(data);
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load buildings");
    } finally {
      setLoading(false);
    }
  };

  const createBuilding = async (building: Omit<Building, "id">) => {
    await api.post("/buildings", building);
    await fetchBuildings();
    setSuccessMessage("Building created successfully");
  };

  const updateBuilding = async (id: string, building: Omit<Building, "id">) => {
    await api.put(`/buildings/${id}`, building);
    await fetchBuildings();
    setSuccessMessage("Building updated successfully");
  };

  const deleteBuilding = async (id: string) => {
    await api.delete(`/buildings/${id}`);
    setBuildings(buildings.filter((b) => b.id !== id));
    setSuccessMessage("Building deleted successfully");
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  return {
    buildings,
    loading,
    error,
    successMessage,
    fetchBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    setError,
    setSuccessMessage,
  };
}
