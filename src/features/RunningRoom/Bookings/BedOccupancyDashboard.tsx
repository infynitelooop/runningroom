import React from "react";
import { useBedOccupancyDashboard } from "./hooks/useBedOccupancyDashboard.ts";
import { FaBed } from "react-icons/fa";
import { useEnums } from "../../../store/EnumsContext.tsx";
import { useState } from "react";

export default function BedOccupancyDashboard() {
  const { data, loading, error, fetchOccupancy } = useBedOccupancyDashboard();
  const { enums, loading: enumsLoading } = useEnums();

  const [selectedBed, setSelectedBed] = useState<any>(null); // bed clicked
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  if (loading || enumsLoading) return <div>Loading...</div>;

  const defaultColor = "bg-green-500";

  // Map occupancyStatus to colors dynamically
  const occupancyColors: Record<string, string> = {};
  enums?.occupancyStatus.forEach((status, index) => {
    const colors = ["bg-green-500", "bg-gray-500", "bg-yellow-500", "bg-blue-400", "bg-gray-500"];
    occupancyColors[status.key] = colors[index % colors.length] || defaultColor;
  });

// Then, when getting color for a bed:
const getBedColor = (status: string | null | undefined) => {
  if (!status) return defaultColor; // null or undefined
  return occupancyColors[status] || defaultColor;
};
  // Compute room border color dynamically
  const getRoomColor = (beds: { occupancyStatus: string }[]) => {
    if (!enums) return "border-gray-300";
    const allStatuses = beds.map((b) => b.occupancyStatus);
    const allAvailable = allStatuses.every((s) => s === enums.occupancyStatus[0].key);
    const allUnavailable = allStatuses.every((s) => s !== enums.occupancyStatus[0].key);
    if (allAvailable) return "border-green-500";
    if (allUnavailable) return "border-gray-500";
    return "border-green-300";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bed-wise Occupancy</h1>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={fetchOccupancy}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>
      )}

      <div className="flex flex-wrap gap-6">
        {Object.keys(data).map((room) => {
          const beds = data[room];
          return (
            <div
              key={room}
              className={`p-4 rounded-lg shadow-md w-fit border-2 ${getRoomColor(beds)}`}
            >
              <h2 className="text-lg font-semibold mb-3">{room}</h2>
              <div className="flex gap-3 flex-wrap">
                {beds.map((bed) => (
                  <div
                    key={bed.bedNumber}
                    className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg shadow text-white cursor-pointer ${getBedColor(bed.occupancyStatus)}`}
                    onClick={() => {
                      setSelectedBed(bed);
                      setSelectedRoom(room);
                    }}
                  >
                    <FaBed size={20} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bed Details Dialog */}
      {selectedBed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedBed(null)}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">
              Bed {selectedBed.bedNumber} - Room {selectedRoom}
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> {selectedBed.occupancyStatus}</p>
              {selectedBed.crewId && <p><strong>Crew ID:</strong> {selectedBed.crewId}</p>}
              {selectedBed.crewName && <p><strong>Crew Name:</strong> {selectedBed.crewName}</p>}
              {selectedBed.crewDesignation && <p><strong>Designation:</strong> {selectedBed.crewDesignation}</p>}
              {selectedBed.crewType && <p><strong>Crew Type:</strong> {selectedBed.crewType}</p>}
              {selectedBed.mealType && <p><strong>Meal Type:</strong> {selectedBed.mealType}</p>}
              {selectedBed.vegNonVeg && <p><strong>Veg/Non-Veg:</strong> {selectedBed.vegNonVeg}</p>}
              {selectedBed.checkInTime && <p><strong>Check-In:</strong> {new Date(selectedBed.checkInTime).toLocaleString()}</p>}
              {selectedBed.restHours !== undefined && <p><strong>Rest Hours:</strong> {selectedBed.restHours}</p>}
              {selectedBed.wakeUpTime && <p><strong>Wake-Up:</strong> {new Date(selectedBed.wakeUpTime).toLocaleString()}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}