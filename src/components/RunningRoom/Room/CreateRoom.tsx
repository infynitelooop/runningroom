import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../services/api";
import { useEnums } from "../../../store/EnumsContext.tsx";
import RoomForm, { RoomFormInputs } from "./RoomForm.tsx";

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const { enums } = useEnums();
  const [buildings, setBuildings] = useState<{ id: string; buildingName: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBuildings = async () => {
      const { data } = await api.get("/buildings");
      setBuildings(data);
    };
    fetchBuildings();
  }, []);

  const handleSave = async (formData: RoomFormInputs) => {
    setSaving(true);
    try {
      await api.post("/rooms", formData);
      toast.success("Room created successfully");
      navigate("/admin/rooms");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create room");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!enums) return <p>Loading enums...</p>;

  return (
    <div className="sm:px-12 px-4 py-10">
      <div className="lg:w-[70%] sm:w-[90%] w-full mx-auto shadow-lg shadow-gray-300 p-8 rounded-md">
        <h1 className="text-slate-800 text-2xl font-bold pb-4">Create New Room<hr /></h1>
        <RoomForm defaultValues={{
          roomNumber: "",
          roomType: "",
          ac: true,
          capacity: 1,
          floor: 0,
          buildingId: "",
          crewType: "",
          roomCategory: "",
          beds: 1,
          attachment: "",
          status: "",
          description: "",
        }}
        onSubmit={handleSave}
        enums={enums}
        buildings={buildings}
        saving={saving}
        />
      </div>
    </div>
  );
};

export default CreateRoom;
