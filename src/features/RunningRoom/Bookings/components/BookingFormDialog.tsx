import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog.tsx";
import { Input } from "../../../ui/input.tsx";
import { Label } from "../../../ui/label.tsx";
import { Button } from "../../../ui/button.tsx";
import api from "../../../../services/api";

export type Bed = {
  bookingId: number;
  occupancyStatus: string;
  bedNumber: string;
  roomNumber: string;
  buildingName: string;
  crewId?: string;
  crewName?: string;
  crewDesignation?: string;
  crewType?: string;
  mealType?: string;
  vegNonVeg?: string;
  checkInTime?: string;
  checkOutTime?: string;
  subsidizedFood?: boolean;
  attachmentPref?: string;
  signOffStation?: string;
  signOffDateTime?: string;
  restHours?: number;
  taSno?: string;
  ccId?: string;
  ccUserId?: string;
  signOffApprovalTime?: string;
  signOnNoV?: string;
  transactionTime?: string;
  noOfMeals?: number;
  wakeUpTime?: string;
};

type EnumOption = { key: string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: Bed) => void;
  initialData?: Bed;
  saving?: boolean;
  error?: string;
  enums: {
    roomStatus: EnumOption[];
  };
};

export function BookingFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  saving,
  error,
  enums,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Bed>({
    defaultValues: initialData || {
      bookingId: 0,
      occupancyStatus: "",
      bedNumber: "",
      roomNumber: "",
      buildingName: "",
    },
  });

  const [fetchingCrew, setFetchingCrew] = useState(false);
  const [crewError, setCrewError] = useState("");

  useEffect(() => {
    reset(initialData || {});
  }, [initialData, reset]);

  const crewId = watch("crewId");

  const handleFetchCrew = async () => {
    if (!crewId) {
      setCrewError("Please enter a Crew ID first.");
      return;
    }

    setCrewError("");
    setFetchingCrew(true);

    try {
      const response = await api.get(`/api/crew/${crewId}`);
      const crew = response.data;

      // Fill read-only fields
      setValue("crewName", crew.name || "");
      setValue("crewDesignation", crew.designation || "");
      setValue("crewType", crew.crewType || "");
    } catch (err: any) {
      setCrewError(err?.response?.data?.message || "Crew not found.");
      setValue("crewName", "");
      setValue("crewDesignation", "");
      setValue("crewType", "");
    } finally {
      setFetchingCrew(false);
    }
  };

  const onFormSubmit: SubmitHandler<Bed> = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
        <DialogHeader className="sticky top-0 z-10 bg-white border-b pb-3">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            ✏️ Edit Booking Details - Bed {initialData?.bedNumber} in Room {initialData?.roomNumber} ({initialData?.buildingName})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 py-4">

          {/* 🛏️ Bed Info */}
          <section className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-700 mb-3 flex items-center gap-2">🛏️ Bed Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="occupancyStatus">Occupancy Status</Label>

                <select {...register("occupancyStatus", { required: "*occupancyStatus is required" })} className="border p-2 rounded w-full">
                  {enums.roomStatus.map(rt => (
                    <option key={rt.key} value={rt.key}>{rt.label}</option>
                  ))}
                </select>


              </div>
            </div>
          </section>

          {/* 👨‍✈️ Crew Info */}
          <section className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-700 mb-3 flex items-center gap-2">👨‍✈️ Crew Info</h3>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="crewId">Crew ID</Label>
                <Input id="crewId" {...register("crewId")} />
              </div>

              <div className="flex items-center justify-start mt-6">
                <Button type="button" onClick={handleFetchCrew} disabled={fetchingCrew}>
                  {fetchingCrew ? "Fetching..." : "Fetch"}
                </Button>
              </div>
            </div>

            {crewError && <p className="text-red-500 text-sm mt-2">{crewError}</p>}

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="crewName">Crew Name</Label>
                <Input id="crewName" {...register("crewName")} readOnly />
              </div>

              <div>
                <Label htmlFor="crewDesignation">Crew Designation</Label>
                <Input id="crewDesignation" {...register("crewDesignation")} readOnly />
              </div>

              <div>
                <Label htmlFor="crewType">Crew Type</Label>
                <Input id="crewType" {...register("crewType")} readOnly />
              </div>
            </div>
          </section>

          {/* 🍽️ Meal Info */}
          <section className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-700 mb-3 flex items-center gap-2">🍽️ Meal Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mealType">Meal Type</Label>
                <Input id="mealType" {...register("mealType")} />
              </div>
              <div>
                <Label htmlFor="vegNonVeg">Veg/Non-Veg</Label>
                <Input id="vegNonVeg" {...register("vegNonVeg")} />
              </div>

              <div className="flex items-center space-x-2">
                <input id="subsidizedFood" type="checkbox" {...register("subsidizedFood")} className="h-4 w-4 accent-blue-600" />
                <Label htmlFor="subsidizedFood">Subsidized Food</Label>
              </div>

              <div>
                <Label htmlFor="noOfMeals">No of Meals</Label>
                <Input id="noOfMeals" type="number" {...register("noOfMeals", { valueAsNumber: true })} />
              </div>
            </div>
          </section>

          {/* ⏱️ Timings & Approvals */}
          <section className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-700 mb-3 flex items-center gap-2">⏱️ Timings & Approvals</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["checkInTime", "Check-In Time", "datetime-local"],
                ["checkOutTime", "Check-Out Time", "datetime-local"],
                ["signOffStation", "Sign-Off Station"],
                ["signOffDateTime", "Sign-Off DateTime", "datetime-local"],
                ["restHours", "Rest Hours", "number"],
                ["wakeUpTime", "Wake-Up Time", "datetime-local"],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <Label htmlFor={key}>{label}</Label>
                  <Input id={key} type={type || "text"} {...register(key as keyof Bed)} />
                </div>
              ))}
            </div>
          </section>

          {error && <p className="text-red-500">{error}</p>}

          {/* Footer Buttons */}
          <div className="sticky bottom-0 bg-white border-t pt-3 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
