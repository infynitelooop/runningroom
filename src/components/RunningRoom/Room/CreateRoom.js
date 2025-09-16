import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../services/api";
import InputField from "../../InputField/InputField";

import Buttons from "../../../utils/Buttons";
import toast from "react-hot-toast";
import { RoomStatus, RoomType } from "../enum";
import { useNavigate } from "react-router-dom";

const NewRoom = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            roomNumber: "",
            roomType: RoomType[0],
            capacity: "",
            floor: "",
            status: RoomStatus[0],
        },
        mode: "onSubmit",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSave = async (data) => {
        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await api.post("/rooms", data);
            setSuccessMessage("Room created successfully");
            toast.success("Room created successfully");
            // Optional: redirect to room list after creation
            navigate("/admin/rooms");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to create room");
            console.error("Error creating room:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="sm:px-12 px-4 py-10">
            <div className="lg:w-[70%] sm:w-[90%] w-full mx-auto shadow-lg shadow-gray-300 p-8 rounded-md">
                <h1 className="text-slate-800 text-2xl font-bold pb-4">
                    Create New Room
                    <hr />
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded relative mb-4">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded relative mb-4">
                        {successMessage}
                    </div>
                )}

                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(handleSave)}
                >
                    <InputField
                        label="Room Number"
                        id="roomNumber"
                        type="text"
                        placeholder="Enter Room Number"
                        required
                        register={register}
                        errors={errors}
                        message="*Room number is required"
                    />

                    <div>
                        <label className="block text-slate-700 font-semibold pb-1">
                            Room Type
                        </label>
                        <select
                            {...register("roomType", { required: "*Room type is required" })}
                            className="border p-2 rounded w-full"
                        >
                            {RoomType.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        {errors.roomType && (
                            <p className="text-red-500 text-sm">{errors.roomType.message}</p>
                        )}
                    </div>

                    <InputField
                        label="Capacity"
                        id="capacity"
                        type="number"
                        placeholder="Enter Capacity"
                        register={register}
                        errors={errors}
                        required={true}
                        message="*Capacity is required"
                    />

                    <InputField
                        label="Floor"
                        id="floor"
                        type="number"
                        placeholder="Enter Floor"
                        register={register}
                        errors={errors}
                        required={true}
                        message="*Floor is required"
                    />

                    <div>
                        <label className="block text-slate-700 font-semibold pb-1">
                            Status
                        </label>
                        <select
                            {...register("status", { required: "*Status is required" })}
                            className="border p-2 rounded w-full"
                        >
                            {RoomStatus.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-sm">{errors.status.message}</p>
                        )}
                    </div>

                    <Buttons
                        type="submit"
                        className="bg-btnColor mb-0 w-fit px-4 py-2 rounded-md text-white"
                    >
                        {saving ? "Saving..." : "Create Room"}
                    </Buttons>
                </form>
            </div>
        </div>
    );
};

export default NewRoom;
