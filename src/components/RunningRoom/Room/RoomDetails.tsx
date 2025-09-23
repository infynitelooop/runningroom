import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import toast from "react-hot-toast";
import { Blocks } from "react-loader-spinner";
import Errors from "../../Errors";
import { useEnums } from "../../../store/EnumsContext.tsx";
import RoomForm, { RoomFormInputs } from "./RoomForm.tsx";
import Buttons from "../../../utils/Buttons.tsx";
import { FaTrash } from "react-icons/fa";

const RoomDetails: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { enums } = useEnums();

  const [room, setRoom] = useState<RoomFormInputs | null>(null);
  const [buildings, setBuildings] = useState<{ id: string; buildingName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch buildings
  const fetchBuildings = async () => {
    try {
      const { data } = await api.get("/buildings");
      setBuildings(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  // fetch room
  const fetchRoom = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.get(`/rooms/${roomId}`);
      setRoom(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch room");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchBuildings();
    fetchRoom();
  }, [fetchRoom]);

  const handleSave = async (data: RoomFormInputs) => {
    setSaving(true);
    try {
      await api.put("/rooms", data);
      toast.success("Room updated successfully");
      fetchRoom();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update room");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;
    setDeleting(true);
    try {
      await api.delete(`/rooms/${roomId}`);
      toast.success("Room deleted successfully");
      navigate("/admin/rooms");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete room");
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !enums) return (
    <div className="flex flex-col justify-center items-center h-72">
      <Blocks height={70} width={70} color="#4fa94d" ariaLabel="loading" />
      <span>Loading...</span>
    </div>
  );

  if (error) return <Errors message={error} />;

  return (
    <div className="sm:px-12 px-4 py-10">
      <div className="lg:w-[70%] sm:w-[90%] w-full mx-auto shadow-lg shadow-gray-300 p-8 rounded-md">
        <h1 className="text-slate-800 text-2xl font-bold pb-4">Room Details<hr /></h1>

        {room && (
          <>
            <RoomForm
              defaultValues={room}
              onSubmit={handleSave}
              enums={enums}
              buildings={buildings}
              saving={saving}
              readOnlyRoomNumber={true}
            />

            <div className="flex gap-2 mt-4">
              <Buttons type="button" className="bg-red-500 hover:bg-red-600 mb-0 w-fit px-4 py-2 rounded-md text-white" onClick={handleDelete}>
                {deleting ? "Deleting..." : <FaTrash className="h-5 w-5" />}
              </Buttons>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
