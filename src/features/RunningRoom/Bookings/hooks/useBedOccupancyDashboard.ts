import { useState, useEffect } from "react";
import api from "../../../../services/api";

export type Bed = {

    bedNumber: string;
    occupancyStatus: string;
    crewId?: string;
    crewName?: string;
    crewDesignation?: string;
    crewType?: string;
    mealType?: string;
    vegNonVeg?: string;
    checkInTime?: string;
    restHours?: number;
    wakeUpTime?: string;


};

export type RoomOccupancy = {
    [roomNumber: string]: Bed[];
};

export function useBedOccupancyDashboard() {
    const [data, setData] = useState<RoomOccupancy>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchOccupancy = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/bookings/dashboard");
            const roomsFromApi = res.data; // This is already an object: { N101: [...], N102: [...] }

            // Optionally, ensure types
            const rooms: RoomOccupancy = {};
            for (const roomNumber in roomsFromApi) {
                rooms[roomNumber] = roomsFromApi[roomNumber].map((b: any) => ({
                    bedNumber: b.bedNumber,
                    occupancyStatus: b.occupancyStatus,
                    crewId: b.crewId || undefined,                    
                    crewName: b.crewName || undefined,
                    crewDesignation: b.crewDesignation || undefined,
                    crewType: b.crewType || undefined,
                    mealType: b.mealType || undefined,
                    vegNonVeg: b.vegNonVeg || undefined,
                    checkInTime: b.checkInTime || undefined,
                    restHours: b.restHours || undefined,
                    wakeUpTime: b.wakeUpTime || undefined,
                }));
            }

            setData(rooms);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to load occupancy");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOccupancy();
    }, []);

    return { data, loading, error, fetchOccupancy };
}