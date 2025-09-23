import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../services/api";
import InputField from "../../InputField/InputField";

import Buttons from "../../../utils/Buttons";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEnums } from "../../../store/EnumsContext";

const NewRoom = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            roomNumber: "",
            capacity: "",
            floor: ""
        },
        mode: "onSubmit",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { enums, enumLoading } = useEnums();

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


    if (enumLoading) return <p>Loading enums...</p>;
    if (!enums) return <p>Failed to load enums</p>;


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

                    {/* Room Type */}
                    <div>
                        <label className="block text-slate-700 font-semibold pb-1">
                            Room Type
                        </label>
                        <select
                            {...register("roomType", { required: "*Room type is required" })}
                            className="border p-2 rounded w-full"
                        >
                            {enums.roomTypes.map((rt) => (
                                <option key={rt.key} value={rt.key}>
                                    {rt.label}
                                </option>
                            ))}
                        </select>
                        {errors.roomType && (
                            <p className="text-red-500 text-sm">{errors.roomType.message}</p>
                        )}
                    </div>

                    {/* AC */}
                    <div>
                        <label className="block text-slate-700 font-semibold pb-1">
                            AC
                        </label>
                        <select
                            {...register("ac", { required: "*AC is required" })}
                            className="border p-2 rounded w-full"
                        >
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                        </select>
                        {errors.ac && (
                            <p className="text-red-500 text-sm">{errors.ac.message}</p>
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

                    {/* Building */}
                    <div>
                        <label className="block text-slate-700 font-semibold pb-1">
                            Building
                        </label>
                        <select
                            {...register("buildingName", { required: "*Building is required" })}
                            className="border p-2 rounded w-full"
                        >
                            {["A", "B", "C", "D"].map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        {errors.building && (
                            <p className="text-red-500 text-sm">{errors.building.message}</p>
                        )}
                    </div>

                    {/* Crew Type */}
                    <div>
                        <label className="block text-slate-700 font-semibold pb-1">
                            Crew Type
                        </label>
                        <select
                            {...register("crewType", { required: "*Crew type is required" })}
                            className="border p-2 rounded w-full"
                        >
                            {enums.crewTypes.map((rt) => (
                                <option key={rt.key} value={rt.key}>
                                    {rt.label}
                                </option>
                            ))}
                        </select>
                        {errors.crewType && (
                            <p className="text-red-500 text-sm">{errors.roomType.message}</p>
                        )}
                    </div>


                    {/* Category */}
                    <div>
                        <label className="block text-slate-700 font-semibold pb-1">
                            Category
                        </label>
                        <select
                            {...register("roomCategory", { required: "*Room category is required" })}
                            className="border p-2 rounded w-full"
                        >
                            {enums.roomCategory.map((rt) => (
                                <option key={rt.key} value={rt.key}>
                                    {rt.label}
                                </option>
                            ))}

                        </select>
                        {errors.category && (
                            <p className="text-red-500 text-sm">{errors.category.message}</p>
                        )}
                    </div>

                    {/* Beds */}
                    <InputField
                        label="Beds"
                        required
                        id="beds"
                        type="number"
                        placeholder="Enter No Of Beds"
                        register={register}
                        errors={errors}
                        message="*Beds is required"
                    />

                    {/* Attachment */}
                    <div>
                        <label className="block text-slate-700 font-semibold pb-1">
                            Attachment
                        </label>
                        <select
                            {...register("attachment", { required: "*Attachment type is required" })}
                            className="border p-2 rounded w-full"
                        >
                            {enums.attachmentType.map((rt) => (
                                <option key={rt.key} value={rt.key}>
                                    {rt.label}
                                </option>
                            ))}

                        </select>
                        {errors.attachment && (
                            <p className="text-red-500 text-sm">{errors.attachment.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-slate-700 font-semibold pb-1">
                            Status
                        </label>
                        <select
                            {...register("status", { required: "*Status is required" })}
                            className="border p-2 rounded w-full"
                        >
                            {enums.roomStatus.map((rt) => (
                                <option key={rt.key} value={rt.key}>
                                    {rt.label}
                                </option>
                            ))}
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-sm">{errors.status.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-slate-700 font-semibold pb-1">
                            Description
                        </label>
                        <textarea
                            className="border p-2 rounded w-full"
                            rows={3}
                            placeholder="Enter room description"
                        ></textarea>
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
