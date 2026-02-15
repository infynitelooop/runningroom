import React, { useState } from "react";
import { useBedOccupancyDashboard } from "./hooks/useBedOccupancyDashboard.ts";
import { FaBed } from "react-icons/fa";
import { useEnums } from "../../../store/EnumsContext.tsx";
import  { BookingFormDialog } from "./components/BookingFormDialog.tsx";
import { FiRefreshCcw } from "react-icons/fi";


export default function BedOccupancyDashboard() {
    const { data, loading, error, fetchOccupancy } = useBedOccupancyDashboard();
    const { enums, loading: enumsLoading } = useEnums();

    const [selectedBed, setSelectedBed] = useState<any>(null);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

    const [editBed, setEditBed] = useState<any>(null);
    const [editRoom, setEditRoom] = useState<string | null>(null);
    const [editBuilding, setEditBuilding] = useState<string | null>(null);

    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | undefined>(undefined);

    const handleSubmitForm = async (form: any) => {
        // TODO: integrate updateBooking when ready
        // setSaving(true);
        // setFormError(undefined);
        // try {
        //   await updateBooking(editBed.bookingId, form);
        //   setEditBed(null);
        //   setEditRoom(null);
        //   fetchOccupancy();
        // } catch (err: any) {
        //   setFormError(err?.response?.data?.message || "Failed to update bed");
        // } finally {
        //   setSaving(false);
        // }
    };

    if (loading || enumsLoading) return <div>Loading...</div>;

    const defaultColor = "bg-green-500";

    // 🟩 Build occupancy color map dynamically from enums
    const occupancyColors: Record<string, string> = {};
    enums?.occupancyStatus.forEach((status, index) => {
        const colors = [
            "bg-green-500",
            "bg-red-500",
            "bg-yellow-500",
            "bg-blue-400",
            "bg-gray-500",
        ];
        occupancyColors[status.key] = colors[index % colors.length] || defaultColor;
    });

    // ✅ Get color for individual bed
    const getBedColor = (status: string | null | undefined) => {
        if (!status) return defaultColor;
        return occupancyColors[status] || defaultColor;
    };

    // ✅ Compute border color for a room
    const getRoomColor = (beds: { occupancyStatus: string }[]) => {
        if (!enums) return "border-gray-300";
        const allStatuses = beds.map((b) => b.occupancyStatus);
        const availableKey = enums.occupancyStatus[0]?.key || "AVAILABLE";

        const allAvailable = allStatuses.every((s) => s === availableKey);
        const allUnavailable = allStatuses.every((s) => s !== availableKey);

        if (allAvailable) return "border-green-500";
        if (allUnavailable) return "border-gray-500";
        return "border-green-300";
    };

    return (
        <div className=" sm:py-10 sm:px-5 px-0 py-4">
            {/* Header */}
            <div className="flex items-center justify-center gap-4">
                <h1 className="text-lg font-bold">Bed-wise Occupancy</h1>
                <button
                    className="bg-gray-400 text-white px-2 py-2 rounded hover:bg-blue-700"
                    onClick={fetchOccupancy}
                >
                    <FiRefreshCcw />

                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>
            )}

            {/* Buildings */}
            <div className="space-y-8">
                {data.map((building) => (
                    <div key={building.buildingName}>
                        <h2 className="text-sm mb-4">
                            🏢 {building.buildingName}
                        </h2>

                        {/* Rooms inside building */}
                        <div className="flex flex-wrap gap-2">
                            {building.rooms.map((room) => (
                                <div
                                    key={room.roomNumber}
                                    className={`p-2 rounded-lg shadow-md w-fit border-2 ${getRoomColor(
                                        room.beds
                                    )}`}
                                >
                                    <h3 className="text-sm mb-3">
                                        {room.roomNumber}
                                    </h3>
                                    <div className="flex gap-3 flex-wrap">
                                        {room.beds.map((bed) => {
                                            let clickTimeout: any;
                                            let prevCount = 0;



                                            const handleClick = () => {

                                                prevCount++;
                                                // Delay single-click slightly
                                                clickTimeout = setTimeout(() => {
                                                    if (prevCount === 1) {
                                                        // Single click action
                                                        prevCount = 0;
                                                        setSelectedBed(bed);
                                                        setSelectedRoom(room.roomNumber);
                                                        setSelectedBuilding(building.buildingName);
                                                    } else if (prevCount === 2) {
                                                        
                                                        setEditBed(bed);
                                                        setEditRoom(room.roomNumber);
                                                        setEditBuilding(building.buildingName);
                                                        
                                                    }
                                                    // Reset after action
                                                    prevCount = 0;
                                                    clearTimeout(clickTimeout);
                                                    //

                                                }, 200); // 200ms is standard

                                            };

                                            return (
                                                <div
                                                    key={bed.bookingId}
                                                    className={`flex flex-col items-center justify-center w-6 h-6 rounded-lg shadow text-white cursor-pointer ${getBedColor(
                                                        bed.occupancyStatus
                                                    )}`}
                                                    onClick={handleClick}
                                                    title={`Bed ${bed.bedNumber} - ${bed.occupancyStatus}`}
                                                >
                                                    <FaBed size={20} />
                                                </div>
                                            );
                                        })}

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
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
                            {selectedBuilding} — {selectedRoom} — Bed{" "}
                            {selectedBed.bedNumber}
                        </h3>
                        <div className="space-y-2 text-sm">
                            <p>
                                <strong>Status:</strong> {selectedBed.occupancyStatus}
                            </p>
                            {selectedBed.crewId && (
                                <p>
                                    <strong>Crew ID:</strong> {selectedBed.crewId}
                                </p>
                            )}
                            {selectedBed.crewName && (
                                <p>
                                    <strong>Crew Name:</strong> {selectedBed.crewName}
                                </p>
                            )}
                            {selectedBed.crewDesignation && (
                                <p>
                                    <strong>Designation:</strong>{" "}
                                    {selectedBed.crewDesignation}
                                </p>
                            )}
                            {selectedBed.crewType && (
                                <p>
                                    <strong>Crew Type:</strong> {selectedBed.crewType}
                                </p>
                            )}
                            {selectedBed.mealType && (
                                <p>
                                    <strong>Meal Type:</strong> {selectedBed.mealType}
                                </p>
                            )}
                            {selectedBed.vegNonVeg && (
                                <p>
                                    <strong>Veg/Non-Veg:</strong> {selectedBed.vegNonVeg}
                                </p>
                            )}
                            {selectedBed.checkInTime && (
                                <p>
                                    <strong>Check-In:</strong>{" "}
                                    {new Date(selectedBed.checkInTime).toLocaleString()}
                                </p>
                            )}
                            {selectedBed.restHours !== undefined && (
                                <p>
                                    <strong>Rest Hours:</strong> {selectedBed.restHours}
                                </p>
                            )}
                            {selectedBed.wakeUpTime && (
                                <p>
                                    <strong>Wake-Up:</strong>{" "}
                                    {new Date(selectedBed.wakeUpTime).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Dialog */}
            <BookingFormDialog
                open={editBed}
                onClose={() => {
                    setEditBed(null);
                    setEditRoom(null);
                    setEditBuilding(null);
                    setFormError(undefined);
                }}
                initialData={editBed}
                saving={saving}
                error={formError}
                enums={enums}
                onSubmit={handleSubmitForm}
            />
        </div>
    );
}

