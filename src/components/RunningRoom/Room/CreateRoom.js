import React, { useState } from "react";

export default function CreateRoom({ onRoomCreated }) {
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!roomName.trim() || !capacity) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      // Replace with your backend endpoint
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: roomName, capacity: Number(capacity) }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const newRoom = await response.json();

      // Reset form
      setRoomName("");
      setCapacity("");

      // Notify parent
      if (onRoomCreated) {
        onRoomCreated(newRoom);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">Create a New Room</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Room Name
          </label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="mt-1 block w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
            placeholder="Enter room name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Capacity
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="mt-1 block w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
            placeholder="Enter capacity"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>
      </form>
    </div>
  );
}
