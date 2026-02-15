import { useState, useEffect } from "react";
import api from "../../../../services/api";

export type Bed = {
  bookingId: number;
  occupancyStatus: string;
  bedNumber: string;
  roomNumber: string;
  buildingName: string;
  crewId?: string;
  crewName?: string;
  crewDesignation?: string;
  crewType?: string;
  mealType?: string;
  vegNonVeg?: string;
  checkInTime?: string;
  checkOutTime?: string;
  subsidizedFood?: boolean;
  attachmentPref?: string;
  signOffStation?: string;
  signOffDateTime?: string;
  restHours?: number;
  taSno?: string;
  ccId?: string;
  ccUserId?: string;
  signOffApprovalTime?: string;
  signOnNoV?: string;
  transactionTime?: string;
  noOfMeals?: number;
  wakeUpTime?: string;
};

export type Room = {
  roomNumber: string;
  beds: Bed[];
};

export type BuildingOccupancy = {
  buildingName: string;
  rooms: Room[];
};

export function useBedOccupancyDashboard() {
  const [data, setData] = useState<BuildingOccupancy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOccupancy = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/bookings/dashboard");
      const buildingsFromApi = res.data;

      // Just store directly since it matches your backend response
      setData(buildingsFromApi);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load occupancy");
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (bookingId: number, updates: Partial<Bed>) => {
    try {
      await api.put(`/bookings/${bookingId}`, updates);
      await fetchOccupancy(); // Refresh after update
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update booking");
    }
  };

  useEffect(() => {
    fetchOccupancy();
  }, []);

  return { data, loading, error, fetchOccupancy, updateBooking };
}