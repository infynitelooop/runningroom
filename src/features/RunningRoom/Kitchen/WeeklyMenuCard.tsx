import React from "react";
import dayjs from "dayjs";

type MenuItem = {
  id?: string;
  name: string;
  description: string;
  price: number;
  mealType: string;
  mealCategory: string;
};

type Menu = {
  id: string;
  menuDate: string;
  items: MenuItem[];
};

const MEAL_ORDER = ["BREAKFAST", "LUNCH", "DINNER", "SNACKS"];

type WeeklyMenuTableProps = {
  menus: Menu[];
  onEditMenu?: (menu: Menu) => void;
  onDeleteMenu?: (menuId: string) => void;
};

export default function WeeklyMenuTable({
  menus,
  onEditMenu,
  onDeleteMenu,
}: WeeklyMenuTableProps) {
  
  // Index menus by date for quick lookup
  const menusByDate: Record<string, Menu> = {};
  menus.forEach(menu => {
    menusByDate[dayjs(menu.menuDate).format("YYYY-MM-DD")] = menu;
  });

  // Get sorted list of dates in the week
  const weekDates = [...new Set(menus.map(m => dayjs(m.menuDate).format("YYYY-MM-DD")))].sort();

  return (
    <table className="min-w-full border mt-4">
      <thead>
        <tr>
          <th className="border px-2 py-1">Meal Type</th>
          {weekDates.map(date => (
            <th key={date} className="border px-2 py-1">
              {dayjs(date).format("ddd, MMM D")}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {MEAL_ORDER.map(meal => (
          <tr key={meal}>
            <td className="border px-2 py-1 font-bold">{meal}</td>
            {weekDates.map(date => {
              const menu = menusByDate[date];
              const items = menu?.items.filter(i => i.mealType === meal) || [];
              return (
                <td key={date} className="border px-2 py-1">
                  {items.length > 0 ? (
                    <ul className="list-disc ml-4">
                      {items.map(item => (
                        <li key={item.id}>
                          {item.name} ({item.mealCategory}) - ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "-"
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
