import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../../InputField/InputField";
import { Blocks } from "react-loader-spinner";
import Buttons from "../../../utils/Buttons";
import toast from "react-hot-toast";
import Errors from "../../Errors";
import { RoomStatus, RoomType } from "../enum";

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
    const [successMessage, setSuccessMessage] = useState(null);

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
            setValue("capacity", response.data.capacity);
            setValue("status", response.data.status);
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
        } catch (err) {
            setUpdateError(err?.response?.data?.message || "Failed to update room"); // store for display
            console.error("Error updating room:", err);
        } finally {
            setSaving(false);
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

                        {updateError && (
                            <div className="bg-red-100  text-red-700 px-4 py-2 rounded relative mb-4">
                                {updateError}
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
                                required
                                id="capacity"
                                type="number"
                                placeholder="Enter Capacity"
                                register={register}
                                errors={errors}
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
                                {saving ? "Saving..." : "Save Changes"}
                            </Buttons>
                        </form>
                    </div>
                )
            )}
        </div>
    );
};

export default RoomDetails;
