import React from "react";
import dayjs from "dayjs";
import DailyMenuCard from "./DailyMenuCard.tsx";


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

type WeeklyMenuTableProps = {
  menus: Menu[];
  onEditMenu?: (menu: Menu) => void;
  onDeleteMenu?: (menuId: string) => void;
  cardClassName?: string;
};

const CARD_COLORS = [
  "bg-blue-50",
  "bg-green-50",
  "bg-yellow-50",
  "bg-pink-50",
  "bg-purple-50",
  "bg-orange-50",
  "bg-teal-50",
];

export default function WeeklyMenuTable({
  menus,
  onEditMenu,
  onDeleteMenu,
}: WeeklyMenuTableProps) {
  const sortedMenus = [...menus].sort((a, b) =>
    dayjs(a.menuDate).isBefore(dayjs(b.menuDate)) ? -1 : 1
  );

  return (
    <div
      className="
    grid
    grid-cols-2
    sm:grid-cols-3
    md:grid-cols-4
    lg:grid-cols-5
    xl:grid-cols-6
    gap-2
    py-2
  "
    >
      {sortedMenus.map((menu, idx) => (
        <div key={menu.id} className="min-w-[180px]">
          <DailyMenuCard
            menu={menu}
            onEditMenu={onEditMenu}
            onDeleteMenu={onDeleteMenu}
            cardClassName={`text-xs px-1 py-1 ${CARD_COLORS[idx % CARD_COLORS.length]}`}
          />
        </div>
      ))}
    </div>
  );
}