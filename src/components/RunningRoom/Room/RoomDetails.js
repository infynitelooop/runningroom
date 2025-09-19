import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../../InputField/InputField";
import { Blocks } from "react-loader-spinner";
import Buttons from "../../../utils/Buttons";
import toast from "react-hot-toast";
import Errors from "../../Errors";
import { RoomStatus, RoomType, CrewType, AttachmentType, RoomCategory } from "../enum";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";


const RoomDetails = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            roomId: "",
            roomNumber: "",
            roomType: "",
            capacity: "",
            status: "",
        },
        mode: "onSubmit",
    });

    const { roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const resetStatesAndStartLoading = () => {
        setError(null);
        setUpdateError(null);
        setSuccessMessage(null);
    };


    const fetchRoomDetails = useCallback(async () => {
        //resetStatesAndStartLoading();
        try {
            const response = await api.get(`/rooms/${roomId}`);
            setRoom(response.data);

            // set values for react-hook-form
            setValue("roomId", response.data.id);
            setValue("roomNumber", response.data.roomNumber);
            setValue("roomType", response.data.roomType);
            setValue("ac", response.data.ac);
            setValue("capacity", response.data.capacity);
            setValue("floor", response.data.floor);
            setValue("status", response.data.status);
            setValue("buildingName", response.data.buildingName);
            setValue("crewType", response.data.crewType);
            setValue("roomCategory", response.data.roomCategory);
            setValue("beds", response.data.beds);
            setValue("attachment", response.data.attachment);
            setValue("status", response.data.status);
            setValue("discription", response.data.description);
        } catch (err) {
            setError(err?.response?.data?.message || "Error fetching room details");
            console.error("Error fetching room details", err);
        } finally {
            setLoading(false);
        }
    }, [roomId, setValue]);

    useEffect(() => {
        fetchRoomDetails();
    }, [fetchRoomDetails]);

    const handleSave = async (data) => {
        setSaving(true);
        resetStatesAndStartLoading();
        try {
            await api.put(`/rooms`, data);
            setSuccessMessage("Room updated successfully");
            toast.success("Room updated successfully");
            fetchRoomDetails(); // refresh data
            window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
        } catch (err) {
            const apiError = err?.response?.data;

            if (apiError && Array.isArray(apiError)) {
                // multiple validation errors
                const messages = err.response.data.map(e => e.message);
                setUpdateError(messages); 
            } else {
                // single error fallback
                setUpdateError([apiError?.message || "Failed to update room"]);
            }
            window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to error banner
            console.error("Error updating room:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;

        try {
            setDeleting(true);
            await api.delete(`/rooms/${roomId}`);
            toast.success("Room deleted successfully");
            navigate("/admin/rooms");
        } catch (err) {
            setUpdateError(err?.response?.data?.message || "Failed to delete room");
            console.error("Error deleting room:", err);
        } finally {
            setDeleting(false);
        }
    };

    if (error) {
        return <Errors message={error} />;
    }

    return (
        <div className="sm:px-12 px-4 py-10">
            {loading ? (
                <div className="flex flex-col justify-center items-center h-72">
                    <Blocks height="70" width="70" color="#4fa94d" ariaLabel="loading" />
                    <span>Please wait...</span>
                </div>
            ) : (
                room && (
                    <div className="lg:w-[70%] sm:w-[90%] w-full mx-auto shadow-lg shadow-gray-300 p-8 rounded-md">
                        <h1 className="text-slate-800 text-2xl font-bold pb-4">
                            Room Details
                            <hr />
                        </h1>
                        {updateError && Array.isArray(updateError) && (
                            <div className="bg-red-100 text-red-700 px-4 py-2 rounded relative mb-4">
                                <ul className="list-disc pl-5">
                                    {updateError.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-100  text-green-700 px-4 py-2 rounded relative mb-4">
                                {successMessage}
                            </div>
                        )}

                        <form
                            className="flex flex-col gap-4"
                            onSubmit={handleSubmit(handleSave)}
                        >
                            {/* Room No */}
                            <InputField
                                label="Room Number"
                                id="roomNumber"
                                type="text"
                                placeholder="Enter Room Number"
                                register={register}
                                errors={errors}
                                message="*Room number is required"
                                readOnly={true}
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

                            {/* Capacity */}
                            <InputField
                                label="Capacity"
                                required
                                id="capacity"
                                type="number"
                                placeholder="Enter Capacity"
                                register={register}
                                errors={errors}
                                message="*Capacity is required"
                            />

                            {/* Floor */}
                            <InputField
                                label="Floor"
                                required
                                id="floor"
                                type="number"
                                placeholder="Enter Floor"
                                register={register}
                                errors={errors}
                                message="*Floor is required"
                            />

                            {/* Building */}
                            <div>
                                <label className="block text-slate-700 font-semibold pb-1">
                                    Building
                                </label>
                                <select
                                    {...register("building", { required: "*Building is required" })}
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
                                    {...register("crewType", { required: "*Room type is required" })}
                                    className="border p-2 rounded w-full"
                                >
                                    {CrewType.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
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
                                    {...register("category", { required: "*Room category is required" })}
                                    className="border p-2 rounded w-full"
                                >
                                    {RoomCategory.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
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
                                placeholder="Enter Floor"
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
                                    {AttachmentType.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.attachment && (
                                    <p className="text-red-500 text-sm">{errors.attachment.message}</p>
                                )}
                            </div>

                            {/* Status */}
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


                            <div className="flex gap-2 mt-4">
                                <Buttons
                                    type="submit"
                                    className="bg-btnColor mb-0 w-fit px-4 py-2 rounded-md text-white"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </Buttons>

                                <Buttons
                                    type="button"
                                    className="bg-red-500 hover:bg-red-600 mb-0 w-fit px-4 py-2 rounded-md text-white"
                                    onClick={handleDelete}
                                >
                                    {deleting ? "Deleting..." : <FaTrash className="h-5 w-5" />}
                                </Buttons>
                            </div>
                        </form>
                    </div>
                )
            )}
        </div>
    );
};

export default RoomDetails;
