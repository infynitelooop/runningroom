import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import InputField from "../../../utils/InputField.tsx";
import Buttons from "../../../utils/Buttons.tsx";

export type RoomFormInputs = {
  id?: string;
  roomNumber: string;
  roomType: string;
  ac: boolean;
  capacity: number;
  floor: number;
  buildingId: string;
  crewType: string;
  roomCategory: string;
  bedCount: number;
  attachment: string;
  status: string;
  description?: string;
};

type EnumOption = { key: string; label: string };
type Building = { id: string; buildingName: string };

type RoomFormProps = {
  defaultValues: RoomFormInputs;
  onSubmit: SubmitHandler<RoomFormInputs>;
  enums: {
    roomTypes: EnumOption[];
    crewTypes: EnumOption[];
    roomCategory: EnumOption[];
    attachmentType: EnumOption[];
    roomStatus: EnumOption[];
  };
  buildings: Building[];
  saving?: boolean;
  readOnlyRoomNumber?: boolean;
};

const RoomForm: React.FC<RoomFormProps> = ({
  defaultValues,
  onSubmit,
  enums,
  buildings,
  saving = false,
  readOnlyRoomNumber = false,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<RoomFormInputs>({
    defaultValues,
  });

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="Room Number"
        id="roomNumber"
        type="text"
        placeholder="Enter Room Number"
        register={register}
        errors={errors}
        message="*Room number is required"
        required
        readOnly={readOnlyRoomNumber}
      />

      {/* Room Type */}
      <div>
        <label className="block text-slate-700 font-semibold pb-1">Room Type</label>
        <select {...register("roomType", { required: "*Room type is required" })} className="border p-2 rounded w-full">
          {enums.roomTypes.map(rt => (
            <option key={rt.key} value={rt.key}>{rt.label}</option>
          ))}
        </select>
      </div>

      {/* AC */}
      <div>
        <label className="block text-slate-700 font-semibold pb-1">AC</label>
        <select {...register("ac", { required: "*AC is required" })} className="border p-2 rounded w-full">
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div>

      <InputField label="Capacity" id="capacity" type="number" register={register} errors={errors} required message="*Capacity is required" />
      <InputField label="Floor" id="floor" type="number" register={register} errors={errors} required message="*Floor is required" />

      {/* Building */}
      <div>
        <label className="block text-slate-700 font-semibold pb-1">Building</label>
        <select {...register("buildingId", { required: "*Building is required" })} className="border p-2 rounded w-full">
          {buildings.map(b => (
            <option key={b.id} value={b.id}>{b.buildingName}</option>
          ))}
        </select>
      </div>

      {/* Crew Type */}
      <div>
        <label className="block text-slate-700 font-semibold pb-1">Crew Type</label>
        <select {...register("crewType", { required: "*Crew type is required" })} className="border p-2 rounded w-full">
          {enums.crewTypes.map(rt => (
            <option key={rt.key} value={rt.key}>{rt.label}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-slate-700 font-semibold pb-1">Category</label>
        <select {...register("roomCategory", { required: "*Room category is required" })} className="border p-2 rounded w-full">
          {enums.roomCategory.map(rt => (
            <option key={rt.key} value={rt.key}>{rt.label}</option>
          ))}
        </select>
      </div>

      {/* Beds */}
      <InputField label="Bed Count" id="bedCount" type="number" register={register} errors={errors} required message="*Beds is required" />

      {/* Attachment */}
      <div>
        <label className="block text-slate-700 font-semibold pb-1">Attachment</label>
        <select {...register("attachment", { required: "*Attachment type is required" })} className="border p-2 rounded w-full">
          {enums.attachmentType.map(rt => (
            <option key={rt.key} value={rt.key}>{rt.label}</option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-slate-700 font-semibold pb-1">Status</label>
        <select {...register("status", { required: "*Status is required" })} className="border p-2 rounded w-full">
          {enums.roomStatus.map(rt => (
            <option key={rt.key} value={rt.key}>{rt.label}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="md:col-span-2 lg:col-span-3">
        <label className="block text-slate-700 font-semibold pb-1">Description</label>
        <textarea {...register("description")} className="border p-2 rounded w-full" rows={3} placeholder="Enter room description" />
      </div>

      {/* Submit Button */}
      <div className="md:col-span-2 lg:col-span-3 flex justify-end">
        <Buttons type="submit" className="bg-btnColor mb-0 w-fit px-4 py-2 rounded-md text-white">
          {saving ? "Saving..." : "Submit"}
        </Buttons>
      </div>
    </form>
  );
};

export default RoomForm;
