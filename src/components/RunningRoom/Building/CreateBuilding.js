import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../services/api";
import toast from "react-hot-toast";
import Buttons from "../../../utils/Buttons.tsx";
import { useNavigate } from "react-router-dom";

const CreateBuilding = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      buildingName: "",
      address: "",
      description: ""
    },
  });

  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await api.post("/buildings", data);
      toast.success("Building created successfully");
      reset();
      navigate("/admin/buildings"); // redirect to building list
    } catch (err) {
      console.error("Error creating building", err);
      const msg = err?.response?.data?.message || "Failed to create building";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sm:px-12 px-4 py-10">
      <div className="lg:w-[70%] sm:w-[90%] w-full mx-auto shadow-lg shadow-gray-300 p-8 rounded-md">
        <h1 className="text-slate-800 text-2xl font-bold pb-4">
          Create New Building
          <hr />
        </h1>

        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Building Name */}
          <div>
            <label className="block text-slate-700 font-semibold pb-1">Building Name</label>
            <input
              {...register("buildingName", { required: "*Building name is required" })}
              type="text"
              className="border p-2 rounded w-full"
              placeholder="Enter building name"
            />
            {errors.buildingName && (
              <p className="text-red-500 text-sm">{errors.buildingName.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-slate-700 font-semibold pb-1">Address</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              placeholder="Enter building address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-semibold pb-1">Description</label>
            <textarea
              {...register("description")}
              className="border p-2 rounded w-full"
              rows={3}
              placeholder="Enter building description (optional)"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Buttons
              type="submit"
              className="bg-btnColor mb-0 w-fit px-4 py-2 rounded-md text-white"
            >
              {saving ? "Saving..." : "Create Building"}
            </Buttons>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBuilding;
