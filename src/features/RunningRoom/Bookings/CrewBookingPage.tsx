import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button } from "../../../features/ui/button.tsx";

// Types
type Crew = {
  crewId: string;
  name: string;
  designation: string;
  gender: string;
  mobileNumber: string;
};

type Booking = {
  bookingId: number;
  crew: Crew;
  buildingName: string;
  bedId: string;
  checkInTime?: string;
  checkOutTime?: string;
  mealType?: string;
  vegNonVeg?: string;
};

// Service hooks (simple fetch wrappers)
async function fetchActiveBookings(buildingName: string): Promise<Booking[]> {
  const res = await fetch(`/api/bookings/active/${buildingName}`);
  if (!res.ok) throw new Error("Failed to load bookings");
  return res.json();
}

async function createBooking(crewId: string, booking: Partial<Booking>) {
  const res = await fetch(`/api/bookings/${crewId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  if (!res.ok) throw new Error("Failed to create booking");
  return res.json();
}

// Main component
export default function CrewBookingPage() {
  const [buildingName, setBuildingName] = useState("HQ1");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    crewId: "",
    buildingName: "HQ1",
    bedId: "",
    mealType: "D",
    vegNonVeg: "V",
  });

  const loadBookings = async () => {
    try {
      setBookings(await fetchActiveBookings(buildingName));
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [buildingName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBooking(formData.crewId, formData);
      await loadBookings();
      setFormData({ ...formData, crewId: "", bedId: "" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
        Crew Room Allocation
      </h1>

      {/* Booking form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white shadow rounded-xl p-6 space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Crew ID"
            className="border p-2 rounded"
            value={formData.crewId}
            onChange={(e) => setFormData({ ...formData, crewId: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Bed ID"
            className="border p-2 rounded"
            value={formData.bedId}
            onChange={(e) => setFormData({ ...formData, bedId: e.target.value })}
            required
          />
          <select
            className="border p-2 rounded"
            value={formData.mealType}
            onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
          >
            <option value="B">Breakfast</option>
            <option value="L">Lunch</option>
            <option value="D">Dinner</option>
          </select>
          <select
            className="border p-2 rounded"
            value={formData.vegNonVeg}
            onChange={(e) => setFormData({ ...formData, vegNonVeg: e.target.value })}
          >
            <option value="V">Veg</option>
            <option value="N">Non-Veg</option>
          </select>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-600 text-white">
            Book Room
          </Button>
        </div>
      </form>

      {/* Active bookings dashboard */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-700 text-center">
          Active Bookings - {buildingName}
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="p-2 border">Crew</th>
                <th className="p-2 border">Designation</th>
                <th className="p-2 border">Bed</th>
                <th className="p-2 border">Check-In</th>
                <th className="p-2 border">Meals</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingId} className="text-sm">
                  <td className="p-2 border">{b.crew?.name}</td>
                  <td className="p-2 border">{b.crew?.designation}</td>
                  <td className="p-2 border">{b.bedId}</td>
                  <td className="p-2 border">
                    {b.checkInTime ? dayjs(b.checkInTime).format("DD MMM HH:mm") : "-"}
                  </td>
                  <td className="p-2 border">
                    {b.mealType} ({b.vegNonVeg})
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    No active bookings
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
