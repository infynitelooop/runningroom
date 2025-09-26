import { useMenusService, Menu, MenuItem } from "./hooks/useMenusService.ts";
import DailyMenuCard from "./DailyMenuCard.tsx";
import WeeklyMenu from "./WeeklyMenu.tsx";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import MenuFormDialog from "./MenuFormDialog.tsx";
import MenuItemFormDialog from "./MenuItemFormDialog.tsx";
import { Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue, } from "../../../features/ui/select.tsx";

// Main component for managing menus
export default function MenusPage() {

  // State variables
  const [view, setView] = useState("weekly");
  const [menus, setMenus] = useState<Menu[]>([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [error, setError] = useState("");

  const [openMenuDialog, setOpenMenuDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const service = useMenusService();



  // Fetch menus based on current view and date
  const fetchMenus = async () => {
    try {
      if (view === "weekly") {
        const startOfWeek = currentDate.startOf("week").format("YYYY-MM-DD");
        const endOfWeek = currentDate.endOf("week").format("YYYY-MM-DD");
        setMenus(await service.fetchWeekly(startOfWeek, endOfWeek));
      } else {
        const today = currentDate.format("YYYY-MM-DD");
        const menu = await service.fetchDaily(today);
        setMenus(menu ? [menu] : []);
      }
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load menus");
    }
  };

  // Fetch menus when view or date changes
  useEffect(() => {
    fetchMenus();
    // eslint-disable-next-line
  }, [view, currentDate]);

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

  // ... existing return
  return (
    <div className="p-6 space-y-6">
      {/* Controls ... same */}

      {/* View selection dropdown */}
      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="menu-view" className="font-semibold">View:</label>
        <Select value={view} onValueChange={setView}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly Menu</SelectItem>
            <SelectItem value="daily">Daily Menu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Daily or Weekly view */}
      {view === "daily" ? (
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
      ) : (
        <WeeklyMenu
          menus={menus}
          onEditMenu={(menu) => {
            setSelectedMenu(menu);
            setOpenMenuDialog(true);
          }}
          onDeleteMenu={handleDeleteMenu}
        />
      )}
      {error && <p className="text-red-500">{error}</p>}


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
