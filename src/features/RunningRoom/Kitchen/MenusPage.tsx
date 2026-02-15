import { useMenusService, Menu, MenuItem } from "./hooks/useMenusService.ts";
import DailyMenuCard from "./DailyMenuCard.tsx";
import WeeklyMenuTable from "./WeeklyMenuTable.tsx";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import MenuFormDialog from "./MenuFormDialog.tsx";
import MenuItemFormDialog from "./MenuItemFormDialog.tsx";
import { MdSkipPrevious, MdSkipNext, MdContentCopy } from "react-icons/md";


import isoWeek from "dayjs/plugin/isoWeek";

// Main component for managing menus
export default function MenusPage() {

  // State variables
  const [view, setView] = useState("weekly");
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedDate, setselectedDate] = useState(dayjs());
  const [error, setError] = useState("");

  const [openMenuDialog, setOpenMenuDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const service = useMenusService();

  const weekStart = selectedDate.startOf("isoWeek");
  const currentWeekStart = dayjs().startOf("isoWeek");

  const isCurrentWeek = weekStart.isSame(currentWeekStart, "day");
  const isPastWeek = weekStart.isBefore(currentWeekStart, "day");
  const isFutureWeek = weekStart.isAfter(currentWeekStart, "day");


  // Fetch menus based on current view and date
  const fetchMenus = async () => {
    try {
      setMenus([]);
      if (view === "weekly") {

        dayjs.extend(isoWeek);
        //const selectedDate = dayjs();

        // If today is Sunday, shift back 1 day to Saturday before finding isoWeek start
        const adjustedDate = selectedDate.day() === 0 ? selectedDate.subtract(1, "day") : selectedDate;

        const startOfWeek = adjustedDate.startOf("isoWeek").format("YYYY-MM-DD");
        const endOfWeek = adjustedDate.endOf("isoWeek").format("YYYY-MM-DD");

        setMenus(await service.fetchWeekly(startOfWeek, endOfWeek));
      } else {
        const today = selectedDate.format("YYYY-MM-DD");
        const menu = await service.fetchDaily(today);
        setMenus(menu ? [menu] : []);
      }
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load menus");
    }
  };

  // Copy this week's menu to current week
  const copyThisWeeksMenuToCurrentWeek = async () => {

    if (window.confirm("Are you sure you want to copy this menu to current week? All the current week's menu will be overwritten !")) {

      try {
        if (menus.length === 0) {
          setError("No menu found for the previous week to copy.");
          return;
        }

        dayjs.extend(isoWeek);

        // Get start of the week for the current selected date
        const sourceStart = selectedDate.startOf("isoWeek").format("YYYY-MM-DD");

        // dayjs() returns current date and time (similar to new Date() in JavaScript)
        const targetStart = dayjs().startOf("isoWeek").format("YYYY-MM-DD");

        await service.copyWeeklyMenu(sourceStart, targetStart);

        setselectedDate(dayjs()); // Navigate to current week
        await fetchMenus(); // refresh
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to copy weekly menus");
      }
    }
  };

  const copyPreviousWeeksMenuToSelectedtWeek = async () => {
    if (window.confirm("Are you sure you want to copy the previous week's menu to the current week? All the current week's menu will be overwritten!")) {
      try {

        const previousWeekDate = selectedDate.subtract(1, "week");

        // If the date is Sunday, shift back 1 day to Saturday before finding isoWeek start
        const previousWeekAdjustedDate = previousWeekDate.day() === 0 ? previousWeekDate.subtract(1, "day") : previousWeekDate;

        const previousWeekStart = previousWeekAdjustedDate.startOf("isoWeek").format("YYYY-MM-DD");
        const previousWeekEnd = previousWeekAdjustedDate.endOf("isoWeek").format("YYYY-MM-DD");

        // fetch the previous weeks menu to check if it exists
        setMenus(await service.fetchWeekly(previousWeekStart, previousWeekEnd));

        const fetchedMenus = await service.fetchWeekly(previousWeekStart, previousWeekEnd);
        if (fetchedMenus.length === 0) {
          setError("No menu found for the previous week to copy.");
          return;
        }

        // Get start of previous week
        const sourceStart = previousWeekStart;
        // Get start of current week
        const targetStart = selectedDate.startOf("isoWeek").format("YYYY-MM-DD");

        await service.copyWeeklyMenu(sourceStart, targetStart);

        setselectedDate(dayjs()); // Navigate to current week
        await fetchMenus(); // refresh
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to copy previous week's menu");
      }
    }
  };


  const copyThisMenuToCurrentDay = async () => {
    if (window.confirm("Are you sure you want to copy this menu to today? The current day's menu will be overwritten!")) {
      try {
        if (menus.length === 0) return;

        const sourceDate = selectedDate.format("YYYY-MM-DD");
        const targetDate = dayjs().format("YYYY-MM-DD");

        await service.copyDailyMenu(sourceDate, targetDate);

        setselectedDate(dayjs()); // Navigate to today
        await fetchMenus(); // refresh
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to copy daily menu");
      }
    }
  };

  // Fetch menus when view or date changes
  useEffect(() => {
    fetchMenus();
    // eslint-disable-next-line
  }, [view, selectedDate]);

  const handleSaveMenu = async (data: Omit<Menu, "id">) => {
    if (selectedMenu) {
      await service.updateMenu(selectedMenu.id, data);
    } else {
      await service.createMenu(data);
    }
    setOpenMenuDialog(false);
    setSelectedMenu(null);
    fetchMenus();
  };

  // Handle menu deletion
  const handleDeleteMenu = async (menuId: string) => {
    if (window.confirm("Are you sure you want to delete this menu?")) {
      await service.deleteMenu(menuId);
      fetchMenus();
    }
  };

  // Handle menu item save
  const handleSaveItem = async (menuId: string, data: MenuItem) => {
    if (selectedItem?.id) {
      await service.updateMenuItem(menuId, selectedItem.id, data);
    } else {
      await service.addMenuItem(menuId, data);
    }
    setOpenItemDialog(false);
    setSelectedItem(null);
    fetchMenus();
  };

  // Handle menu item deletion
  const handleDeleteItem = async (menuId: string, itemId: string) => {
    if (window.confirm("Delete this item?")) {
      await service.deleteMenuItem(menuId, itemId);
      fetchMenus();
    }
  };

  const handleViewChange = (newView: "weekly" | "daily") => {
    setView(newView);
    setselectedDate(dayjs());
  };

  // ... existing return
  return (
    <div className="p-6 space-y-6">
      {/* Controls ... same */}

      <div className="flex justify-center ">
        <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">Menu</h1>
      </div>

      <div className="flex justify-center items-center gap-4 mb-4">

        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="menu-view"
            value="weekly"
            checked={view === "weekly"}
            onChange={() => handleViewChange("weekly")}
            className="accent-blue-600"
          />
          Weekly
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="menu-view"
            value="daily"
            checked={view === "daily"}
            onChange={() => handleViewChange("daily")}
            className="accent-blue-600"
          />
          Daily
        </label>
      </div>

      <div className="flex justify-center items-center gap-4 mb-4">
        <button
          className="p-2 rounded hover:bg-gray-200"
          onClick={() => setselectedDate(d => view === "weekly" ? d.subtract(1, "week") : d.subtract(1, "day"))}
          aria-label="Previous"
        >
          <MdSkipPrevious className="w-6 h-6" />
        </button>
        <span className="font-semibold">
          {view === "weekly"
            ? `${selectedDate.startOf("isoWeek").format("DD MMM")} - ${selectedDate.endOf("isoWeek").format("DD MMM YYYY")}`
            : selectedDate.format("dddd, DD MMM YYYY")}
        </span>
        <button
          className="p-2 rounded hover:bg-gray-200"
          onClick={() => setselectedDate(d => view === "weekly" ? d.add(1, "week") : d.add(1, "day"))}
          aria-label="Next"
        >
          <MdSkipNext className="w-6 h-6" />
        </button>

        {/* If not current week/day, show copy button */}
        {view === "weekly" && isPastWeek && menus.length > 0 && (
          <div className="w-32 flex ">
            <div className="relative group">
              <button
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                onClick={copyThisWeeksMenuToCurrentWeek}
                aria-label="Copy to Current Week"
              >
                <MdContentCopy className="w-4 h-4" />
              </button>
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-400 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                Copy to Current Week
              </span>
            </div>
          </div>
        )}

        {/* If not current week/day, show copy button */}
        {view === "weekly" && (isCurrentWeek || isFutureWeek) && (
          <div className="w-32 flex ">
            <div className="relative group">
              <button
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                onClick={copyPreviousWeeksMenuToSelectedtWeek}
                aria-label="Copy from previous week"
              >
                <MdContentCopy className="w-4 h-4" />
              </button>
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-400 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                Copy from previous week
              </span>
            </div>
          </div>
        )}

        {view === "daily" && !selectedDate.isSame(dayjs(), "day") && menus.length > 0 && (
          <div className="w-32 flex justify-end">
            <div className="relative group">
              <button
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                onClick={copyThisMenuToCurrentDay}
                aria-label="Copy to Today"
              >
                <MdContentCopy className="w-4 h-4" />
              </button>
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                Copy to Today
              </span>
            </div>
          </div>
        )}

      </div>



      {/* Daily or Weekly view */}
      {view === "daily" ? (
        menus.length > 0 ? (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <DailyMenuCard
                menu={menus[0]}
                onEditMenu={(menu) => {
                  setSelectedMenu(menu);
                  setOpenMenuDialog(true);
                }}
                onDeleteMenu={handleDeleteMenu}
                onAddItem={(menu) => {
                  setSelectedMenu(menu);
                  setOpenItemDialog(true);
                }}
                onEditItem={(menu, item) => {
                  setSelectedMenu(menu);
                  setSelectedItem(item);
                  setOpenItemDialog(true);
                }}
                onDeleteItem={handleDeleteItem}
              />
            </div>
          </div>
        ) : null
      ) : (
        menus.length > 0 ? (
          <WeeklyMenuTable
            menus={menus}
            onEditMenu={(menu) => {
              setSelectedMenu(menu);
              setOpenMenuDialog(true);
            }}
            onDeleteMenu={handleDeleteMenu}
          />
        ) : null
      )}
      {error && <p className="flex justify-center text-red-500">{error}</p>}


      {/* Menu Form Dialog */}
      <MenuFormDialog
        open={openMenuDialog}
        onClose={() => {
          setOpenMenuDialog(false);
          setSelectedMenu(null);
        }}
        onSubmit={handleSaveMenu}
        initialData={selectedMenu || undefined}
      />

      {/* Menu Item Form Dialog */}
      <MenuItemFormDialog
        open={openItemDialog}
        onClose={() => {
          setOpenItemDialog(false);
          setSelectedItem(null);
        }}
        onSubmit={(data) => selectedMenu && handleSaveItem(selectedMenu.id, data)}
        initialData={selectedItem || undefined}
      />
    </div>
  );
}
